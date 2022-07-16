import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, GatewayService } from '@app/_services';
import { AlertService } from '../../alert/alert.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationDialogService } from '@app/_components/confirm-popup/popup.service';
import { HelperService } from '@app/_services/helper.service';
import { environment } from '@environments/environment';


@Component({ templateUrl: 'gateways.html' })
export class GatewaysComponent implements OnInit {
    editGatewayForm: FormGroup;
    loading = false;
    gatewayList: any[];
    gatewayidList: any[];
    gatewayListVisible;
    gatewayFormVisible;
    themeBg: any =  environment.config.theme.background;

    constructor(
        private router: Router,
        private gatewayService: GatewayService,
        private accountService: AccountService,
        private alertService: AlertService,
        route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private confirmationDialogService: ConfirmationDialogService,
        private helper: HelperService
    ) {
        route.params.subscribe(val => {
            this.gatewayListVisible = true;
            this.gatewayFormVisible = false;
            // put the code from `ngOnInit` here
        });
    }

    ngOnInit() {
        this.gatewayListVisible = true;
        this.gatewayFormVisible = false;
        this.editGatewayForm = new FormGroup({
            'id': new FormControl(null),
            'gwId': new FormControl(null),
            'gwName': new FormControl(null),
            'details': new FormControl(null),
            'active': new FormControl(null)
        });
        this.getGatewayList()
    }

    getGatewayList() {
        this.gatewayListVisible = true;
        this.gatewayFormVisible = false;
        this.spinner.show();
        this.gatewayService.getAllGateways()
            .subscribe(data => {
                this.spinner.hide();
                if (data['responseCode'] == 200){
                    this.gatewayList = data['gateways'];
                }
            });
    }


    editGateway(gateway) {

        this.editGatewayForm.get('id').setValue(gateway.id);
        this.editGatewayForm.get('gwId').setValue(gateway.gwId);
        this.editGatewayForm.get('gwName').setValue(gateway.gwName);
        this.editGatewayForm.get('details').setValue(gateway.details);
        this.editGatewayForm.get('active').setValue(gateway.active);
        this.gatewayListVisible = false;
        this.gatewayFormVisible = true;

    }

    ngAfterViewInit() {
        console.log('test');
    }


    validateEditGatewayForm(editGatewayFormInfo) {
        let editGatewayFormValidation = "";
        let editGatewayValidationItems = [];

        if (editGatewayFormInfo.gwId.slice(0, 3) != "GTW") {
            editGatewayValidationItems.push("GTW as Prefix for Gateway ID");
        }
        if (editGatewayFormInfo.gwId == null || editGatewayFormInfo.gwId == "") {
            editGatewayValidationItems.push("Gateway ID");
        }
        if (editGatewayFormInfo.gwName == null || editGatewayFormInfo.gwName == "") {
            editGatewayValidationItems.push("Gateway Name");
        }

        if (editGatewayValidationItems.length > 0) {
            editGatewayFormValidation = "Please enter " + editGatewayValidationItems.join(", ");
        }

        if (editGatewayFormValidation != "") {
            this.alertService.error(editGatewayFormValidation,
                { autoClose: true }
            );
            this.loading = false;
            return false;
        }
        else {
            return true;
        }
    }

    onEditSubmit() {

        const editGatewayFormInfo = this.editGatewayForm.value;
        let validateForm = this.validateEditGatewayForm(editGatewayFormInfo);
        if (validateForm) {
            this.gatewayListVisible = true;
            this.gatewayFormVisible = false;
            this.loading = true;
            this.alertService.clear();
            this.gatewayService.addUpdateGateway(this.editGatewayForm.value)
                .subscribe(data => {
                    if (data['responseCode'] == 200) {
                        this.alertService.success("Gateway successfully edited!",
                            { autoClose: true }
                        );
                        this.loading = false;
                        this.getGatewayList()
                    }
                    else
                        this.alertService.error("Unable to edit gateway!",
                            { autoClose: true }
                        );
                    this.loading = false;

                    this.editGatewayForm.reset();
                });
        }

    }

    deleteGateway(gateway) {
        this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete gateway ' + gateway + ' ?')
            .then((confirmed) => {
                console.log('User confirmed:', confirmed);
                if (confirmed) {
                    this.loading = true;
                    this.alertService.clear();
                    this.gatewayService.deleteGateway(gateway)
                        .subscribe(data => {
                            if (data['responseCode'] == 200) {
                                this.getGatewayList();
                                this.alertService.success("Gateway Deleted Successfully",
                                    { autoClose: true }
                                );
                                this.loading = false;
                            }

                        });
                }

            })
            .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

    isAlphaNumericKey(evt) {
        return this.helper.isAlphaNumericKey(evt);
    }
}



