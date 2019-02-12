
declare var calcularAcumulacion: any;
declare var calcularDesAcumulacion: any;
declare var pago: any;
export class LogicForm {

 public static formateador = new Intl.NumberFormat('es-CO', {currencyDisplay: 'symbol'});
  public static round(numero: number, precision: number) {
    const shift = function (num, pres, reverseShift) {
      if (reverseShift) {
        pres = -pres;
      }
      const numArray = ('' + num).split('e');
      return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + pres) : pres));
    };
    return this.formateador.format(shift(Math.round(shift(numero, precision, false)), precision, true));
  }


        /**
         * @param a[0] corresponde a tasaAnual
         * @param a[1] corresponde a plazoAnual
         * @param a[2] corresponde a inversionInicial
         */
        calcularDesAcumulacionNg(a: number[]) {
          let d: any;
          d = calcularDesAcumulacion(a);
          // console.log('FormularioComponent calcularDesAcumulacionNg ' + d  );
          // this.printObjD(d.saldosList);
          return d;
        }

        calcularPago(a: number[]) {
          let r: any;
          r = pago(a);

          return r;
        }

        /**
         * @param a[0] corresponde a tasaAnual
         * @param a[1] corresponde a plazoAnual
         * @param a[2] corresponde a aporteMensual
         * @param a[3] corresponde a inversionInicial
         * @param a[4] corresponde a incrementoAnual
         */
        calcularAcumulacionNg(a: number[]) {
          //calcularAcumulacionNg(a: number, b: number, c: number, d: number, e: number) {
          let g: any;
          g = calcularAcumulacion(a);
          // g = calcularAcumulacion(a, b, c, d, e);
          // console.log('FormularioComponent calcularAcumulacion g.serie1 ' + g.serieAcum1 +
          // ' g.serie2 ' + g.serieAcum1 + ' g.saldosList ' + g.saldosList);
           // this.printObj(g.saldosList);
           return g;
        }

        printObj(arr: any[]) {
          for (let i = 0; i < arr.length; i++ ) {
            console.log('printObj cuota ' + arr[i].cuota + ' saldoRent ' + arr[i].saldoRent +
            ' rentabilidad ' +  arr[i].rentabilidad + ' aporteTotal ' +  arr[i].aporteTotal +
            ' saldoUsar ' +  arr[i].saldoUsar + ' ipc ' +  arr[i].ipc );
          }
        }
        printObjD(arr: any[]) {
          for (let i = 0; i < arr.length; i++ ) {
            console.log('printObj cuota ' + arr[i].cuota + ' saldo ' + arr[i].saldo +
            ' interes ' +  arr[i].interes + ' capital ' +  arr[i].capital );
          }
        }
}
