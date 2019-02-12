var aporteTotalAcum = 0;
var rentabilidadAcum = 0;


function getTasaNominalMensual(tasaAnual) {
  var tnm = (Math.pow((1 + tasaAnual / 100 ) , 1 / 12 ) - 1);
  // console.log('getTasaNominalMensual tnm ' + tnm);
  return tnm;
}

function getPMT(interesMensual, periodos, montoActual) {
  var pmtN = montoActual / ((Math.pow((1 + interesMensual), (periodos * 12 )) - 1) /
     (interesMensual * Math.pow((1 + interesMensual), periodos * 12 )));
     return pmtN;
}

/**
 * @param {number[]} valoresFormulario - Arreglo con los valores del formulario
 * @param {number} valoresFormulario [0] - Corresponde a la tasaAnual de desacumulacion
 * @param {number} valoresFormulario [1] - Corresponde al plazo Anual  de desacumulacion
 * @param {number} valoresFormulario [2] - Corresponde al monto Total Ahorrado
 * @returns {number} resp - El resultado del calculo
 */
function pago(valoresFormulario) {

  tasaAnualDes = valoresFormulario[0];
  plazoAnualDes = valoresFormulario[1] * 12;
  montoTotalAhorrado = valoresFormulario[2];

  tasaNominalMensual =  getTasaNominalMensual( tasaAnualDes );
  resposePago = {};

  if(plazoAnualDes == 0){
	  resposePago.renta = montoTotalAhorrado;
  } else {
    resposePago.plazoRenta = plazoAnualDes;
    resposePago.renta = ((tasaNominalMensual * Math.pow((tasaNominalMensual + 1), plazoAnualDes )) *    montoTotalAhorrado  / ((Math.pow((1 + tasaNominalMensual ), plazoAnualDes )) - 1));
  }

  //(C39*(C39+1)^D39)*E39/(((1+C39)^D39)-1)

  return resposePago;
}

/**
   * @param {number[]} valoresFormulario - Arreglo con los valores del formulario
   * @param {number} valoresFormulario [0] - Corresponde a la tasaAnual
   * @param {number} valoresFormulario [1] - Corresponde al plazoAnual
   * @param {number} valoresFormulario [2] - Corresponde al aporteMensual
   * @param {number} valoresFormulario [3] - Corresponde a la inversionInicial
   * @param {number} valoresFormulario [4] - Corresponde al incrementoAnual
   * @returns {Object[]} response - Objeto con los atributos para las series
   * @returns {number[]} response[].serieAcum1 - La serie 1 de acumulacion
   * @returns {number[]} response[].serieAcum2 - La serie 2 de acumulacion
   * @returns {number[]} response[].saldosList - Lista con todos los calculos hechos
   * @returns {number[]} response[].montoTotalAhorrado - Sumatoria del monto total ahorrado
   */
function calcularAcumulacion(valoresFormulario) {
    tasaAnual = valoresFormulario[0];
    plazoAnual= valoresFormulario[1];
    aporteMensual = valoresFormulario[2];
    inversionInicial = valoresFormulario[3];
    incrementoAnual = valoresFormulario[4];
    plazoDesAnual = valoresFormulario[5];

    tasaNominalMensual =  getTasaNominalMensual( tasaAnual );
    hayIncrementoAnual = incrementoAnual > 0;
    plazo = plazoAnual * 12;
    mes = 0;
    anio = 0;
    aporteTotalAnt = aporteMensual;
    saldoRentAnt = 0;
    rentabilidadAnt = 0;
    saldoUsarAnt = 0;
    rentabilidadAcum = 0;
    aporteTotalAcum = 0;

    // console.log('calcularAcumulacion tasaNominalMensual ' + tasaNominalMensual);

    var listaSerie1 = [];
    var listaSerie2 = [];
    var saldosList = [];
    var response = {};


    for (var cuotaActual = 0; cuotaActual <= plazo; cuotaActual++) {
      var saldos = {};
      saldos.saldoRent = 0;
      saldos.ipc = 0;
      saldos.cuota = cuotaActual;

      if ( cuotaActual === 0) {
        saldos.saldoRent = inversionInicial;
        saldos.rentabilidad = saldos.saldoRent * tasaNominalMensual;
        saldos.aporteTotal = aporteTotalAnt;
        saldos.saldoUsar = saldos.saldoRent;
      } else {
          if ( mes >= 12 && mes % 12 === 0) {
            mes++;
            anio++;
            if (((anio * 12) + 1) === mes) {

              // console.log('aporteTotalAnt ' + aporteTotalAnt + ' saldos.ipc ' + saldos.ipc + ' incrementoAnual ' + incrementoAnual);
              if( hayIncrementoAnual ) {
                saldos.ipc = ((aporteTotalAnt + saldos.ipc )  * incrementoAnual / 100);
              }

              saldos.aporteTotal = aporteTotalAnt + saldos.ipc;
              // console.log('entro 24 cuotaActual  ' + cuotaActual + ' mes ' + mes
              // + ' saldos.ipc ' + saldos.ipc + ' saldos.aporteTotal ' + saldos.aporteTotal);
            } else {
              if( hayIncrementoAnual ) {
                saldos.ipc = (aporteTotalAnt  * incrementoAnual / 100);
              }

              saldos.aporteTotal = aporteMensual + saldos.ipc;
              // console.log('entro normal cuotaActual ' + cuotaActual + ' mes ' + mes
              // + ' saldos.ipc ' + saldos.ipc + ' saldos.aporteTotal ' + saldos.aporteTotal);
            }
          } else {
            mes++;
            saldos.aporteTotal = aporteTotalAnt;
          }
          saldos.saldoRent = saldoRentAnt + saldos.aporteTotal + rentabilidadAnt;
          saldos.rentabilidad = saldos.saldoRent * tasaNominalMensual;
          saldos.saldoUsar = saldoUsarAnt + saldos.aporteTotal;
          aporteTotalAcum += saldos.aporteTotal;
      }

      rentabilidadAcum += saldos.rentabilidad;

      saldosList.push(saldos);
      listaSerie1.push(saldos.saldoRent);
      listaSerie2.push(saldos.saldoUsar);

      saldoRentAnt = saldos.saldoRent;
      aporteTotalAnt = saldos.aporteTotal;
      rentabilidadAnt = saldos.rentabilidad;
      saldoUsarAnt = saldos.saldoUsar;
    }
    response.serieAcum1 = listaSerie1;
    response.serieAcum2 = listaSerie2;
    response.saldosList = saldosList;
    //response.montoTotalAhorrado = aporteTotalAcum + rentabilidadAcum + inversionInicial;
    if(plazoDesAnual === 0){
      response.montoTotalAhorrado = aporteTotalAcum + rentabilidadAcum + inversionInicial-rentabilidadAnt;
    } else {
      response.montoTotalAhorrado = aporteTotalAcum + rentabilidadAcum + inversionInicial;
    }

    //l
    //  response.plazoAcuAnual = valoresFormulario[1];
    //const montoActual = this.aporteTotalAcum + this.rentabilidadAcum + inversionInicial;
    //const montoAporteTotal = this.aporteTotalAcum + inversionInicial;

    console.log('calcularAcumulacion response ' + response);

    return response;
}

/**
   * @param {number[]} valoresFormulario - Arreglo con los valores del formulario
   * @param {number} valoresFormulario [0] - Corresponde a la tasaAnual
   * @param {number} valoresFormulario [1] - Corresponde al plazoAnual
   * @param {number} valoresFormulario [2] - Corresponde a la inversionInicial
   * @param {number} valoresFormulario [3] - Corresponde al plazoAnual de acumulacion
   * @returns {Object[]} response - Objeto con los atributos para las series
   * @returns {number[]} response[].serieDesAcum1 - La serie 1 de desacumulacion
   * @returns {number[]} response[].serieDesAcum2 - La serie 2 de desacumulacion
   * @returns {number[]} response[].saldosList - Lista con todos los calculos hechos
   * @returns {number[]} response[].pointStartSeries - Punto de inicio de las series
   */
function calcularDesAcumulacion(valoresFormulario) {
  tasaAnual = valoresFormulario[0];
  plazoAnual = valoresFormulario[1];
  inversionInicial = valoresFormulario[2];
  plazoAnualAcum = valoresFormulario[3];


  pointer = 0;
  plazo = plazoAnual * 12;
  saldoAnt = 0;
  interesAnt = 0;
  montoAporteTotalAnt = 0;
  saldosList = [];

  var listaSerie1 = [];
  var listaSerie2 = [];
  var response = {};

  if (plazoAnualAcum > 0 &&  plazoAnual > 0) {
    pointer = plazoAnualAcum * 12;
  }

  // console.log('calcularDesAcumulacion aporteTotalAcum ' + aporteTotalAcum + ' rentabilidadAcum ' + rentabilidadAcum + ' pointer ' + pointer);

  montoActual = aporteTotalAcum + rentabilidadAcum + inversionInicial;
  montoAporteTotal = aporteTotalAcum + inversionInicial;
  // console.log('calcularDesAcumulacion montoActual ' + montoActual + ' montoAporteTotal ' + montoAporteTotal);

  tasaMensual = this.getTasaNominalMensual(tasaAnual);
  retiro = this.getPMT(tasaMensual, plazoAnual, montoActual);

  for (var cuotaActual = 0; cuotaActual <= plazo; cuotaActual++) {
    var saldos = {};
    saldos.cuota = cuotaActual;

    if ( cuotaActual === 0) {
      saldos.saldo = montoActual;
      saldos.interes = montoActual * tasaMensual;
      saldos.capital = montoAporteTotal;
    } else {
      saldos.saldo = saldoAnt - retiro + interesAnt;
      saldos.interes = saldos.saldo * tasaMensual;
      saldos.capital = montoAporteTotalAnt - (montoAporteTotal / plazo);
    }

    saldosList.push(saldos);
    listaSerie1.push(saldos.saldo);
    listaSerie2.push(saldos.capital);

    saldoAnt = saldos.saldo;
    interesAnt = saldos.interes;
    montoAporteTotalAnt = saldos.capital;
  }
  response.serieDesAcum1 = listaSerie1;
  response.serieDesAcum2 = listaSerie2;
  response.saldosList = saldosList;
  response.pointStartSeries = pointer;
  //l
  //  response.plazoAcuAnual =valoresFormulario[3];
  // console.log('calcularDesAcumulacion tasaMensual ' + tasaMensual + ' retiro ' + retiro);

  return response;
}
