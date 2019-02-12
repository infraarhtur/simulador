import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ChartOptions as ChartOptionsBase } from 'highcharts';
import { ChartService } from 'angular-highcharts/chart.service';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CurrencyPipe } from '@angular/common';
import { ServicesService } from '../services.service';
import { LogicForm } from '../business/logic-form';
import { Alert } from 'selenium-webdriver';
declare var require: any;
declare var $: any;

const { SVGPathData, SVGPathDataTransformer, SVGPathDataEncoder, SVGPathDataParser } = require('svg-pathdata');

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css']
 })
 export class GraficaComponent implements OnInit {

   @Input() seriesResponseGraph: any;

   public myChart;
   public Highcharts;
   public colorSerie1: string;
   public colorSerie2: string;

   private MESES_STR = 'MESES';
   private ANIO_STR = 'AÑO';
   private S_STR = 'S';
   private INDEX_ACUM_S1 = 0;
   private INDEX_ACUM_S2 = 2;
   private INDEX_DESACUM_S1 = 1;
   private INDEX_DESACUM_S2 = 3;

   public rentaMensual: any;

   ahorrosSerie1: number[];
   ahorrosSerie2: number[];
   rendimientosSerie1: number[];
   rendimientosSerie2: number[];
   pointStartSerie1: number;
   pointStartSerie2: number;

   ahorrosSerieTmp: number[];
   rendimientosSerieTmp: number[];

   tickPos: number[];
   ahorroSerieName: string;
   rendimientosSerieName: string;
   ajuste: number;
   textoRentaMensual: string;
   textoRentaMensualCero: string;
   isMobile: boolean;
   ahorroMb: string;
   rendimientoMb: string;
   ahorroMbLb: string;
   rendimientoMbLb: string;
   margenTop: number;
   margenLeft: number;
   margenRight: number;

   contador: number;

   isFirefox: boolean;
   isCrome: boolean;
   isExplorer: boolean;
   ajusteNavegador: number;
   ajusteNavegadorRightSerie: number;
   browserName: string;
    pasoLimiteMedio: boolean;

   constructor() {
    this.contador = 0;
    this.pasoLimiteMedio = false;
   }


   /**
    * Metodo para extraer la informacion del path de un SVG
    * @param {string} pathStr - El string con el valor del atributo "d" del SVG
    * @returns {Object[]} pathResp - Objeto con los atributos 'x' y 'y' del MOVE_TO y LINE_TO del SVG
    */
   public getPathData(pathStr: string): any {
     const pathData = new SVGPathData(pathStr);
     const pathResp = [];
     const pathD = pathData.commands;

     for (let i = 0; i < pathD.length; i++) {
       switch (pathD[i].type) {
         case SVGPathData.MOVE_TO:
           pathResp[SVGPathData.MOVE_TO] = {};
           pathResp[SVGPathData.MOVE_TO].x = pathD[i].x;
           pathResp[SVGPathData.MOVE_TO].y = pathD[i].y;
           break;
         case SVGPathData.LINE_TO:
           pathResp[SVGPathData.LINE_TO] = {};
           pathResp[SVGPathData.LINE_TO].x = pathD[i].x;
           pathResp[SVGPathData.LINE_TO].y = pathD[i].y;
           break;
         default:
           break;
       }
     }
     return pathResp;
   }

   calcularAjuste() {
     let ajusteTmp: number;
     for (let i = 0; i < this.myChart.xAxis[0].plotLinesAndBands.length; i++) {
       if (this.myChart.xAxis[0].plotLinesAndBands[i].id === 'lineaGuiaStart') {
         ajusteTmp = this.myChart.xAxis[0].toPixels(this.myChart.xAxis[0].plotLinesAndBands[i].options.value);
       }
     }
     ajusteTmp = ajusteTmp - $('#lineaV')[0].getBoundingClientRect().left;
     if (ajusteTmp < 0) {
       ajusteTmp = ajusteTmp * -1;
     }
     console.log('calcularAjuste ajusteTmp ' + ajusteTmp + ' puntero ' + $('#lineaV')[0].getBoundingClientRect().left);
     this.ajuste = ajusteTmp;
   }

   charInit() {



     const Highcharts = require('highcharts');
     (function (H) {
       H.wrap(H.Tooltip.prototype, 'hide', function (defaultCallback) {});
     }(Highcharts));

     const self = this;
     let line, linett, rect, rect2, clickX, clickY, texttt;
     let group;
     let pathResp;
     let lineStart;
     let puntero;
     let rend;
     let leftLimit, rightLimit;
     this.myChart = this.myChart;
     let anioTmp = 0;
     let startTickSt;
     let middleTickSt;
     let startTickXPos;
     self.isMobile = false;

     var getPlotLine = function () {
       return rect;
     };

     var drag_startM = function (e) {
      $('#cirM').bind({
        'touchmove.line': drag_stepM,
        'touchend.line': drag_stopM,
        'touchmove.linett': drag_stepM,
        'touchend.linett': drag_stopM,
        'touchmove.texttt': drag_stepM,
        'touchend.texttt': drag_stopM,
        'touchmove.rect': drag_stepM,
        'touchend.rect': drag_stopM,
        'touchmove.rect2': drag_stepM,
        'touchend.rect2': drag_stepM
        });

        var plotLine = getPlotLine();
        console.log('drag_startM mobile plotLine.translateX ' + plotLine.translateX);

        clickX = e.changedTouches[0].pageX - plotLine.translateX;
     };

     var drag_stepM = function (e) {
      var plotLine = getPlotLine();
      //alert('drag_step plotLine ' + plotLine);
      //self.myChart.xAxis[0]
      // alert('drag_step self.myChart.xAxis[0] ' + self.myChart.xAxis[0].horiz);
      var new_translation = self.myChart.xAxis[0].horiz ? e.pageX - clickX : e.pageY - clickY;
      //alert('drag_step new_translation ' + new_translation);
      var new_value = self.myChart.xAxis[0].toValue(new_translation) - self.myChart.xAxis[0].toValue(0) ;
      // console.log('drag_stepM new_value1 ' + new_value);

      new_value = Math.max(self.myChart.xAxis[0].min, Math.min(self.myChart.xAxis[0].max, new_value));
      // console.log('drag_stepM new_value2 ' + new_value);

      new_translation = self.myChart.xAxis[0].toPixels(new_value + self.myChart.xAxis[0].toValue(0));

      // console.log('drag_stepM new_translation2 ' + new_translation);

      try{
        // console.log('drag_stepM self.myChart.xAxis[0].min ' + self.myChart.xAxis[0].min +
        // ' self.myChart.xAxis[0].max ' + self.myChart.xAxis[0].max +
        // ' getValue() ' + getValue() +
        // ' max - min ' + ((self.myChart.xAxis[0].max + self.myChart.xAxis[0].min)-1) +
        // ' Math.ceil(getValue()) ' + Math.ceil(getValue()) + '\n' +
        // ' getValueseries ahorros ' + LogicForm.round(self.rendimientosSerieTmp[Math.ceil(getValue())],0)  + '\n' +
        // ' getValueseries rendimiento ' + LogicForm.round((self.ahorrosSerieTmp[Math.ceil(getValue())] - self.rendimientosSerieTmp[Math.ceil(getValue())]),0  ) + '\n' );

      } catch ( error ) {

      }

      if(getValue() > 0  &&
        getValue() < (self.myChart.xAxis[0].max + self.myChart.xAxis[0].min) - 1 ){

          line.translate(e.changedTouches[0].pageX - clickX, e.changedTouches[0].pageY - clickY);
          linett.translate(e.changedTouches[0].pageX - clickX, e.changedTouches[0].pageY - clickY);
          texttt.translate(e.changedTouches[0].pageX - clickX, e.changedTouches[0].pageY - clickY);
          rect.translate(e.changedTouches[0].pageX - clickX , e.changedTouches[0].pageY - clickY);
          rect2.translate(e.changedTouches[0].pageX - clickX, e.changedTouches[0].pageY - clickY);

          const anio = Math.ceil(getValue());

         let mesesStr = self.MESES_STR;
         let anioStr = self.ANIO_STR;
         let periodoStr;
         let periodoTag;

         if (anio < 12) {
           if (anio <= 1) {
             mesesStr = mesesStr.substring(0, mesesStr.length - 2);
           }
           periodoStr = mesesStr + ' ' + anio;
           // periodoTag = '<tspan x="' + xLine + '" text-anchor="middle" class="periodoLb">' + periodoStr + '</tspan>';
           periodoTag = '<div class="periodoLb">' + periodoStr + '</div><br>';
         } else {
           const modAnio = anio % 12;
           if (modAnio === 0) {
             anioTmp = anio / 12;
           } else {
             anioTmp = Math.floor(anio / 12);
           }
           if (anioTmp > 1) {
             anioStr = anioStr + self.S_STR;
           }
           if (modAnio > 0) {
            //  console.log('stepM mostrar meses al año ');
             if (modAnio === 1) {
               mesesStr = mesesStr.substring(0, mesesStr.length - 2);
             }
             // periodoTag = '<tspan x="' + xLine + '" text-anchor="middle" class="periodoLb">' + (anioTmp + ' ' + anioStr) + '</tspan>' +
             //  '<tspan x="' + xLine + '" dy="15" text-anchor="middle" class="periodoLb">' + (modAnio + ' ' + mesesStr) + '</tspan>';
             periodoTag = '<div class="periodoLb">' + (anioTmp + ' ' + anioStr) + '</div><br>' +
               '<div class="periodoLb">' + (modAnio + ' ' + mesesStr) + '</div><br>';
           } else {
             periodoStr = anioTmp + ' ' + anioStr;
             // periodoTag = '<tspan x="' + xLine + '" text-anchor="middle" class="periodoLb">' + periodoStr + '</tspan>';
             periodoTag = '<div class="periodoLb">' + periodoStr + '</div><br>';
           }
          //  console.log('________ modAnio ' + modAnio + ' anioTmp ' + anioTmp);
         }
        //  console.log('________ self.isMobile ' + self.isMobile + ' anio ' + anio + ' periodoStr ' + periodoStr + ' modulo ' + anio % 12);

         let toReplace = '';

         if (self.isMobile) {
          toReplace = periodoTag;
          self.ahorroMb = LogicForm.round(self.rendimientosSerieTmp[Math.ceil(getValue())],0);
          self.rendimientoMb = LogicForm.round((self.ahorrosSerieTmp[Math.ceil(getValue())] -
            self.rendimientosSerieTmp[Math.ceil(getValue())]),0  );
        } else {
          toReplace = periodoTag +
          '<div class="subSerieLb">' + self.ahorroSerieName + '</div><br>' +
          '<div class="montoLb">$ ' + LogicForm.round(self.rendimientosSerieTmp[Math.ceil(getValue())],0) +'</div><br>' +
          '<div class="subSerieLb">' + self.rendimientosSerieName + '</div><br>' +
          '<div class="montoLb">$ ' + LogicForm.round((self.ahorrosSerieTmp[Math.ceil(getValue())] -
            self.rendimientosSerieTmp[Math.ceil(getValue())]),0  ) +
            '</div>';
         }
         texttt.attr({ text: toReplace });

      } else {
        rect.translate(e.changedTouches[0].pageX - clickX - 2, e.pageY - clickY);
      }
     };

     var drag_start = function (e) {
       //alert('drag_start');
       $(document).bind({
         'mousemove.line': drag_step,
         'mouseup.line': drag_stop,
         'mousemove.linett': drag_step,
         'mouseup.linett': drag_stop,
         'mousemove.texttt': drag_step,
         'mouseup.texttt': drag_stop,
         'mousemove.rect': drag_step,
         'mouseup.rect': drag_stop,
         'mousemove.rect2': drag_step,
         'mouseup.rect2': drag_stop
        });

        var plotLine = getPlotLine();
       //
        clickX = e.pageX - plotLine.translateX;
        // alert('clickX ' + clickX);

     };

     var drag_step = function (e) {
        var plotLine = getPlotLine();
        //alert('drag_step plotLine ' + plotLine);
        //self.myChart.xAxis[0]
        // alert('drag_step self.myChart.xAxis[0] ' + self.myChart.xAxis[0].horiz);
        var new_translation = self.myChart.xAxis[0].horiz ? e.pageX - clickX : e.pageY - clickY;
        //alert('drag_step new_translation ' + new_translation);
        var new_value = self.myChart.xAxis[0].toValue(new_translation) - self.myChart.xAxis[0].toValue(0) ;
        console.log('drag_step new_value1 ' + new_value);

        new_value = Math.max(self.myChart.xAxis[0].min, Math.min(self.myChart.xAxis[0].max, new_value));
        // console.log('drag_step new_value2 ' + new_value);

        new_translation = self.myChart.xAxis[0].toPixels(new_value + self.myChart.xAxis[0].toValue(0));

        // console.log('drag_step new_translation2 ' + new_translation);

        try{
          // console.log('drag_step self.myChart.xAxis[0].min ' + self.myChart.xAxis[0].min +
          // ' self.myChart.xAxis[0].max ' + self.myChart.xAxis[0].max +
          // ' getValue() ' + getValue() +
          // ' max - min ' + ((self.myChart.xAxis[0].max + self.myChart.xAxis[0].min)-1) +
          // ' Math.ceil(getValue()) ' + Math.ceil(getValue()) + '\n' +
          // ' getValueseries ahorros ' + LogicForm.round(self.rendimientosSerieTmp[Math.ceil(getValue())],0)  + '\n' +
          // ' getValueseries rendimiento ' + LogicForm.round((self.ahorrosSerieTmp[Math.ceil(getValue())] - self.rendimientosSerieTmp[Math.ceil(getValue())]),0  ) + '\n' );

        } catch ( error ) {

        }

      if(getValue() > 0  &&
        getValue() < (self.myChart.xAxis[0].max + self.myChart.xAxis[0].min) - 0 ){



       /* plotLine.translate(
          self.myChart.xAxis[0].horiz ? new_translation : 0,
          self.myChart.xAxis[0].horiz ? 0 : new_translation);*/
            line.translate(e.pageX - clickX, e.pageY - clickY);
            linett.translate(e.pageX - clickX, e.pageY - clickY);
            texttt.translate(e.pageX - clickX, e.pageY - clickY);
            rect.translate(e.pageX - clickX , e.pageY - clickY);
            rect2.translate(e.pageX - clickX, e.pageY - clickY);

            let toReplace = '';
            let mesesStr = self.MESES_STR;
         let anioStr = self.ANIO_STR;
         let periodoStr;
         let periodoTag;

         const anio = Math.ceil(getValue());

        //  console.log('________ anio Math.ceil(getValue() ' + anio + ' rendimientosSerieTmp.length  ' + (self.rendimientosSerieTmp.length  ) + ' pasoLimiteMedio ' + self.pasoLimiteMedio);

         if (anio > (self.rendimientosSerieTmp.length - 1) && anio <= 0) {
          // console.log('________ de detiene la burbuja');
          // //return;
         }

         if (anio < 12) {
          if (anio <= 1) {
            mesesStr = mesesStr.substring(0, mesesStr.length - 2);
          }
          periodoStr = mesesStr + ' ' + anio;
          // periodoTag = '<tspan x="' + xLine + '" text-anchor="middle" class="periodoLb">' + periodoStr + '</tspan>';
          periodoTag = '<div class="periodoLb">' + periodoStr + '</div><br>';
        } else {
          const modAnio = anio % 12;
          if (modAnio === 0) {
            anioTmp = anio / 12;
          } else {
            anioTmp = Math.floor(anio / 12);
          }
          if (anioTmp > 1) {
            anioStr = anioStr + self.S_STR;
          }
          if (modAnio > 0) {
            // console.log('stepM mostrar meses al año ');
            if (modAnio === 1) {
              mesesStr = mesesStr.substring(0, mesesStr.length - 2);
            }
            // periodoTag = '<tspan x="' + xLine + '" text-anchor="middle" class="periodoLb">' + (anioTmp + ' ' + anioStr) + '</tspan>' +
            //  '<tspan x="' + xLine + '" dy="15" text-anchor="middle" class="periodoLb">' + (modAnio + ' ' + mesesStr) + '</tspan>';
            periodoTag = '<div class="periodoLb">' + (anioTmp + ' ' + anioStr) + '</div><br>' +
              '<div class="periodoLb">' + (modAnio + ' ' + mesesStr) + '</div><br>';
          } else {
            periodoStr = anioTmp + ' ' + anioStr;
            // periodoTag = '<tspan x="' + xLine + '" text-anchor="middle" class="periodoLb">' + periodoStr + '</tspan>';
            periodoTag = '<div class="periodoLb">' + periodoStr + '</div><br>';
          }
          // console.log('________ modAnio ' + modAnio + ' anioTmp ' + anioTmp);
        }
        // console.log('________ anio ' + anio + ' periodoStr ' + periodoStr + ' modulo ' + anio % 12);

          let index = getValue();

            if (((self.ahorrosSerie1.length - 1) === 0 && (self.rendimientosSerie1.length - 1) > 0) || self.pasoLimiteMedio){
                index = index + 1;
            }
            if (self.isMobile) {
              toReplace = periodoTag;
              self.ahorroMb = LogicForm.round(self.rendimientosSerieTmp[Math.ceil(getValue())],0);
              self.rendimientoMb = LogicForm.round((self.ahorrosSerieTmp[Math.ceil(getValue())] -
                self.rendimientosSerieTmp[Math.ceil(index)]),0  );
            } else {

              toReplace = periodoTag +
              '<div class="subSerieLb">' + self.ahorroSerieName + '</div><br>' +
              '<div class="montoLb">$ ' + LogicForm.round(self.rendimientosSerieTmp[Math.ceil(index)],0) +'</div><br>' +
              '<div class="subSerieLb">' + self.rendimientosSerieName + '</div><br>' +
              '<div class="montoLb">$ ' + LogicForm.round((self.ahorrosSerieTmp[Math.ceil(index)] - self.rendimientosSerieTmp[Math.ceil(index)]),0  ) +
                '</div>';
             }
             texttt.attr({ text: toReplace });
            }else{
              rect.translate(e.pageX - clickX - 2, e.pageY - clickY);
             /*if( getValue() <  - 0) {
              console.log('no cumple limites menores' + getValue());
              rect.translate(e.pageX - clickX - 2, e.pageY - clickY);
             }else if( getValue() > (self.myChart.xAxis[0].max + self.myChart.xAxis[0].min -1)) {
              console.log('no cumple limites mayores' + getValue());
              rect.translate(e.pageX - clickX - 2, e.pageY - clickY);
             }*/
            }

     };

     var getValue = function() {
      var plotLine = getPlotLine();
      var translation = self.myChart.xAxis[0].horiz ? plotLine.translateX : plotLine.translateY;
      var new_value = self.myChart.xAxis[0].toValue(translation) - self.myChart.xAxis[0].toValue(0);
      new_value = Math.max(self.myChart.xAxis[0].min, Math.min(self.myChart.xAxis[0].max, new_value));

      // console.log('getValue ' + new_value + ' self.rendimientosSerieTmp.length ' + self.rendimientosSerieTmp.length );

      if(new_value < 0){
        new_value = 0;
      }
      if(new_value >= self.rendimientosSerieTmp.length - 2){
        new_value = self.rendimientosSerieTmp.length - 2;
      }

      /*startTickSt = $('.highcharts-axis.highcharts-xaxis').children('.highcharts-tick');

      var totalMonths = self.rendimientosSerieTmp.length - 2;
      console.log('getValue totalMonths ' + totalMonths +
        ' startTickSt.length ' + startTickSt.length +
        ' self.tickPos.length ' + self.tickPos.length +
        ' self.tickPos ' + self.tickPos +
        ' self.ahorrosSerie1.length ' + self.ahorrosSerie1.length +
        ' self.rendimientosSerie1.length ' + self.rendimientosSerie1.length);
*/
        if((self.ahorrosSerie1.length - 1) > 0 && (self.rendimientosSerie1.length - 1) === 0) {
          // console.log('es solo de acumulacion');
        }else if((self.ahorrosSerie1.length - 1) === 0 && (self.rendimientosSerie1.length - 1) > 0) {
          // console.log('es solo de desacumulacion new_value ' + new_value);
        }else if((self.ahorrosSerie1.length - 1) > 0 && (self.rendimientosSerie1.length - 1) > 0) {
          // console.log('es de acumulacion y desacumulacion');
        }
        self.pasoLimiteMedio = false;
        if((self.ahorrosSerie1.length - 1) > 0 && (self.rendimientosSerie1.length - 1) > 0) {
          // console.log('es de acumulacion y desacumulacion new_value ' + new_value);
         // console.log('es de acumulacion y desacumulacion new_value + min ' + ((new_value) + (self.myChart.xAxis[0].min * -1) ));
          if(new_value >= self.ahorrosSerie1.length - 1) {
            new_value = new_value + 0;
            self.pasoLimiteMedio = true;
            // console.log('es de acumulacion y desacumulacion se debe sumar uno new_value ' + new_value + ' self.pasoLimiteMedio ' + self.pasoLimiteMedio);

          }
        }


      return new_value;
     };

     var drag_stopM = function (e) {
      // console.log('entro al drag_stopM');
      $('#cirM').unbind('.line');
      $('#cirM').unbind('.linett');
      $('#cirM').unbind('.texttt');
      $('#cirM').unbind('.rect');
      $('#cirM').unbind('.rect2');
     };

     var drag_stop = function (e) {
        $(document).unbind('.line');
        $(document).unbind('.linett');
        $(document).unbind('.texttt');
        $(document).unbind('.rect');
        $(document).unbind('.rect2');

        var plotLine = getPlotLine();
        if(plotLine != null){
          //alert('drag_stop plotLine ' + plotLine );
          if (plotLine.hasOwnProperty('translateX')) {
            //alert('drag_stop hasOwnProperty getValue ' + getValue());

          }

          /*getPlotLine()
                .css({'cursor': 'pointer'})
                .translate(0, 0)
                .on('mousedown', drag_start);*/
        }

     };

    // drag_stop();



     this.myChart = Highcharts.chart('containerGrafica', {
       chart: {
         type: 'area',
         marginTop: self.margenTop,
         marginRight: self.margenRight,
         marginLeft: self.margenLeft
       },
       credits: {
        enabled: false
       },
       title: {
         text: ' '
       },
       legend: {
         //itemDistance: 200,
         symbolPadding: 10,
         itemWidth: 150
       },
       xAxis: {
         allowDecimals: false,
         tickWidth: 2,
         tickPositions: this.tickPos,
         plotLines: [{
           color: '#FFFFFF',
           width: 2,
           value: this.ahorrosSerie1.length - 1,
           zIndex: 10,
           className: 'lineaDivisoria'
         } , {
           color: '#FFFFFF',
           width: 0,
           value: 0,
           id: 'lineaGuiaStart'
         }],
         labels: {
           formatter: function () {
             return this.value / 12;
           }
         }
       },
       yAxis: {
         gridLineWidth: 0,
         visible: false,
         title: {
           text: ' '
         },
         labels: {
           formatter: function () {
             return this.value / 1000 + 'k';
           }
         },
         min: 0,
       },
       tooltip: {
         enabled: false,
         shared: true
       },
       plotOptions: {
         area: {
           pointStart: 0,
           marker: {
             enabled: false,
             radius: 2,
             states: {
               hover: {
                 enabled: false
               }
             }
           }
         },
         series: {
           events: {
             legendItemClick: function () {
               return false;
             }
           }
         },
       },
       series: [{
         name: this.ahorroSerieName.toUpperCase(),
         data: this.ahorrosSerie1,
       }, {
         name: this.ahorroSerieName + '2',
         showInLegend: false,
         data: this.rendimientosSerie1,
         pointStart: this.pointStartSerie1
       }, {
         name: this.rendimientosSerieName.toUpperCase(),
         data: this.ahorrosSerie2
       }, {
         name: this.rendimientosSerieName + '2',
         showInLegend: false,
         data: this.rendimientosSerie2,
         pointStart: this.pointStartSerie1
       }],
       responsive: {
        rules: [{
          condition: {
            maxWidth: 768
          },
          chartOptions: {
            legend: {
              //layout: 'vertical'
            }
        }
        }]
       }
     }, function (this) {
       // iconos de la legenda
       $('.highcharts-point').attr({'width': 20, 'height': 10, rx: 0, ry: 0} );
       const linePathAttr = self.getPathData($('.highcharts-xaxis .highcharts-axis-line').attr('d'));
       const startTick = self.getPathData($('.highcharts-xaxis').children('.highcharts-tick').first().attr('d'));
       const plotBorder = $('.highcharts-plot-background').attr('height');
       const plotBorderY = $('.highcharts-plot-background').attr('y');

      //  console.log('linePathAttr ' + linePathAttr
      //  + ' startTick x ' + startTick[SVGPathData.MOVE_TO].x
      //  + ' startTick y ' + startTick[SVGPathData.MOVE_TO].y
      //  + ' plotBorder ' + plotBorder
      //  + ' plotBorderY ' + plotBorderY);

      // const startTick = self.getPathData($('.highcharts-plot-lines-10').children('.highcharts-tick').first().attr('d'));


      self.isMobile = false;
       if ($( window ).width() <= 768 ) {
        self.isMobile = true;
       } else {
        self.isMobile = false;
       }

       //alert('isMobile ' + plotBorderY);

       rend = this.renderer;
       group = rend.g('otroG').add();

       rect = rend.rect(startTick[SVGPathData.MOVE_TO].x, plotBorderY, 1, plotBorder, 0)
         .attr({
           fill: '#04f6f9',
           width: 2,
           'stroke-width': 2,
           id: 'lineaV'
         })
         .translate(0, 0)
         .add(group)
         .hide();

       rect2 = rend.rect(startTick[SVGPathData.MOVE_TO].x, plotBorderY - 10, 1, plotBorder, 0)
         .attr({
           fill: '#04f6f9',
           width: 2,
           'stroke-width': 2,
           id: 'lineaV2'
         })
         .translate(0, 0)
         .add(group);

       line = rend.image('./assets/images/slider.png',
       startTick[SVGPathData.MOVE_TO].x - 25,
       startTick[SVGPathData.MOVE_TO].y - 5 - 12.5,
         50,
         25)
         .attr({
           zIndex: 10,
           id: 'cirM'
         })
         .translate(0, 0)
         .add(group);

         let textoIni = '';
         let textoPosY = 0;

         if (self.isMobile) {
          textoIni =
          '<div class="periodoLb">0 Años</div><br>' +
          '<div class="periodoLb">0 Meses</div>';
          textoPosY = plotBorderY - 50;
         } else {
          const mesesStr = self.MESES_STR;
          var montoStr = '0';
          if ((self.ahorrosSerie1.length - 1) === 0 && (self.rendimientosSerie1.length - 1) > 0) {
            montoStr = LogicForm.round(self.ahorrosSerieTmp[1] - self.rendimientosSerieTmp[1], 0);
          }


          textoIni =
          '<div class="periodoLb">' + mesesStr.substring(0, mesesStr.length - 2) + ' 0</div><br>' +
          '<div class="subSerieLb">' + self.ahorroSerieName + '</div><br>' +
          '<div class="montoLb">$ ' + LogicForm.round(self.ahorrosSerie1[0], 0) + '</div><br>' +
          '<div class="subSerieLb">' + self.rendimientosSerieName + '</div><br>' +

          '<div class="montoLb">$  ' + montoStr + '</div><br>' +
          '<div class="periodoLbHidden">$0/div>';
          textoPosY = plotBorderY / 2;
         // alert(' desa ' + '' +   LogicForm.round(self.ahorrosSerieTmp[2] - self.rendimientosSerieTmp[2], 0));
         }

       texttt = rend.text(
          textoIni , startTick[SVGPathData.MOVE_TO].x, textoPosY
         )
         .attr({
           zIndex: 1500,
           id: 'textTooltip',
           useHTML: true
         })
         .css({
           color: '#FFFFFF',
           fontSize: '1em',
           textAnchor: 'middle',
         })
         .translate(0, 0)
         .add(group);

       const box = texttt.getBBox();

       let burbujaWidth = 158;
       if (self.isMobile) {
        burbujaWidth = burbujaWidth / 2;
       }

       //linett = rend.circle(box.x + box.width / 2, box.y + box.height / 2, box.width)
       linett = rend.circle(box.x + box.width / 2, box.y + box.height / 2, burbujaWidth / 2)
         .attr({
           'stroke-width': 1,
           stroke: '#04f6f9',
           fill: '#04f6f9',
           zIndex: 10,
           id: 'cirMtt'
         })
       .translate(0, 0)
       .add(group);

       //alert('linett.getBBox() ' + linett.getBBox().width);
       //this.options.chart.marginTop = 95;



       self.margenLeft = linett.getBBox().width / 2;
       self.margenRight = linett.getBBox().width / 2;
       self.margenTop = linett.getBBox().width + ( (linett.getBBox().width * 15 ) / 100 );


      // $('.highcharts-root').attr('height', (parseFloat($('.highcharts-root').attr('height')) + (linett.getBBox().width) / 2) );

      // group.on('mousedown', start);
      // group.on('touchstart', startM);
       group.on('mousedown', drag_start);
       group.on('touchstart', drag_startM);
       group.translate(0, 0);
       group.toFront();

     });
    //  console.log('return this.myChart ' + this.myChart);
     return this.myChart;
   }



   getCurrentBrowser(){
    const { detect } = require('detect-browser');
    const browser = detect();
    if (browser) {
      this.browserName = browser.name;
      // console.log('getCurrentBrowser browser.name ' + browser.name);
      // console.log('getCurrentBrowser browser.version ' + browser.version);
      // console.log('getCurrentBrowser browser.os ' + browser.os);
      if (browser.name === 'chrome') {
        this.ajusteNavegador = 2;
        this.ajusteNavegadorRightSerie = 1;
      }else if (browser.name === 'firefox') {
        this.ajusteNavegador = 0;
        this.ajusteNavegadorRightSerie = 0;
      }else if (browser.name === 'edge') {
        this.ajusteNavegador = 2;
        this.ajusteNavegadorRightSerie = 0;
      }else if (browser.name === 'ie') {
        this.ajusteNavegador = 2;
        this.ajusteNavegadorRightSerie = 0;
      }else {
        // console.log('getCurrentBrowser Navegador no encontrado ');
        this.ajusteNavegador = 0;
        this.browserName = 'unknow';
        this.ajusteNavegadorRightSerie = 0;
      }
    }else {
      // console.log('getCurrentBrowser objeto browser no encontrado ');
      this.ajusteNavegador = 0;
      this.browserName = 'unknow';
      this.ajusteNavegadorRightSerie = 0;
    }
    // console.log('getCurrentBrowser this.ajusteNavegador ' + this.ajusteNavegador +
    //   ' this.ajusteNavegadorRightSerie ' + this.ajusteNavegadorRightSerie);
   }

   ngOnInit() {
    this.getCurrentBrowser();
   }

   calculateTickPositions(): number[] {
    //  console.log('calculateTickPositions ahorrosSerie1.length ' + this.ahorrosSerie1.length / 12 +
    //  ' ahorrosSerie2.length ' + this.ahorrosSerie2.length / 12 +
    //  ' rendimientosSerie1.length ' + this.rendimientosSerie1.length / 12 +
    //  ' rendimientosSerie2.length ' + this.rendimientosSerie2.length / 12);
     const resp = [0, this.ahorrosSerie1.length - 1, (this.ahorrosSerie1.length - 1) + (this.rendimientosSerie1.length - 1) ];

    //  console.log('calculateTickPositions resp ' + resp);
     return resp;
   }

   ngOnChanges() {
    this.contador++;
    //salert('this.contador2 '+this.contador);

    //this.printObject();

    if(this.contador === 2) {
      //alert('this.contador2 '+this.contador);
     // this.renderGrafica();
    }
    this.renderGrafica();



   }

   printObject() {
    //  console.log(
    // ' this.seriesResponseGraph.ahorroSerie1 ' + this.seriesResponseGraph.ahorroSerie1.length + '\n' +
    // ' this.seriesResponseGraph.ahorroSerie2 ' + this.seriesResponseGraph.ahorroSerie2.length + '\n' +
    // ' this.seriesResponseGraph.ahorroSerieName ' + this.seriesResponseGraph.ahorroSerieName + '\n' +
    // ' this.seriesResponseGraph.rendimientosSerieName ' + this.seriesResponseGraph.rendimientosSerieName + '\n' +
    // ' this.seriesResponseGraph.rendimientosSerie1 ' + this.seriesResponseGraph.rendimientosSerie1.length + '\n' +
    // ' this.seriesResponseGraph.rendimientosSerie2 ' + this.seriesResponseGraph.rendimientosSerie2.length + '\n' +
    // ' this.seriesResponseGraph.pointStartSeries ' + this.seriesResponseGraph.pointStartSeries + '\n' +
    // ' this.seriesResponseGraph.textoRentaMensual ' + this.seriesResponseGraph.textoRentaMensual + '\n' +
    // ' this.seriesResponseGraph.textoRentaMensualCero ' + this.seriesResponseGraph.textoRentaMensualCero + '\n' +
    // ' this.seriesResponseGraph.rentaMensual.renta ' + this.seriesResponseGraph.rentaMensual.renta);
   }



   renderGrafica() {


    //  console.log('ngOnChanges SeriesResponse en grafica ' + this.seriesResponseGraph);

    //  console.log('renderGrafica this.ajusteNavegador ' + this.ajusteNavegador);

     if(this.seriesResponseGraph != undefined){

     this.ahorrosSerie1 = this.seriesResponseGraph.ahorroSerie1;
     this.ahorrosSerie2 = this.seriesResponseGraph.ahorroSerie2;
     this.ahorroSerieName = this.seriesResponseGraph.ahorroSerieName;
     this.rendimientosSerieName = this.seriesResponseGraph.rendimientosSerieName;
     this.rendimientosSerie1 = this.seriesResponseGraph.rendimientosSerie1;
     this.rendimientosSerie2 = this.seriesResponseGraph.rendimientosSerie2;
     this.pointStartSerie1 = this.seriesResponseGraph.pointStartSeries;
     this.pointStartSerie2 = this.seriesResponseGraph.pointStartSeries;



    // this.ahorrosSerie2.pop();
    // this.ahorrosSerie2.pop();

   // this.rendimientosSerie2.shift(); //original

   // this.rendimientosSerie1.shift();

    const vvv = 'this.ahorrosSerie1[0] ' + this.ahorrosSerie1[0] +
    ' this.ahorrosSerie1[length] ' + this.ahorrosSerie1[this.ahorrosSerie1.length - 1] +
    '\n' +
    ' this.rendimientosSerie1[0] ' + this.rendimientosSerie1[0] +
    ' this.rendimientosSerie1[length] ' + this.rendimientosSerie1[this.rendimientosSerie1.length - 1] +
    '\n' +
    ' this.ahorrosSerie2[0] ' + this.ahorrosSerie2[0] +
    ' this.ahorrosSerie2[length] ' + this.ahorrosSerie2[this.ahorrosSerie2.length - 1] +
    '\n' +
    ' this.rendimientosSerie2[0] ' + this.rendimientosSerie2[0] +
    ' this.rendimientosSerie2[length] ' + this.rendimientosSerie2[this.rendimientosSerie2.length - 1];

    // console.log('vvv ' + vvv);

     this.ahorrosSerieTmp = this.ahorrosSerie1.concat(this.rendimientosSerie1);
     this.rendimientosSerieTmp = this.ahorrosSerie2.concat(this.rendimientosSerie2);


    //  console.log('__ this.rendimientosSerie2[0] ' + this.rendimientosSerie2[0]);
    //  console.log('__ this.rendimientosSerie1[0] ' + this.ahorrosSerie2[this.ahorrosSerie2.length - 1]);

    //  console.log('__ ahorrosSerieTmp ' + this.ahorrosSerieTmp.length);
     let ahorrosSerieTmpStr = '';
     for ( let i = 0; i < this.ahorrosSerieTmp.length; i++ ){
      //console.log('__ ahorrosSerieTmp ' + this.ahorrosSerieTmp[i]);
      ahorrosSerieTmpStr = ahorrosSerieTmpStr + this.ahorrosSerieTmp[i] + ' , ';
     }
    //  console.log('__ ahorrosSerieTmpStr ' + ahorrosSerieTmpStr);

    //  console.log('__ rendimientosSerieTmp ' + this.rendimientosSerieTmp.length);
     let rendimientosSerieTmpStr = '';
     for ( let i = 0; i < this.rendimientosSerieTmp.length; i++ ){
      //console.log('__ rendimientosSerieTmp ' + this.rendimientosSerieTmp[i]);
      rendimientosSerieTmpStr = rendimientosSerieTmpStr + this.rendimientosSerieTmp[i] + ' , ';
     }
    //  console.log('__ rendimientosSerieTmpStr ' + rendimientosSerieTmpStr);
//alert('this.ahorrosSerieTmp.length ' + this.ahorrosSerieTmp.length);
    // ahorrosSerieTmp: number[];
   //rendimientosSerieTmp: number[];

     this.textoRentaMensual = this.seriesResponseGraph.textoRentaMensual;
     this.textoRentaMensualCero = this.seriesResponseGraph.textoRentaMensualCero;

    //  console.log('ngOnChanges SeriesResponse en grafica this.textoRentaMensual ' + this.textoRentaMensual);
    //  console.log('ngOnChanges SeriesResponse en grafica this.textoRentaMensualCero ' + this.textoRentaMensualCero);
     this.rentaMensual = this.seriesResponseGraph.rentaMensual;
    //  console.log('rentaMensual2 ' + this.seriesResponseGraph.rentaMensual.renta);

     this.ahorroMb = '0';
     this.rendimientoMb = '0';

     this.tickPos = this.calculateTickPositions();
     this.myChart = this.charInit();


     this.calcularAjuste();

     }

     /*else {
     this.ahorrosSerie1 = [0, 0];
     this.ahorrosSerie2 = [0, 0];
     this.ahorroSerieName = 'Ahorro';
     this.rendimientosSerieName = 'Rendimientos';
     this.rendimientosSerie1 = [0, 0];
     this.rendimientosSerie2 = [0, 0];
     this.pointStartSerie1 = 0;
     this.pointStartSerie2 = 0;

     this.tickPos = [0];
     this.myChart = this.charInit();

     const linePathAttr = this.getPathData($('.highcharts-xaxis .highcharts-axis-line').attr('d'));

     var path = this.myChart.renderer.path([
       'M', linePathAttr[SVGPathData.LINE_TO].x - 7, linePathAttr[SVGPathData.MOVE_TO].y - 0.5 + 10,
       'L', linePathAttr[SVGPathData.LINE_TO].x - 7, linePathAttr[SVGPathData.MOVE_TO].y - 0.5])
      .attr({
        'stroke-width': 2,
        stroke: '#ccd6eb',
        class: 'highcharts-tick',
        opacity: 1
      })
      .add();

      var textPath = this.myChart.renderer.text(
        0,
        linePathAttr[SVGPathData.LINE_TO].x - 10.5,
        linePathAttr[SVGPathData.MOVE_TO].y + 18)
       .attr({
         opacity: 1,
         textAnchor: 'middle'
       })
       .css ({
        color: '#666666',
        cursor: 'default',
        fontSize: '11px',
        fill: '#666666',
       })
       .add();

       $('#cirMtt').attr('cy', parseFloat($('#cirMtt').attr('cy')) + 10) ;
       $('#textTooltip').attr('y', parseFloat($('#textTooltip').attr('y')) + 10);
    }*/
   }

 }

