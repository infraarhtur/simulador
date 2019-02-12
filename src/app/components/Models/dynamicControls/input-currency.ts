import {BaseControl} from './base-control';
export class InputCurrency extends BaseControl<string> {
    controlType = 'currency';
    type: number;
    minValue: number;
    maxValue: number;
    step: number;
    maxlength: number;
    tooltip: string;
    simboloMoneda: string;
    relacion: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
        this.minValue = options['minValue'] || 0;
        this.maxValue = options['maxValue'] || 0;
        this.step = options['step'] || 0;
        this.maxlength = options['maxlength'] || 2;
        this.tooltip = options['tooltip'] || '';
        this.simboloMoneda = options['simboloMoneda'] || '';
        this.relacion = options['relacion'] || '';
    }

}
