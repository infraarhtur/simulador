import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';


import { BaseControl } from './Models/dynamicControls/base-control';
import { InputCurrency } from './Models/dynamicControls/input-currency';
import { InputDropdown } from './Models/dynamicControls/input-dropdown';
import { InputText } from './Models/dynamicControls/input-text';
import { InputRadio } from './Models/dynamicControls/input-radio';
// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
declare var $: any;
declare var require: any;

@Injectable()
export class ServicesService {
  public url: string;
  public urlContacto: string;
  constructor(public http: HttpClient) {
    this.url = './assets/fileConfig.json';
    // this.urlContacto = 'https://cs11.salesforce.com/servlet/servlet.WebToCase';
    this.urlContacto = 'http://190.216.128.52/SkCo.EnablingAdviceApi/api/SaveSuscription';

  }


  getInfoGeneral(): Observable<any> {
    return this.http.get(this.url);
  }


  private extractData(res: Response) {

    const body = res;
    return body || {};
  }

  private handleError(error: any) {
    const errMsg = error.message || error.statusText || 'Server Error';

    console.log(errMsg);

    return Observable.throw(errMsg);
  }



  getDynamicControls() {
    const a = this.http.get(this.url)
      .map(this.extractData)
      .catch(this.handleError);
    return a;
  }

  sendInfoContacto(contacto) {
 

    contacto.orgid = '00DZ000000Mikn5';
    const objParameters = new Object();
    const objEmailData = new Object();
    const valuesArray = new Array();
    const objValueName = new Object();
    const objDocumentType = new Object();
    const objDocument = new Object();
    const objEmail = new Object();
    const objPhone = new Object();
    const objSubject = new Object();
    const objDescription = new Object();



    objEmailData['From'] = contacto.from;
    objEmailData['To'] = contacto.email;
    objEmailData['Subject'] = contacto.subject;
    objEmailData['Recipient'] = contacto.Recipient.toString().replace('#contactoName', contacto.name);
    objValueName['Key'] = 'Nombre';
    objValueName['Value'] = contacto.name;

    objDocumentType['Key'] = 'TipoDocumento';
    objDocumentType['Value'] = contacto.documentType;

    objDocument['Key'] = 'NumeroDocumento';
    objDocument['Value'] = contacto.documentNumber;

    objEmail['Key'] = 'Email';
    objEmail['Value'] = contacto.email;

    objPhone['Key'] = 'Telefono';
    objPhone['Value'] = contacto.phone;

    objSubject['Key'] = 'Asunto';
    objSubject['Value'] = contacto.subject;

    objDescription['Key'] = 'Descripcion';
    objDescription['Value'] = contacto.description;

    valuesArray.push(objValueName);
    valuesArray.push(objDocumentType);
    valuesArray.push(objDocument);
    valuesArray.push(objEmail);
    valuesArray.push(objPhone);
    valuesArray.push(objSubject);
    valuesArray.push(objDescription);

    objParameters['MicroSiteCode'] = contacto.MicroSiteCode;
    objParameters['FormCode'] = contacto.FormCode;
    objParameters['UserKey'] = contacto.email;
    objParameters['KeyType'] = contacto.KeyType;
    objParameters['EmailData'] = objEmailData;
    objParameters['Values'] = valuesArray;


    const params2 = JSON.stringify(objParameters);
    const params = JSON.stringify(contacto);


    const httpOptions = new HttpHeaders().append('Content-Type', 'application/json');
   
    this.urlContacto = localStorage.getItem('urlService');
    console.log(params2.toString());
    const a = this.http.post(this.urlContacto, params2, { headers: httpOptions })
      .map(this.extractData)
      .catch(this.handleError);

    a.subscribe(resp => {
      console.log(resp);
      //alert(resp);
    }, error => {

      console.log('Error occured');
    }
    );
    return a;
  }
}
