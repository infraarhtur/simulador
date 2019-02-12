import { Pipe, PipeTransform } from '@angular/core';
const padding = "000000";
@Pipe({
  name: 'myCurrency'
})
export class MyCurrencyPipe implements PipeTransform {
  private prefix: string;
  private decimal_separator:string;
  private thousands_separator:string;
  private suffix:string;

  constructor(){
    this.prefix='';
    this.suffix='';
    this.decimal_separator=',';
    this.thousands_separator = '.';
  }
  transform(value: string, fractionSize:number = 0 ): string {
    
    if(parseFloat(value) % 1 != 0)
    {
      fractionSize = 2;
    }
    let [ integer, fraction = ""] = (parseFloat(value).toString() || "").toString().split(".");

    fraction = fractionSize > 0
      ? this.decimal_separator + (fraction+padding).substring(0, fractionSize) : "";
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousands_separator);
    if(isNaN(parseFloat(integer)))
    {
          integer = "0";
    }
      return this.prefix + integer + fraction + this.suffix;
    
  }

  parse(value: string, fractionSize: number = 2): string {
    let [ integer, fraction = "" ] = (value || "").replace(this.prefix, "")
                                                  .replace(this.suffix, "")
                                                  .split(this.decimal_separator);

    integer = integer.replace(new RegExp(this.thousands_separator, "g"), "");

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.decimal_separator + (fraction + padding).substring(0, fractionSize)
      : "";

    return integer + fraction;
  }

}
