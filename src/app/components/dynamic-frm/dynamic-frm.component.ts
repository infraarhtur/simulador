import { Component, OnInit, ViewEncapsulation, DoCheck, AfterViewInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { allResolved } from 'q';
import { Alert } from 'selenium-webdriver';

declare var $: any;
declare var require: any;

@Component({
  selector: 'app-dynamic-frm',
  templateUrl: './dynamic-frm.component.html',
  styleUrls: ['./dynamic-frm.component.css']
})
export class DynamicFrmComponent implements OnInit, DoCheck, AfterViewInit {
  questions: any[];
  public preTitulo: string;
  public titulo: string;
  public texto1: string;
  public textoRentaMensual: string;
  public textoRentaMensualCero: string;
  public valorRentaMensual: number;
  public aniosRentaMensual: number;
  public texto2: string;
  public textoLeyenda1: string;
  public textoLeyenda2: string;
  response: any;
  isvisibleGrafica: boolean;
  closeResult: string;
  sliderValue = 140;
  marginTopGrafica: string;
  alertValorMinimo: string;
  alertValorMaximo: string;
  alturaString: string;
  strMiddle: string;
  public isContactenosVisible: boolean;

  constructor(private service: ServicesService) {

    this.isvisibleGrafica = false;
  }

  ngAfterViewInit() {
    const resolucionWidth = screen.width;
    if (resolucionWidth > 769) {

      const altura = document.getElementById('divformularioGeneral').clientHeight;
      this.alturaString = altura.toString() + 'px';

      console.log(altura + 'altura calculada----------------------------------------------------------');
      const { detect } = require('detect-browser');
      const browser = detect();
      // if (browser.name === 'Safari' || browser.name === 'safari') {

      //   if (altura <= 600) {

      //     $('#contenedorGrafica').css('margin-top', '0%');

      //   } else if ((altura > 600) && (altura <= 670)) {
      //     $('#contenedorGrafica').css('margin-top', '2%');

      //   } else if ((altura > 670) && (altura <= 720)) {
      //     $('#contenedorGrafica').css('margin-top', '3%');

      //   } else if ((altura > 720) && (altura <= 900)) {
      //     $('#contenedorGrafica').css('margin-top', '4%');

      //   } else if ((altura > 900) && (altura <= 980)) {
      //     $('#contenedorGrafica').css('margin-top', '8%');

      //   } else if ((altura > 980)) {
      //     $('#contenedorGrafica').css('margin-top', '12%');

      //   }
      // } else if (browser.name === 'ie') {
      //   if (altura <= 600) {

      //     $('#contenedorGrafica').css('margin-top', '0%');

      //   } else if ((altura > 600) && (altura <= 670)) {
      //     $('#contenedorGrafica').css('margin-top', '5%');

      //   } else if ((altura > 670) && (altura <= 720)) {
      //     $('#contenedorGrafica').css('margin-top', '7%');

      //   } else if ((altura > 720) && (altura <= 900)) {
      //     $('#contenedorGrafica').css('margin-top', '8%');

      //   } else if ((altura > 900) && (altura <= 980)) {
      //     $('#contenedorGrafica').css('margin-top', '11%');

      //   } else if ((altura > 980)) {
      //     $('#contenedorGrafica').css('margin-top', '13%');

      //   }

      // } else {

      //   if (altura <= 580) {

      //     $('#contenedorGrafica').css('margin-top', '0%');

      //   } else if ((altura > 580) && (altura <= 620)) {
      //     $('#contenedorGrafica').css('margin-top', '2%');

      //   } else if ((altura > 620) && (altura <= 700)) {
      //     $('#contenedorGrafica').css('margin-top', '3%');

      //   } else if ((altura > 700) && (altura <= 870)) {
      //     $('#contenedorGrafica').css('margin-top', '4%');

      //   } else if ((altura > 870) && (altura <= 970)) {
      //     $('#contenedorGrafica').css('margin-top', '7%');

      //   } else if ((altura > 970)) {
      //     $('#contenedorGrafica').css('margin-top', '10%');

      //   }
      // }
    }


    $('.js-mega-menu,.navbar').addClass('navbar-expand-md');
    // $('.navbar-toggler').collapse();
    // this.strMiddle = "middle"
  }


  ngDoCheck() {
    const vminimo = localStorage.getItem('minValue');
    const vmaximo = localStorage.getItem('maxValue');
    if (vminimo !== undefined && vminimo !== null) {
      this.alertValorMinimo = vminimo.toString();
    }

    if (vmaximo !== undefined && vmaximo !== null) {
      this.alertValorMaximo = vmaximo.toString();
    }
  }

  ngOnInit() {
    const { detect } = require('detect-browser');
    const browser = detect();
    if (browser) {
      console.log(browser.name);
      console.log(browser.version);
      console.log(browser.os);
    }
    this.getInfoFileConfig();
    // tslint:disable-next-line:prefer-const
    let options: any;

    this.service.getDynamicControls().subscribe(
      questions => {
        this.questions = questions.dinamicControls.sort((a, b: any) => a.order - b.order);
        // organiza los elementos del radio
        // if ( this.questions !== undefined) {
        this.questions.forEach(function (element, index) {
          if (element.controlType === 'radio') {
            element.options = element.options.slice().reverse();
          }
        });
      }
      ,
      error => {
        $('#ErrorModal').modal(
          // { backdrop: 'static' }
        );
        console.log(error);
      }
    );

  }

  inicializaTextos(infoConfig) {
    this.valorRentaMensual = 0;
    this.aniosRentaMensual = 0;
    this.preTitulo = infoConfig.textosGenerales.preTitulo.toString();
    this.titulo = infoConfig.textosGenerales.titulo.toString();
    this.texto1 = infoConfig.textosGenerales.disclaimer.toString();
    this.texto2 = infoConfig.textosGenerales.disclaimerFinal.toString();
    this.textoRentaMensual = infoConfig.textosGenerales.textoRentaMensual.toString();
    this.textoRentaMensualCero = infoConfig.textosGenerales.textoRentaMensualCero.toString();
    localStorage.setItem('MicroSiteCode', infoConfig.emailConfig.MicroSiteCode.toString());
    localStorage.setItem('FormCode', infoConfig.emailConfig.FormCode.toString());
    localStorage.setItem('KeyType', infoConfig.emailConfig.KeyType.toString());
    localStorage.setItem('Recipient', infoConfig.emailConfig.Recipient.toString());
    localStorage.setItem('from', infoConfig.emailConfig.from.toString());
    localStorage.setItem('urlService', infoConfig.emailConfig.urlServicio.toString());

    this.isContactenosVisible = infoConfig.emailConfig.isButtonVisible;
  }

  changeResponse(event) {
    this.response = event;
    this.response.textoRentaMensual = this.textoRentaMensual;
    this.response.textoRentaMensualCero = this.textoRentaMensualCero;
    // plazoAcuAnual
    if (event.ahorroSerie1.length > 1 ||
      event.ahorroSerie1.length > 1 ||
      event.rendimientosSerie1.length > 1 ||
      event.rendimientosSerie1.length > 1) {

      this.isvisibleGrafica = true;
      this.aniosRentaMensual = event.plazoAcuAnual;
    } else {
      this.isvisibleGrafica = false;

    }
  }
  getInfoFileConfig() {
    this.service.getInfoGeneral().subscribe(
      result => {
        this.service = result;

        this.inicializaTextos(this.service);
      },
      error => {

        const errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }

  modalContactenos() {
    $('#FormularioModal').modal(
    );
  }

  coverageAChange(value) {
    // console.log(value);
  }
}
