
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from '../app/app.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// librerias
// import { MatSliderModule } from '@angular/material/slider';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'angular-highcharts';
// import { CurrencyMaskModule } from "ng2-currency-mask";
// Components
import { DynamicFrmComponent } from './components/dynamic-frm/dynamic-frm.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicControlComponent } from './components/dynamic-control/dynamic-control.component';
import { OnlyNumbersDirective } from './directivas/only-numbers.directive';
import { GraficaComponent } from './components/grafica/grafica.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MyCurrencyDirective } from './directivas/my-currency.directive';
import { MyCurrencyPipe } from './pipe/my-currency.pipe';
import { NouisliderModule } from 'ng2-nouislider';
import { FrmContactoComponent } from './components/frm-contacto/frm-contacto.component';
import { PositionCursorDirective } from './directivas/position-Cursor.directive';
@NgModule({
  declarations: [
    AppComponent,
    DynamicFrmComponent,
    DynamicFormComponent,
    DynamicControlComponent,
    OnlyNumbersDirective,
    GraficaComponent,
    MyCurrencyDirective,
    MyCurrencyPipe,
    PositionCursorDirective,
    FrmContactoComponent
  ],
  imports: [
    BrowserModule
    , FormsModule
    , routing
    , BrowserAnimationsModule,
    ChartModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpModule,
    NouisliderModule,
   NgbModule.forRoot ()
  ],
  exports: [
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
