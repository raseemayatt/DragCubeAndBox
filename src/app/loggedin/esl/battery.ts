import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, GatewayService } from '@app/_services';
import { AlertService } from '../../alert/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationDialogService } from '@app/_components/confirm-popup/popup.service';
import { HelperService } from '@app/_services/helper.service';
import { EslService } from '@app/_services/esl.service';


@Component({ templateUrl: 'battery.html' })
export class BatteryComponent implements OnInit {
    loading = false;
    eslList: any;

    constructor(
        private router: Router,
        private eslService: EslService,
        route: ActivatedRoute,
        private spinner: NgxSpinnerService,

    ) {
    }

    ngOnInit() {
        this.getEslList()
    }

    getEslList() {
        this.spinner.show();
        this.eslService.getAllLowBatteryCount()
            .subscribe(data => {
                this.spinner.hide();
               // if (data['responseCode'] == 200)
                this.eslList = data;
                console.log(this.eslList);
            });
    }



}
