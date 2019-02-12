import { LogicForm } from './logic-form';
export class ArrayFormulas {
    valoresAcumulacion: number[];
    valoresDesacumulacion: number[];
    valoresPago: number[];
    logicSeries: LogicForm;
    saldos: number[];
    saldosD: number[];
    seriesResponse: any;

    constructor() { }

    public GetArrayFormulas(formulasList) {

        var distincNameFormula = formulasList.map(item => item.FomulaName)
            .filter((value, index, self) => self.indexOf(value) === index);

        console.log(distincNameFormula);
        let arrayFormulas: { name: string, valores: number[] }[] = [];

        distincNameFormula.forEach(element => {

            var array = this.ArrayFormulasByNameFormula(formulasList, element);
            var obj = { name: element, valores: array };
            arrayFormulas.push(obj);
        });


        return arrayFormulas
    }

    relacionarFormulas(objFile, keysCampos, formValue) {
        let formulasList: { FomulaName: string, position: string, key: string, value: any }[] = [];
        let keysValuesList: { key: string, value: any }[] = [];


        //foreach1
        keysCampos.forEach(itemKeys => {
            var obj = { key: itemKeys, value: formValue[itemKeys] };

            keysValuesList.push(obj);
        });

        keysValuesList.forEach(itemValues => {
            //foreach2
            objFile.forEach(itemfile => {

                if (itemValues.key == itemfile.key) {
                    itemfile.formulas.forEach(itemFormulas => {
                        let valor: number;
                        if (itemValues.value == "") {
                            valor = 0;
                        } else {

                            if (itemfile.controlType === 'currency') {
                                itemValues.value =  this.remplazaTodo(itemValues.value, '.', '');
                            }

                            valor = Number(itemValues.value);
                        }
                        var objFormula = {
                            FomulaName: itemFormulas.Fomula,
                            position: itemFormulas.position,
                            key: itemfile.key,
                            value: valor
                        };
                        formulasList.push(objFormula)
                    })
                }

            });
        });


        const arraysFormulas = this.GetArrayFormulas(formulasList)
        const response = this.getFormulasSeparadas(arraysFormulas);
        return response;
    }




    public ArrayFormulasByNameFormula(formulasList, nameFormula) {


        var filtro = formulasList.filter((item) => item.FomulaName === nameFormula);

        var b = filtro.sort(function (item, item1) {
            if (item.position > item1.position) {
                return 1;
            }
            if (item.position < item1.position) {
                return -1;
            }
            // a must be equal to b
            return 0;
            // return  item.position ;
        }).map(function (x) {
            return x.value;
        });
        return b;

    }

    public getFormulasSeparadas(valuesFormulas) {


        valuesFormulas.forEach(item => {
            switch (item.name) {
                case "desacumulacion":

                    this.valoresDesacumulacion = item.valores;
                    break;
                case "acumulacion":

                    this.valoresAcumulacion = item.valores;
                    break;
                case "pago":
                    this.valoresPago = item.valores;
                    break;
                default:
                    break;
            }
        });
        this.logicSeries = new LogicForm();

        let respAcum = this.logicSeries.calcularAcumulacionNg(this.valoresAcumulacion);
        this.seriesResponse = {};
        this.seriesResponse.ahorroSerieName = 'Ahorro';
        this.seriesResponse.rendimientosSerieName = 'Rendimientos';
        this.seriesResponse.ahorroSerie1 = respAcum.serieAcum1;
        this.seriesResponse.ahorroSerie2 = respAcum.serieAcum2;

        let resDesAcum = this.logicSeries.calcularDesAcumulacionNg(
            this.valoresDesacumulacion
        );

        this.seriesResponse.rendimientosSerie1 = resDesAcum.serieDesAcum1;
        this.seriesResponse.rendimientosSerie2 = resDesAcum.serieDesAcum2;

        this.seriesResponse.pointStartSeries = resDesAcum.pointStartSeries;

        this.valoresPago.push(respAcum.montoTotalAhorrado);


        let rentaMensual = this.logicSeries.calcularPago(this.valoresPago);
        rentaMensual.renta = LogicForm.round(rentaMensual.renta, 0);
        rentaMensual.plazoRenta = rentaMensual.plazoRenta / 12;
        this.seriesResponse.rentaMensual = rentaMensual;
        // LogicForm.round(rentaMensual, 0);
        // console.log('_________ this.seriesResponse.rentaMensual ' + this.seriesResponse.rentaMensual);

        this.saldos = respAcum.saldosList;
        this.saldosD = resDesAcum.saldosList;
        // this.seriesResponse.plazoAcuAnual =respAcum.plazoAcuAnual;

        if (resDesAcum.plazoAcuAnual != undefined && resDesAcum.plazoAcuAnual != '') {
            this.seriesResponse.plazoAcuAnual = resDesAcum.plazoAcuAnual;
        } else if (respAcum.plazoAcuAnual != undefined && respAcum.plazoAcuAnual != '') {
            this.seriesResponse.plazoAcuAnual = resDesAcum.plazoAcuAnual;
        } else {
            this.seriesResponse.plazoAcuAnual = 0;
        }
        return this.seriesResponse;
    }


    remplazaTodo(text, busca, reemplaza) {
        while (text.toString().indexOf(busca) !== -1) {
            text = text.toString().replace(busca, reemplaza);
        }
        return text;
    }
}

