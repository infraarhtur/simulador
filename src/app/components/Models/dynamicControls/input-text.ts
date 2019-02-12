import {BaseControl} from './base-control';
export class InputText extends BaseControl<string>{
    controlType = 'textbox';
    type: string;
  simbolo:string;
    constructor(options: {} = {}) {
      super(options);
      this.type = options['type'] || '';
      this.simbolo = options['simbolo'] || '';
    }
}
