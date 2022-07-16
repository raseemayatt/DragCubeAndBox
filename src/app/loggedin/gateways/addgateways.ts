import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService, GatewayService } from '@app/_services';
import { AlertService } from '../../alert/alert.service'
import { HelperService } from '@app/_services/helper.service';
import { environment } from '@environments/environment';

@Component({
    selector: 'addgateways-element',
    templateUrl: 'addgateways.html'
})

export class AddGatewaysComponent {

    loading = false;
    addGatewayForm: FormGroup;
    gatewayList: any[];
    commConfirmation: string;
    themeBg: any =  environment.config.theme.background;
    
    constructor(
        private gatewayService: GatewayService,
        private accountService: AccountService,
        private alertService: AlertService,
        private helper: HelperService
    ) { }
    ngOnInit() {
        this.addGatewayForm = new FormGroup({
            'gwId': new FormControl(null),
            'gwName': new FormControl(null),
            'details': new FormControl(null),
            'status': new FormControl(null)
        });
        this.getGatewayList();
    }



    validateaddGatewayForm(addGatewayFormInfo) {
        let addGatewayFormValidation = "";
        let addGatewayValidationItems = [];

        if (addGatewayFormInfo.gwId.slice(0, 3) != "GTW") {
            addGatewayValidationItems.push("GTW as Prefix for Gateway ID");
        }
        if (addGatewayFormInfo.gwId == null || addGatewayFormInfo.gwId == "") {
            addGatewayValidationItems.push("Gateway ID");
        }
        if (addGatewayFormInfo.gwName == null) {
            addGatewayValidationItems.push("Gateway Name");
        }

        if (addGatewayValidationItems.length > 0) {
            addGatewayFormValidation = "Please enter " + addGatewayValidationItems.join(", ");
        }

        if (addGatewayFormValidation != "") {
            this.alertService.error(addGatewayFormValidation,
                { autoClose: true }
            );
            this.loading = false;
            return false;
        } 
        else {
            return true;
        }
    }

    onSubmit(): void {
        this.loading = true;
        this.alertService.clear();
        const addGatewayFormInfo = this.addGatewayForm.value;
        let validateForm = this.validateaddGatewayForm(addGatewayFormInfo);
        if (validateForm) {
            this.gatewayService.addUpdateGateway(this.addGatewayForm.value)
                .subscribe(data => {
                    if (data['responseCode'] == 200) {
                        this.alertService.success("Gateway successfully added!",
                            { autoClose: true }
                        );
                        this.loading = false;

                    }
                    else {
                        this.alertService.error("Unable to add gateway!",
                            { autoClose: true }
                        );
                        this.loading = false;
                    }
                    this.addGatewayForm.reset();
                });
        }
    }

    getGatewayList() {
        this.gatewayService.getAllGateways()
            .subscribe(data => {
                if (data['responseCode'] == 200) {
                    this.gatewayList = data['gateways'];
                }
            });
    }

    isAlphaNumericKey(evt) {
        return this.helper.isAlphaNumericKey(evt);
    }


}