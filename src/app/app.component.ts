import { Component, OnInit,  DoCheck, isDevMode} from '@angular/core';

import { ServicesService} from '../app/components/services.service';
import { allResolved } from 'q';
declare var $: any;
declare var require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:  [ServicesService]
})
export class AppComponent implements OnInit{
  // questions :any[];


  constructor(private service: ServicesService){}

  title = 'app';
  public emailContacto:string;

  ngOnInit() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });


    // console.log('isDevMode() ' + isDevMode());
    if(isDevMode()) {
      require('style-loader!./../assets/style.css');
    }else{
      require('style-loader!./../assets/styleProd.css');
    }
  }

   ngDoCheck(){
   // this.emailContacto=  localStorage.getItem('emailContacto');
  }
  deleteLocalStorage()
  {
    localStorage.removeItem('emailContacto');
    localStorage.clear();
    this.emailContacto =null;

  }

}
