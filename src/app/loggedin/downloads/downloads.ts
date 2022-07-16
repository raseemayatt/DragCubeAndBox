import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../alert/alert.service';
import { DownloadService } from '@app/_services/downloads.service';
import { saveAs } from 'file-saver';
import { IDatePickerConfig } from 'ng2-date-picker';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from '@environments/environment';



@Component({ templateUrl: 'downloads.html' })

export class DownloadsComponent implements OnInit {
    loading = false;
    dateFormat: string = 'DD-MM-YYYY';
    theForm: FormGroup;
    maxDate :any = new Date().toISOString().split("T")[0];
    dynamicStartDate;
    themeBg: any =  environment.config.theme.background;


    startdateConfig: IDatePickerConfig = {
        format: this.dateFormat
    };

    constructor(private downloadService: DownloadService, 
        private fb: FormBuilder,
        private alertService: AlertService,
        private spinner: NgxSpinnerService) {
    }



    ngOnInit(): void {
        this.theForm = this.fb.group({
            items: this.fb.array([], Validators.required)
        });
        if (!this.dynamicRow.controls.length) {
            this.addDynamicRow();
        }
    }

    downloadReport(){
       const startDateStr = this.theForm.value.items[0].startdate;
       if(startDateStr){
        const startDateParts =  startDateStr.split('-');
        
        const startDateObj = new Date(startDateParts[0], parseInt(startDateParts[1], 10) - 1, startDateParts[2], 0, 0);
        const startDateTimestamp = startDateObj.getTime();
        
        this.loading = true;
        this.spinner.show();
         this.downloadService.doDownloadReport(startDateTimestamp).subscribe(
             res => {
                 this.loading = false;
                 this.spinner.hide();
                 let blob: any = new Blob([res], { type: 'application/vnd.ms.excel' });
                 saveAs.saveAs(blob, 'ESL_PriceUpdateReport' + new Date().getTime() + '.xlsx');
             },
             res => {
 
             }
         );
       } else {
        this.alertService.error("Choose a Start Date",
            { autoClose: true }
        );
        return;
       }
       
    }

    get f() {
        return this.theForm.controls
    }

    changeStartDate(e) {
        (<FormArray>this.theForm.get('items')).controls.map((me) => {
            this.dynamicStartDate = e.target.value;
        });
    }

    get dynamicRow() {
        return this.theForm.get('items') as FormArray;
    }

    addDynamicRow() {
        const item = this.fb.group({
            startdate: ['', Validators.required]
        });
        this.dynamicRow.push(item);
    }
    downloadFile() {
        this.loading = true;
        this.downloadService.doDownload().subscribe(
            res => {
                this.loading = false;
                let blob: any = new Blob([res], { type: 'application/vnd.ms.excel' });
                saveAs.saveAs(blob, 'ESL_MappingData' + new Date().getTime() + '.xlsx');
            },
            res => {

            }
        );
    }
}