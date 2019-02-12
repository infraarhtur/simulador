// export class BaseControl {
// }
export class BaseControl<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    tooltip: string;
    options: any[];
    formulas: { Fomula: string, position: string}[] = [];
    constructor(options: {
        value?: T,
        key?: string,
        label?: string,
        required?: boolean,
        order?: number,
        controlType?: string,
        tooltip?: string,
        formulas?: any[],
        options?: any[]
      } = {}) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.required = !!options.required;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
      this.tooltip = options.tooltip || '';
      this.formulas = options.formulas || [];
      this.options = options.options || [];
    }
}
