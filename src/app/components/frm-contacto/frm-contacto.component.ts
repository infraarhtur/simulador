import { Component, OnInit } from '@angular/core';
import { Contacto } from '../Models/contacto';
import { ServicesService } from '../services.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

declare var $: any;
declare var require: any;

@Component({
  selector: 'app-frm-contacto',
  templateUrl: './frm-contacto.component.html',
  styleUrls: ['./frm-contacto.component.css']
})
export class FrmContactoComponent implements OnInit {

 public objContacto: Contacto;

  constructor(private service: ServicesService) {

    this.objContacto = new Contacto();

   }

  ngOnInit() {
  }

  modalGracias() {
    $('#FormularioModal').modal('toggle');
    $('#frmContacto').submit();
    $('#GraciasModal').modal(
    );
  }
  onSubmit() {
  
    this.objContacto['MicroSiteCode'] = localStorage.getItem('MicroSiteCode');
    this.objContacto['FormCode'] = localStorage.getItem('FormCode');
    this.objContacto['KeyType'] = localStorage.getItem('KeyType');
    this.objContacto['Recipient'] = localStorage.getItem('Recipient');
    this.objContacto['from'] = localStorage.getItem('from');
this.service.sendInfoContacto( this.objContacto);
    $('#FormularioModal').modal('toggle');
    $('#GraciasModal').modal();

    // var  ventana = 'https://cs11.salesforce.com/servlet/servlet.WebToCase?name=';
    // ventana += 'luis&00NA0000001lssk=cedula&00NA0000001lsuq=1026275515&email=infraarhtur@gmail.com';
    // ventana += '&phone=32908965783&subject=hola&description=edkejdhkjdkjdkehdkjhd';

    // window.open(ventana, '_blank');
  }
}
