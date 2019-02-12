import { Component, Input, OnInit, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, NgModel } from '@angular/forms';
import { BaseControl } from '../Models/dynamicControls/base-control';
import { NgClass } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { OnlyNumbersDirective } from '../../directivas/only-numbers.directive';
import { empty } from 'rxjs/observable/empty';
import { Observable } from 'rxjs/Observable';
import { MyCurrencyDirective } from '../../directivas/my-currency.directive';
import { MyCurrencyPipe } from '../../pipe/my-currency.pipe';
import { LogicForm } from '../business/logic-form';
import { Alert } from 'selenium-webdriver';
import { PositionCursorDirective } from '../../directivas/position-Cursor.directive';
import { NouisliderModule } from 'ng2-nouislider';
import { NouisliderComponent } from 'ng2-nouislider';

declare var $: any;
declare var require: any;
declare var noUiSlider: any;

@Component({
  selector: 'app-dynamic-control',
  templateUrl: './dynamic-control.component.html',
  styleUrls: ['./dynamic-control.component.css'],
  providers: [MyCurrencyPipe]
})
export class DynamicControlComponent implements OnInit {
  @Input() question: BaseControl<any>;
  @Input() form: FormGroup;
  @Output() changesForm = new EventEmitter();
  public visibilityRadio = 'hidden';
  sliderValue = 0;
  public lista: [string];
  public msj: string;
  // formBuilder = new FormBuilder;
  constructor() { }

  get isValid() {

    return this.form.controls[this.question.key].valid;
  }


  ngOnInit() {

    $(document).ready(function () {
      $('.tooltipImage').tooltip({
        trigger: 'focus'
      });


      const { detect } = require('detect-browser');

      const browser = detect();
      if (browser) {
        localStorage.setItem('browserName', browser.name);
      }
    });
  }
  onchangeSlr(slider, txtSlider) {
    let idSlider = '';
    const { detect } = require('detect-browser');

    const browser = detect();
    if (browser) {
      console.log(browser.name);
    }
    if (browser.name === 'ie' || browser.name === 'Edge') {
      const nameId = txtSlider.id;
      idSlider = nameId.replace('txt', '');
    } else {
      idSlider = slider.el.nativeElement.attributes['id'].value;

    }
    const minValue = Number(slider.min);
    const maxValue = Number(slider.max);
    const valuePrincipal = Number(txtSlider.value);

    if (valuePrincipal === 0 || valuePrincipal === undefined || isNaN(valuePrincipal)) {
      slider.value = slider.min;
      txtSlider.value = minValue;

    } else if (valuePrincipal < minValue) {

      $('#alertModal').modal();
      slider.value = minValue;
      txtSlider.value = minValue;
    } else if (valuePrincipal > maxValue) {
      $('#alertModal').modal();
      slider.value = maxValue;
      txtSlider.value = slider.max;
    } else {
      slider.value = valuePrincipal;
    }
    this.form.value[idSlider] = Number(txtSlider.value);
    this.form.controls[idSlider].patchValue(txtSlider.value);
    this.eventPasaDatos();
  }

  KeyonchangeSlr(slider, txtSlider, control) {
    debugger;

    let idSlider = '';
    const { detect } = require('detect-browser');

    const browser = detect();
    if (browser) {
      console.log(browser.name);
    }
    if (browser.name === 'ie' || browser.name === 'Edge') {
      const nameId = txtSlider.currentTarget.id;
      idSlider = nameId.replace('txt', '');
    } else {
      idSlider = slider.el.nativeElement.attributes['id'].value;
    }

    if (txtSlider.keyCode === 190) {
      txtSlider.target.value = txtSlider.target.value.replace('.', '');
    } else if ((txtSlider.keyCode >= 48 && txtSlider.keyCode <= 57) || (txtSlider.keyCode >= 96 && txtSlider.keyCode <= 105) ||
      (txtSlider.keyCode === 46) || (txtSlider.keyCode === 8) || (txtSlider.keyCode === 229)) {
      const minValue = Number(slider.min);
      const maxValue = Number(slider.max);
      const valuePrincipal = Number(txtSlider.target.value);

      txtSlider.target.value = valuePrincipal;
      if (valuePrincipal === undefined || valuePrincipal === NaN) {
        slider.value = minValue;
        txtSlider.target.value = minValue;
      } else if (valuePrincipal < minValue) {

        localStorage.setItem('minValue', minValue.toString());
        $('#alertModal2').modal(
          // {backdrop: 'static'    }
        );
        slider.value = minValue;
        txtSlider.target.value = minValue;
      } else if (valuePrincipal > maxValue) {
        localStorage.setItem('maxValue', maxValue.toString());
        $('#alertModal').modal(
          // {backdrop: 'static'    }
        );
        slider.value = maxValue;
        txtSlider.target.value = maxValue;
      } else {
        slider.value = valuePrincipal;
        debugger;
        var trueSlider = document.getElementById(slider);
       // trueSlider.noUiSlider.set(60);
        slider.config.start = valuePrincipal.toString();
        slider.ngModel = valuePrincipal.toString();
      }
debugger;
   this.form.controls[idSlider].setValue(txtSlider.target.value);
   
      this.eventPasaDatos();

    }
  }
  minusInversionInicial(txtCurrency) {
    let valorTxt;
    try {
      txtCurrency.value = this.remplazaTodo(txtCurrency.value, '.', '');
      txtCurrency.value = this.remplazaTodo(txtCurrency.value, ',', '');
      if (txtCurrency.value === '') {
        valorTxt = txtCurrency.value = txtCurrency.min;
      } else if (Number(txtCurrency.value) < Number(txtCurrency.min)) {
        localStorage.setItem('minValue', '$' + txtCurrency.min.toLocaleString());
        $('#alertModal2').modal(
          // {backdrop: 'static'    }
        );
        valorTxt = Number(txtCurrency.min);
      } else {
        valorTxt = Number(txtCurrency.value);

      }
      if (Number(txtCurrency.value) > Number(txtCurrency.min)) {
        valorTxt -= Number(txtCurrency.step);

        if (valorTxt < Number(txtCurrency.min)) {
          localStorage.setItem('minValue', '$' + Number(txtCurrency.min).toLocaleString());
          $('#alertModal2').modal(
            // {backdrop: 'static'    }
          );
          valorTxt = Number(txtCurrency.min);
        }
      }
      txtCurrency.value = Number(valorTxt);
      this.form.controls[txtCurrency.id].patchValue(txtCurrency.value);
      this.eventPasaDatos();
      txtCurrency.value = LogicForm.round(txtCurrency.value, 0);

    } catch (error) {

    }
  }


  plusInversionInicial(txtCurrency, obj) {
    let valorTxt;

    txtCurrency.value = this.remplazaTodo(txtCurrency.value, '.', '');
    txtCurrency.value = this.remplazaTodo(txtCurrency.value, ',', '');
    if (txtCurrency.value === '') {
      valorTxt = txtCurrency.value = txtCurrency.min;
    } else {
      valorTxt = Number(txtCurrency.value);
    }
    valorTxt += Number(txtCurrency.step);
    if (valorTxt > txtCurrency.max) {
      localStorage.setItem('maxValue', '$' + txtCurrency.max.toLocaleString());
      $('#alertModal').modal(
        // {backdrop: 'static'    }
      );
      txtCurrency.value = Number(txtCurrency.max);
    } else if (Number(txtCurrency.min) > Number(txtCurrency.value)) {
      txtCurrency.value = Number(txtCurrency.min);
    } else {
      txtCurrency.value = valorTxt;
    }
    this.form.controls[txtCurrency.id].patchValue(txtCurrency.value);
    txtCurrency.value = LogicForm.round(txtCurrency.value, 0);
    this.eventPasaDatos();
  }
  onFocusCurrency(txtCurrency) {
    txtCurrency.value = this.remplazaTodo(txtCurrency.value, '.', '');
    txtCurrency.value = this.remplazaTodo(txtCurrency.value, ',', '');

  }
  focusoutCurrency(txtCurrency) {
    txtCurrency.value = this.remplazaTodo(txtCurrency.value, '.', '');
    txtCurrency.value = this.remplazaTodo(txtCurrency.value, ',', '');
    txtCurrency.value = Number(txtCurrency.value);
    txtCurrency.value = LogicForm.round(txtCurrency.value, 0);
  }

  onchangeVerificaReglasCurrency(txtCurrency) {
    debugger;
    let valorTxt = txtCurrency.target.value;
    if (Number(valorTxt) === undefined || Number(valorTxt) === NaN) {
      txtCurrency.target.value = this.buscaletras(txtCurrency.target.value.toLowerCase());
    }

    if (Number(valorTxt) !== undefined && Number(valorTxt) !== NaN) {
      const browserName = localStorage.getItem('browserName');
      this.msj = browserName + ' ' + txtCurrency.keyCode + ' ' + txtCurrency.which;
      if ((valorTxt.indexOf('.') !== -1) || (valorTxt.indexOf(',') !== -1)) {

        txtCurrency.target.value = this.remplazaTodo(txtCurrency.target.value, '.', '');
        txtCurrency.target.value = this.remplazaTodo(txtCurrency.target.value, ',', '');
        valorTxt = txtCurrency.target.value;
      }
      if (valorTxt === '') {
        txtCurrency.target.value = txtCurrency.target.min;
      }
      if (Number(valorTxt) > Number(txtCurrency.target.max)) {
        localStorage.setItem('maxValue', '$' + Number(txtCurrency.target.max).toLocaleString());
        $('#alertModal').modal(
          // {backdrop: 'static'    }
        );
        txtCurrency.target.value = txtCurrency.target.max;

      } else if (Number(txtCurrency.target.min) > Number(valorTxt)) {

        localStorage.setItem('minValue', '$' + Number(txtCurrency.target.min).toLocaleString());
        $('#alertModal2').modal(
          // {backdrop: 'static'    }
        );
        txtCurrency.target.value = Number(txtCurrency.target.min);
      }

      if ((txtCurrency.keyCode >= 48 && txtCurrency.keyCode <= 57) || (txtCurrency.keyCode >= 96 && txtCurrency.keyCode <= 105) ||
        (txtCurrency.keyCode === 46) || (txtCurrency.keyCode === 8) || (txtCurrency.keyCode === 229)) {
        // setTimeout(() => {
          
        // this.form.controls[txtCurrency.target.id].patchValue(txtCurrency.target.value);
        this.eventPasaDatos();
        //  }, 100 );
      }

    }
  }

  buscaletras(valor) {
    let caracteres = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,ñ,w,x,y,z,*,+,-,_,¡,¿,?,=,),(,/,&,%,$,#,!,|,°,;,[,],{,},@,<,>,÷,:,€,^,£,á,é,í,ó,ú,~';
    // caracteres += ',~,\,á,é,í,ó,ú';

    const arrayCaracters = caracteres.split(',');
    arrayCaracters.forEach(function (value, key) {
      const a = valor.indexOf(value);
      while (valor.toString().indexOf(value) !== -1) {
        valor = valor.toString().replace(value, '');
      }

    });
    return valor;
  }

  selectedRadio(inputRadio, RadioText) {
    const index = inputRadio.attributes.dataIndex.value;
    const special = inputRadio.attributes.special.value;
    const a = this.form.controls[inputRadio.id].value;

    this.form.controls[inputRadio.id].patchValue(a);
    this.eventPasaDatos();

    if (special === 'true' || special === true) {
      this.visibilityRadio = 'visible';
      // this.
      // RadioText.value = RadioText.min;
    } else {
      this.visibilityRadio = 'hidden';
      // RadioText.value = '';
    }
  }

  onchageRadioText(RadioText, key, option, index) {

    const valorMin = Number(RadioText.target.min);
    const valorMax = Number(RadioText.target.max);
    const valor = RadioText.target.value;
    if ((RadioText.keyCode >= 48 && RadioText.keyCode <= 57) ||
      (RadioText.keyCode >= 96 && RadioText.keyCode <= 105) ||
      (RadioText.keyCode === 46)
      || (RadioText.keyCode === 8) || (RadioText.keyCode === 229)) {

      if ((valorMin > Number(valor)) || (RadioText.target.value === '')) {
        localStorage.setItem('minValue', valorMin.toString());
        $('#alertModal2').modal(
          // {backdrop: 'static'    }
        );
        RadioText.target.value = valorMin;
      } else if (Number(valor) > valorMax) {
        localStorage.setItem('maxValue', valorMax.toString());
        $('#alertModal').modal(
          // {backdrop: 'static'    }
        );
        RadioText.target.value = valorMax;
      } else {
        RadioText.target.value = Number(valor);
      }

      option.value = RadioText.target.value;
      RadioText.target.value = this.buscaletras(RadioText.target.value.toLowerCase());
      this.form.controls[key].patchValue(RadioText.target.value);
      this.eventPasaDatos();
      // this.form.controls[key].patchValue(RadioText.target.min);
    } else if (RadioText.keyCode === 190) {
      option.value = RadioText.target.value;
      RadioText.target.value = this.buscaletras(RadioText.target.value.toLowerCase());

      this.form.controls[key].patchValue(RadioText.target.value);
      this.eventPasaDatos();
      // this.form.controls[key].patchValue(RadioText.target.min);
    }
    $("input[dataIndex ='radio" + index + "']").prop('checked', true);
  }
  eventPasaDatos() {
    this.changesForm
      .emit('cambio');
  }

  remplazaTodo(text, busca, reemplaza) {
    while (text.toString().indexOf(busca) !== -1) {
      text = text.toString().replace(busca, reemplaza);
    }
    return text;
  }

  eventValidText(texto) {
    debugger;
    const valorMin = Number(texto.target.min);
    const valorMax = Number(texto.target.max);
    let valor = texto.target.value;


    if ((texto.keyCode >= 48 && texto.keyCode <= 57) ||
      (texto.keyCode >= 96 && texto.keyCode <= 105) ||
      (texto.keyCode === 46) || (texto.keyCode === 190) ||
      (texto.keyCode === 8) || (texto.keyCode === 229)) {
      if ((Number(valor) === undefined) || (Number(valor) === NaN)) {
        valor = this.buscaletras(valor.toLowerCase());
        texto.target.value = valor;
      }
      if (texto.keyCode === 190) {

      } else {
        // texto.target.value = Number(valor) ;
      }


      if ((valorMin > Number(valor)) || (valor === '')) {
        localStorage.setItem('minValue', valorMin.toString());
        $('#alertModal2').modal(
          // {backdrop: 'static'    }
        );
        texto.target.value = valorMin;
      } else if (Number(valor) > valorMax) {
        localStorage.setItem('maxValue', valorMax.toString());
        $('#alertModal').modal(
          // {backdrop: 'static'    }
        );
        texto.target.value = valorMax;
      }

      this.eventPasaDatos();
    }
  }


}
