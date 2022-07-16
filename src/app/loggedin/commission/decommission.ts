import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfirmationDialogService } from '@app/_components/confirm-popup/popup.service';
import { AccountService } from '@app/_services';
import { DeCommissionService } from '@app/_services/decommission.service';
import { HelperService } from '@app/_services/helper.service';
import { environment } from '@environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { interval } from 'rxjs';
import { AlertService } from '../../alert/alert.service'

@Component({
    selector: 'decommission-element',
    templateUrl: 'decommission.html'
})
export class DecommissionComponent {

    @ViewChild('fileInput') fileDeCommissionInput;
    deCommissionForm: FormGroup;
    loading = false;
    tabsAvailability: any = environment.config.tabs.decommission.tabs;
    failedDeCommissionListVisible;
    bulkDeCommissionForm: FormGroup;
    formBuilder: FormBuilder;
    failedDeCommissionListData: any;
    decommbyESL: any = false;
    sub: any;
    bulkDeCommissionStatus: { successCount: number; failedCount: number; resultWaiting: number; totalCount: number; validEntryCount: number; checking: boolean; display: boolean; transactionId: number };
    DecomDecomFormloading = false;
    ReDecomDecomFormloading = false;
    DecomBulkDecomFormloading = false;
    ReDecomBulkDecomFormloading = false;
    themeBg: any =  environment.config.theme.background;


    constructor(
        private fb: FormBuilder,
        private accountService: AccountService,
        private deCommissionService: DeCommissionService,
        private alertService: AlertService,
        private helper: HelperService,
        private http: HttpClient,
        private spinner: NgxSpinnerService,
        private confirmationDialogService: ConfirmationDialogService
    ) { }

    ngOnInit() {

        this.deCommissionForm = new FormGroup({
            'DeCommissionSku': new FormControl(null),
            'DeCommissionESL': new FormControl(null)
        });

        this.bulkDeCommissionForm = this.fb.group({
            file: ['']
        });
        this.failedDeCommissionListVisible = false;
        this.getFailedDeCommissionList();
        this.bulkDeCommissionStatus = {
            successCount: 0,
            failedCount: 0,
            resultWaiting: 0,
            totalCount: 0,
            validEntryCount: 0,
            checking: false,
            display: false,
            transactionId: 0
        }
    }
    getFailedDeCommissionList() {
        this.failedDeCommissionListVisible = false;
        this.deCommissionService.getAllFailedDeCommission()
            .subscribe(data => {
                this.failedDeCommissionListData = data;
                console.log(this.failedDeCommissionListData);
            });
    }

    onSingleDecommission($event) {
        if ($event.submitter.value == "Decommission") {
            const deCommissionFormInfo = this.deCommissionForm.value;
            let validateForm = this.validateCommissionUpdateForm(deCommissionFormInfo);
            this.DecomDecomFormloading = true;
            let deCommissionList = [this.deCommissionForm.value.DeCommissionSku];
            if (validateForm) {
                console.log(this.deCommissionForm.value.DeCommissionSku);
                this.deCommissionService.doCheckSKU(this.deCommissionForm.value.DeCommissionSku)
                    .subscribe(data => {
                        if (data['status'] == true) {
                            this.deCommissionService.doDeCommission(deCommissionList)
                                .subscribe(data => {
                                    if (data['responseCode'] == 200) {
                                        this.alertService.success("Decommission by SKU ID successfully completed!",
                                            { autoClose: true }
                                        );
                                        this.getFailedDeCommissionList();
                                        this.DecomDecomFormloading = false;
                                    }
                                    this.deCommissionForm.reset();
                                });
                        }
                        else {
                            this.alertService.error("Please enter a valid SKU ID",
                                { autoClose: true }
                            );
                            this.getFailedDeCommissionList();
                            this.DecomDecomFormloading = false;
                        }
                    });
            } else {
                this.DecomDecomFormloading = false;

            }
        }
    }


    DecommissionByESL(fromVal) {
        // if ($event.submitter.value == "Decommission") {
        console.log(fromVal);
        this.decommbyESL = true;
        let deCommissionList = this.deCommissionForm.value.DeCommissionESL;
        this.deCommissionService.doDeCommissionByESL(deCommissionList)
            .subscribe(data => {
                if (data['responseCode'] == 200) {
                    this.alertService.success("Decommission by ESL ID successfully completed!",
                        { autoClose: true }
                    );
                    this.getFailedDeCommissionList();
                    this.decommbyESL = false;
                    this.deCommissionForm.reset();
                }
                else {
                    this.alertService.error("Please enter a valid ESL ID",
                        { autoClose: true }
                    );
                    this.getFailedDeCommissionList();
                    this.decommbyESL = false;
                }
            });
    }
    // }
    validateCommissionUpdateForm(updateInfo) {
        let formValidation = "";
        let formValidationItems = [];

        if (updateInfo.DeCommissionSku == null) {
            formValidationItems.push("SKU ID");
        }

        if (formValidationItems.length > 0) {
            formValidation = "Please enter a " + formValidationItems.join(", ");
        }

        if (formValidation != "") {
            this.alertService.error(formValidation,
                { autoClose: true }
            );
            this.loading = false;
            return false;
        } else {
            return true;
        }
    }



    fileChange(event, element) {
        this.bulkDeCommissionStatus = {
            successCount: 0,
            failedCount: 0,
            resultWaiting: 0,
            totalCount: 0,
            validEntryCount: 0,
            checking: true,
            display: false,
            transactionId: 0
        }
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            var userToken = localStorage.getItem('userCheckVal');
            formData.append('file', file, file.name);
            formData.append('authToken', userToken);
            this.confirmationDialogService.confirm('Please confirm..', 'Proceed to do Bulk Decommission with ' + file.name + ' ?')
                .then((confirmed) => {

                    console.log('User confirmed:', confirmed);
                    if (confirmed) {
                        this.spinner.show();
                        let headers = new HttpHeaders({
                            'enctype': 'multipart/form-data'
                        });
                        let options = { headers: headers };
                        this.http.post(`${environment.apiUrl}/bulkDeCommissioningCsvUpload`, formData, options)
                            .subscribe(
                                res => {
                                    if (res["responseCode"] == 200) {
                                        let counter = 10;
                                        this.sub = interval(1000).subscribe(x => {
                                            this.deCommissionService.bulkDeCommissionStatus(res["transactionId"])
                                                .subscribe(data => {
                                                    this.spinner.hide();
                                                    this.bulkDeCommissionStatus.display = true;
                                                    if (data["responseCode"] == 200) {
                                                        this.bulkDeCommissionStatus.successCount = data["successCount"];
                                                        this.bulkDeCommissionStatus.failedCount = data["failedCount"];
                                                        this.bulkDeCommissionStatus.resultWaiting = data["resultWainting"];
                                                        this.bulkDeCommissionStatus.totalCount = data["totalCount"];
                                                        this.bulkDeCommissionStatus.validEntryCount = data["validEntryCount"];
                                                        this.bulkDeCommissionStatus.transactionId = data["transactionId"];
                                                        counter--;
                                                        if (counter == 0) {
                                                            this.bulkDeCommissionStatus.checking = false;
                                                            this.sub.unsubscribe();
                                                        }
                                                    }
                                                });
                                        });

                                        element.value = "";
                                    } else {
                                        this.bulkDeCommissionStatus.checking = false;
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
                        this.fileDeCommissionInput.nativeElement.value = '';
                        this.bulkDeCommissionStatus.checking = false;
                    }
                });
        }
    }
    retryDeCommission(failed) {
        this.spinner.show();
        this.alertService.clear();
        console.log(failed);
        this.deCommissionService.retryDeComm(failed)
            .subscribe(data => {
                if (data['responseCode'] == 200) {
                    this.getFailedDeCommissionList();
                    this.alertService.success("Successfully submitted for Decommissioning",
                        { autoClose: true }
                    );
                    this.spinner.hide();
                }
                else{
                    this.getFailedDeCommissionList();
                }
            });
    }
    retryBulkDeCommission(bulkFailed) {
        this.spinner.show();
        this.alertService.clear();
        console.log(bulkFailed);
        this.deCommissionService.retryDeCommByTxnId(bulkFailed)
            .subscribe(data => {
                if (data['responseCode'] == 200) {
                    this.getFailedDeCommissionList();
                    this.alertService.success("Successfully submitted for Re-Decommissioning",
                        { autoClose: true }
                    );
                    this.spinner.hide();
                }
                else{
                    this.getFailedDeCommissionList();
                }
            });
    }

    isAlphaNumericKey(evt) {
        return this.helper.isAlphaNumericKey(evt);
    }

    logout() {
        this.accountService.logout();
    }
}


