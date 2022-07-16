import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../alert/alert.service';
import { NgxSpinnerService } from "ngx-spinner";



@Component({ templateUrl: 'designer.html' })

export class DesignerComponent implements OnInit {
    loading = false;
    


    constructor( 
        private fb: FormBuilder,
        private alertService: AlertService,
        private spinner: NgxSpinnerService) {
    }

    ngOnInit() {
      this.loadScript("assets/canvas.js");

    }
  

    public loadScript(url) {
      let node = document.createElement('script');
      node.src = url;
      node.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(node);
  }
      
    
    
    

     
}