import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccountService, GatewayService, CommissionService } from '@app/_services';
import { AlertService } from '../../alert/alert.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';
import { HelperService } from '@app/_services/helper.service';
import { ConfirmationDialogService } from '@app/_components/confirm-popup/popup.service';


@Component({
    selector: 'commission-element',
    templateUrl: 'commission.html'
})
export class CommissionComponent {

    @ViewChild('fileInput') fileCommissionInput;

    public formData = new FormData();
    ReqJson: any = {};
    loading = false;
    singleCommissionForm: FormGroup;
    bulkCommissionForm: FormGroup;
    gatewayList: any[];
    commConfirmation: string;
    tabsAvailability: any = environment.config.tabs.commission.tabs;
    failedCommissionListData: any;
    failedCommissionListVisible;
    sub: any;
    bulkCommissionStatus: any;
    themeBg: any =  environment.config.theme.background;

    constructor(
        private gatewayService: GatewayService,
        private accountService: AccountService,
        private commissionService: CommissionService,
        private alertService: AlertService,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private helper: HelperService,
        private confirmationDialogService: ConfirmationDialogService
    ) {
        this.bulkCommissionStatus = {
            successCount: 0,
            failedCount: 0,
            resultWaiting: 0,
            totalCount: 0,
            validEntryCount: 0,
            checking: false,
            display: false
        }
    }

    ngOnInit() {

        this.singleCommissionForm = new FormGroup({
            'eslId': new FormControl(null),
            'productSKU': new FormControl(null),
            'gwId': new FormControl(null),
            'secondaryGwId': new FormControl(null),
            'modularLocation': new FormControl(null)
        });
        this.bulkCommissionForm = this.formBuilder.group({
            file: ['']
        });
        this.getGatewayList();
        this.failedCommissionListVisible = false;
        this.getFailedCommissionList();
    }

    fileChange(event, element) {
        this.bulkCommissionStatus = {
            successCount: 0,
            failedCount: 0,
            resultWaiting: 0,
            totalCount: 0,
            validEntryCount: 0,
            checking: true,
            display: false
        }
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            var userToken = localStorage.getItem('userCheckVal');
            formData.append('file', file, file.name);
            formData.append('authToken', userToken);
            this.confirmationDialogService.confirm('Please confirm..', 'Proceed to do Bulk Commission with ' + file.name + ' ?')
                .then((confirmed) => {

                    console.log('User confirmed:', confirmed);
                    if (confirmed) {
                        this.spinner.show();
                        let headers = new HttpHeaders({
                            'enctype': 'multipart/form-data'
                        });
                        let options = { headers: headers };
                        this.http.post(`${environment.apiUrl}/eslBulkCommissioningCsvUpload`, formData, options)
                            .subscribe(
                                res => {
                                    if (res["responseCode"] == 200) {
                                        let counter = 10;
                                        this.sub = interval(1000).subscribe(x => {
                                            this.commissionService.bulkCommissionStatus(res["transactionId"])
                                                .subscribe(data => {

                                                    this.bulkCommissionStatus.display = true;
                                                    if (data["responseCode"] == 200) {
                                                        this.bulkCommissionStatus.successCount = data["successCount"];
                                                        this.bulkCommissionStatus.failedCount = data["failedCount"];
                                                        this.bulkCommissionStatus.resultWaiting = data["resultWainting"];
                                                        this.bulkCommissionStatus.totalCount = data["totalCount"];
                                                        this.bulkCommissionStatus.validEntryCount = data["validEntryCount"];
                                                        this.bulkCommissionStatus.transactionId = data["transactionId"];
                                                        counter--;
                                                        if (counter == 0) {
                                                            this.spinner.hide();
                                                            this.bulkCommissionStatus.checking = false;
                                                            this.sub.unsubscribe();
                                                        }
                                                    }
                                                });
                                        });

                                        element.value = "";
                                    } else {
                                        this.bulkCommissionStatus.checking = false;
                                        this.spinner.hide();
                                        this.alertService.error("Something went wrong! Check uploaded file and try again",
                                            { autoClose: true }
                                        );
                                    }
                                },
                                err => {
                                    console.log(err.message);
                                    this.alertService.error("Something went wrong! Try again later",
                                        { autoClose: true }
                                    );
                                }
                            )
                    } else {
                        this.fileCommissionInput.nativeElement.value = '';
                        this.bulkCommissionStatus.checking = false;
                    }
                });
        }
    }
    validateCommissionUpdateForm(commissionUpdateInfo, stateValue) {
        let commissionUpdateFormValidation = "";
        let commissionUpdateValidationItems = [];


        if (commissionUpdateInfo.eslId == null || commissionUpdateInfo.eslId == "") {
            commissionUpdateValidationItems.push("ESL ID");
        } else {
            if (commissionUpdateInfo.eslId.slice(0, 3) != "ESL") {
                commissionUpdateValidationItems.push("ESL as Prefix for ESL ID");
            }
        }
        
        if (commissionUpdateInfo.gwId == null) {
            commissionUpdateValidationItems.push("Primary Gateway");
        }
        if (commissionUpdateInfo.productSKU == null || commissionUpdateInfo.productSKU == "") {
            commissionUpdateValidationItems.push("Product SKU");
        }
        if (commissionUpdateInfo.secondaryGwId == null) {
            commissionUpdateValidationItems.push("Secondary Gateway");
        }

        if (commissionUpdateValidationItems.length > 0) {
            commissionUpdateFormValidation = "Please enter " + commissionUpdateValidationItems.join(", ");
        }



        if (commissionUpdateFormValidation != "") {
            this.alertService.error(commissionUpdateFormValidation,
                { autoClose: true }
            );
            this.loading = false;
            return false;
        } else if (commissionUpdateInfo.gwId == commissionUpdateInfo.secondaryGwId) {
            commissionUpdateFormValidation = "Choose seperate gateways for Primary and Secondary Gateways";
            this.alertService.error(commissionUpdateFormValidation,
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
        console.log(this.singleCommissionForm.value);
        const commissionUpdateInfo = this.singleCommissionForm.value;
        let validateForm = this.validateCommissionUpdateForm(commissionUpdateInfo, commissionUpdateInfo.state);
        if (validateForm) {
            this.commissionService.doCommission(this.singleCommissionForm.value)
                .subscribe(data => {
                    if (data['responseCode'] == 200) {
                        this.alertService.success("Commission successfully completed!",
                            { autoClose: true }
                        );
                        this.loading = false;
                    }
                    else {
                        this.alertService.error("Commission Unsuccessfull!",
                            { autoClose: true }
                        );
                    }
                    this.singleCommissionForm.reset();
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

    getFailedCommissionList() {
        this.failedCommissionListVisible = false;
        //this.spinner.show();
        this.commissionService.getAllFailedCommission()
            .subscribe(data => {
                //this.spinner.hide();
                // if (data['responseCode'] ==200 )
                this.failedCommissionListData = data;
                console.log(this.failedCommissionListData);
            });

    }

    retryCommission(failed) {
        this.spinner.show();
        this.alertService.clear();
        console.log(failed);
        this.commissionService.retryComm(failed)
            .subscribe(data => {
                if (data['responseCode'] == 200) {
                    this.getFailedCommissionList();
                    this.alertService.success("Successfully submitted for Recommissioning",
                        { autoClose: true }
                    );
                    this.spinner.hide();
                }
            });
    }
    retryBulkCommission(bulkFailed) {
        this.spinner.show();
        this.alertService.clear();
        console.log(bulkFailed);
        this.bulkCommissionStatus = {
            successCount: 0,
            failedCount: 0,
            resultWaiting: 0,
            totalCount: 0,
            validEntryCount: 0,
            checking: true,
            display: false
        }
        this.commissionService.retryComm(bulkFailed)
            .subscribe(data => {
                if (data['responseCode'] == 200) {
                    let counter = 10;
                    this.sub = interval(1000).subscribe(x => {
                        this.commissionService.bulkCommissionStatus(data['transactionId'])
                            .subscribe(data => {
                                this.spinner.hide();
                                this.bulkCommissionStatus.display = true;
                                if (data["responseCode"] == 200) {
                                    this.bulkCommissionStatus.successCount = data["successCount"];
                                    this.bulkCommissionStatus.failedCount = data["failedCount"];
                                    this.bulkCommissionStatus.resultWaiting = data["resultWainting"];
                                    this.bulkCommissionStatus.totalCount = data["totalCount"];
                                    this.bulkCommissionStatus.validEntryCount = data["validEntryCount"];
                                    this.bulkCommissionStatus.transactionId = data["transactionId"];
                                    counter--;
                                    if (counter == 0) {
                                        this.bulkCommissionStatus.checking = false;
                                        this.sub.unsubscribe();
                                    }
                                }
                            });
                    });
                    // this.getFailedCommissionList();
                    // this.alertService.success("Successfully submitted for Recommissioning",
                    //     { autoClose: true }
                    // );
                    // this.spinner.hide();
                }
            });
    }

    isAlphaNumericKey(evt) {
        return this.helper.isAlphaNumericKey(evt);
    }
}