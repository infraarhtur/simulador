import {BaseControl} from './base-control';
export class InputRadio extends BaseControl<string>{
    controlType = 'radio';
    type: number;
    label: string;
    tooltip: string;
    options: { label: string, value: number, special: boolean }[] = [];
  
    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
        this.tooltip = options['tooltip'] || '';
        this.options = options['options'] || [];
        this.label = options['label'] || '';
    }
}
