import { Component, Input, OnInit, Output, EventEmitter , OnChanges} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseControl } from '../Models/dynamicControls/base-control';
import { DynamicControlService } from '../dynamic-control.service';
import { CurrencyPipe } from '@angular/common';

import { ArrayFormulas } from '../business/array-formulas';
declare var $: any;
declare var require: any;

declare var calcularAcumulacion: any;
declare var calcularDesAcumulacion: any;
declare var pago: any;


@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [DynamicControlService]
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() questions: BaseControl<any>[] = [];
  form: FormGroup;
  payLoad = '';
  objFormulasArray: ArrayFormulas;
  formulaAcumulacion: number[];
  response: any;
  @Output() changesResponse= new EventEmitter();
  // necesario para formulas
  showTables = false;

  constructor(private qcs: DynamicControlService) { }

  ngOnInit() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.form = this.qcs.toFormGroup(this.questions);
    this.onSubmit();
  }
  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
    const keysCampos = Object.keys(this.form.value);
    this.objFormulasArray = new ArrayFormulas();
    this.response = this.objFormulasArray.relacionarFormulas(this.questions, keysCampos, this.form.value);
    this.eventPasaDatos() ;
  }

  changeOnSubmit(event) {
    this.onSubmit();
  }

  eventPasaDatos() {
    // .emit(this.seriesResponse);
    this.changesResponse
      .emit(this.response);

  }

}
