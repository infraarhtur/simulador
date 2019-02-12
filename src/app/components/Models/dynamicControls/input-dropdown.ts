import {BaseControl} from './base-control';
export class InputDropdown extends BaseControl<string> {
    controlType = 'dropdown';
    options: {key: string, value: string}[] = [];
  
    constructor(options: {} = {}) {
      super(options);
      this.options = options['options'] || [];
    }
}
