import {BaseControl} from './base-control';
export class InputSlider extends BaseControl<string> {
    controlType = 'slider';
    type:number;
    minValue:number;
    maxValue:number;
    step:number;
    maxlength:number;
    textMedida:string;
    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
        this.minValue = options['minValue'] || 0;
        this.maxValue =options['maxValue'] || 0;
        this.step = options['step'] || 0;
        this.maxlength = options['maxlength'] || 2;
        this.textMedida = options['textMedida'] || '';

}
}
