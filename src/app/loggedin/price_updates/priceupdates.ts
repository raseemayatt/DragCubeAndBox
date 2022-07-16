import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService, GatewayService, } from '@app/_services';
import { AlertService } from '../../alert/alert.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { PriceUpdatesService } from '@app/_services/priceupdates.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { interval } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HelperService } from '@app/_services/helper.service';
import { ConfirmationDialogService } from '@app/_components/confirm-popup/popup.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadService } from '@app/_services/downloads.service';
import { saveAs } from 'file-saver';
import { data } from 'jquery';


@Component({
    selector: 'priceupdates-element',
    templateUrl: 'priceupdates.html'
})

export class PriceupdatesComponent {
    @ViewChild('fileInput') filePriceUpdatesInput;
    tabsAvailability: any = environment.config.tabs.priceUpdates.tabs;
    bulkpriceUpdateForm: FormGroup;
    priceUpdateForm: FormGroup;
    imageUrl: string;
    ReqJson: any = {};
    unitListVisible;
    unitListData: any;
    priceRetryForm: FormGroup;
    priceRefreshForm: FormGroup;
    loading = false;
    printloading = false;
    gatewayList: any[];
    bulkPriceUpdateStatus: any;
    sub: any;
    previewLoading: any = false;
    retryByTrans: any = false;
    imageData: any = null;
    postId: any;
    themeBg: any = environment.config.theme.background;
    closeModal: string;
    res: any;
    templateByIdList: any;
    tempTypeListData: any;
    nameOftemp: any;

    constructor(
        private gatewayService: GatewayService,
        private unitService: PriceUpdatesService,
        private alertService: AlertService,
        private priceupdatesService: PriceUpdatesService,
        private accountService: AccountService,
        private modalService: NgbModal,
        private sanitizer: DomSanitizer,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private helper: HelperService,
        private confirmationDialogService: ConfirmationDialogService,
        private downloadService: DownloadService
    ) {

        this.bulkPriceUpdateStatus = {
            successCount: 0,
            failedCount: 0,
            resultWaiting: 0,
            totalCount: 0,
            validEntryCount: 0,
            checking: true,
            display: false
        }
    }

    ngOnInit() {
        this.retryByTrans = false;

        this.priceRetryForm = new FormGroup({
            'SKUretryid': new FormControl(null)
        });

        this.priceRefreshForm = new FormGroup({
            'SKUrefreshid': new FormControl(null)
        });
        this.priceUpdateForm = new FormGroup({
            'itemName': new FormControl(null),
            'state': new FormControl(null),
            'upc': new FormControl(null, Validators.required),
            'price': new FormControl(null),
            'discountPrice': new FormControl(null),
            'quantityValue': new FormControl(null),
            'quantityUnit': new FormControl(null),
            'count': new FormControl(null),
            'itemDescription': new FormControl(null),
            'unitPrice': new FormControl(null),
            'pdfTypeName': new FormControl(null)
        });

        this.bulkpriceUpdateForm = this.formBuilder.group({
            file: ['']
        });
        this.getGatewayList();
        this.unitList();
    }

    validatePriceUpdateForm(priceUpdateInfo, stateValue) {


        let priceUpdateFormValidation = "";
        let priceUpdateValidationItems = [];
        console.log(priceUpdateInfo);
        if (stateValue) {
            if (stateValue == "1") {
                if ((this.priceUpdateForm.value.itemName === null) || (priceUpdateInfo.itemName == "")) {
                    priceUpdateValidationItems.push("Product Name");
                }
                if ((priceUpdateInfo.price == null) || (priceUpdateInfo.price == "")) {
                    priceUpdateValidationItems.push("Price");
                } else {
                    if (parseInt(priceUpdateInfo.discountPrice) >= parseInt(priceUpdateInfo.price)) {
                        priceUpdateFormValidation = "Discount price should be less than actual price";
                    }
                }
                if ((priceUpdateInfo.quantityValue == null) || (priceUpdateInfo.quantityValue == "")) {
                    priceUpdateValidationItems.push("Quantity Value");
                }
                if ((priceUpdateInfo.quantityUnit == null) || (priceUpdateInfo.quantityUnit == "")) {
                    priceUpdateValidationItems.push("Quantity Unit");
                }
                if ((priceUpdateInfo.upc == null) || (priceUpdateInfo.upc == "")) {
                    priceUpdateValidationItems.push("Product ID");
                }
                if ((priceUpdateInfo.itemDescription == null) || (priceUpdateInfo.itemDescription == "")) {
                    priceUpdateValidationItems.push("Product Description");
                }
                if ((priceUpdateInfo.unitPrice == null) || (priceUpdateInfo.unitPrice == "")) {
                    priceUpdateValidationItems.push("Unit Price");
                }
                if (priceUpdateInfo.count == null) {
                    priceUpdateValidationItems.push("Item Number");
                }
                
                if (priceUpdateValidationItems.length > 0) {
                    priceUpdateFormValidation = "Please enter " + priceUpdateValidationItems.join(", ");
                }
            }
            if (stateValue == "0") {
                if (priceUpdateInfo.upc == null) {
                    priceUpdateFormValidation = "Please enter Product ID";
                }
            }
        }
        else {
            priceUpdateFormValidation = "Please Choose state (Out of stock / Price Update)";
        }
        // if (stateValue == "1") {
        //     if (priceUpdateFormValidation == "") {
        //         console.log(parseInt(priceUpdateInfo.price));
        //         console.log(parseInt(priceUpdateInfo.discountPrice));
        //         if (parseInt(priceUpdateInfo.discountPrice) >= parseInt(priceUpdateInfo.price)) {

        //             priceUpdateFormValidation = "Discount price should be less than actual price";

        //         }
        //         else {
        //             priceUpdateFormValidation = "";
        //         }

        //         if (priceUpdateInfo.price.match(/^[0-9]+(.[0-9]{0,2})?$/)) {

        //         } else {
        //             priceUpdateFormValidation = "Price is not a valid number";
        //         }

        //         if (priceUpdateInfo.discountPrice.match(/^[0-9]+(.[0-9]{0,2})?$/)) {

        //         } else {
        //             priceUpdateFormValidation = "Discount price is not a valid number";
        //         }



        //     }
        // }

        if (priceUpdateFormValidation != "") {
            this.alertService.error(priceUpdateFormValidation,
                { autoClose: true }
            );
            this.loading = false;
            return false;
        }
        else {
            return true;
        }
    }

    onSubmit1(): void {
        this.loading = true;
        this.alertService.clear();
        console.log(this.priceUpdateForm.value);
        const priceUpdateInfo = this.priceUpdateForm.value;
        let validateForm = this.validatePriceUpdateForm(priceUpdateInfo, priceUpdateInfo.state);
        if (validateForm) {
            this.priceupdatesService.doCheckSKU(this.priceUpdateForm.value.upc)
                .subscribe(data => {
                    if (data['status'] == true) {
                        this.priceupdatesService.doPriceupdate(priceUpdateInfo)
                            .subscribe(data => {
                                if (data['responseCode'] == 200) {
                                    console.log(data['productInfoVO']);
                                    this.alertService.success("Successfully Submitted for Price Update!",
                                        { autoClose: true }
                                    );
                                    this.priceUpdateForm.reset();
                                    this.imageData = "";
                                }
                            });
                    }
                    else {
                        this.alertService.error("Product Id Invalid/not commissioned!",
                            { autoClose: true }
                        );
                    }
                    this.loading = false;
                });
        }
    }


    showPreview(formVal) {
        this.previewLoading = true;
        this.alertService.clear();
        this.imageData = null;
        let formObject = {
            id: '1',
            itemName: formVal.itemName,
            state: formVal.state,
            upc: formVal.upc,
            price: formVal.price,
            discountPrice: formVal.discountPrice,
            quantityValue: formVal.quantityValue,
            quantityUnit: formVal.quantityUnit,
            count: formVal.count,
            itemDescription: formVal.itemDescription,
            unitPrice: formVal.unitPrice,
        };

        //const priceUpdateInfo = this.priceUpdateForm.value;
        console.log(formVal.itemName);
        let validatePreview = this.validatePriceUpdateForm(formVal, formObject.state);
        if (validatePreview) {
            this.priceupdatesService.priceUpdatePreview(formObject)
                .subscribe(data => {
                    this.previewLoading = false;
                    this.imageData = "data:image/bmp;base64, " + data['imageData'];
                })
        } else {
            this.previewLoading = false;
        }
    }

    sanitizeImageUrl(imageUrl: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }

    onSubmit2(): void {
        this.loading = true;
        this.alertService.clear();
        console.log(this.priceRetryForm.value.SKUretryid);
        this.priceupdatesService.doCheckSKU(this.priceRetryForm.value.SKUretryid)
            .subscribe(data => {
                if (data['status'] == true) {
                    this.priceupdatesService.doPriceretry(this.priceRetryForm.value.SKUretryid)
                        .subscribe(data => {
                            if (data['responseCode'] == 200) {
                                this.alertService.success("Successfully Submitted for Price Retry!",
                                    { autoClose: true }
                                );
                                this.loading = false;

                            }
                            else {
                                this.alertService.error("Price Update Unsuccessfull!",
                                    { autoClose: true }
                                );
                                this.logout();
                            }
                            this.priceRetryForm.reset();
                        });
                }
                else {
                    this.alertService.error("Please enter a valid SKU ID!",
                        { autoClose: true });
                    this.loading = false;
                }
                this.loading = false;
            });
    }

    onSubmit3(): void {
        this.loading = true;
        this.alertService.clear();
        this.priceupdatesService.doCheckSKU(this.priceRefreshForm.value.SKUrefreshid)
            .subscribe(data => {
                if (data['status'] == true) {
                    this.priceupdatesService.doPricerefresh(this.priceRefreshForm.value.SKUrefreshid)
                        .subscribe(data => {
                            if (data['responseCode'] == 200) {
                                this.alertService.success("Successfully Submitted for Price Refresh!",
                                    { autoClose: true }
                                );
                                this.loading = false;
                                console.log("test");
                            }
                            else {
                                this.alertService.error("Price Update Unsuccessfull!",
                                    { autoClose: true }
                                );
                                this.logout();
                            }
                            this.priceRefreshForm.reset();
                        });
                }
                else {
                    this.alertService.error("Please enter a valid SKU ID!",
                        { autoClose: true });
                    this.loading = false;
                }
            });
    }

    fileChange(event, element) {
        this.bulkPriceUpdateStatus = {
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
            this.confirmationDialogService.confirm('Please confirm..', 'Proceed to do Bulk Price Update with ' + file.name + ' ?')
                .then((confirmed) => {
                    console.log('User confirmed:', confirmed);
                    if (confirmed) {
                        this.spinner.show();
                        let headers = new HttpHeaders({
                            'enctype': 'multipart/form-data'
                        });
                        let options = { headers: headers };
                        this.http.post(`${environment.apiUrl}/eslBulkPriceUpdate`, formData, options)
                            .subscribe(
                                res => {
                                    let counter = 10;
                                    this.sub = interval(1000).subscribe(x => {
                                        this.priceupdatesService.bulkPriceupdateStatus(res["transactionId"])
                                            .subscribe(data => {

                                                this.bulkPriceUpdateStatus.display = true;
                                                if (data["responseCode"] == 200) {
                                                    // console.log(this.bulkCommissionStatus.totalCount+" = ("+this.bulkCommissionStatus.successCount+" + "+this.bulkCommissionStatus.failedCount+")");
                                                    this.bulkPriceUpdateStatus.successCount = data["successCount"];
                                                    this.bulkPriceUpdateStatus.failedCount = data["failedCount"];
                                                    this.bulkPriceUpdateStatus.resultWaiting = data["resultWainting"];
                                                    this.bulkPriceUpdateStatus.totalCount = data["csvLineCount"];
                                                    this.bulkPriceUpdateStatus.validEntryCount = data["validEntryCount"];
                                                    this.bulkPriceUpdateStatus.transactionId = data["transactionId"];
                                                    counter--;
                                                    if (counter == 0) {
                                                        this.spinner.hide();
                                                        this.bulkPriceUpdateStatus.checking = false;
                                                        this.sub.unsubscribe();
                                                    }
                                                }
                                            });
                                    });
                                    element.value = "";
                                },
                                err => {
                                    console.log(err.message);
                                    this.alertService.error("Something went wrong! Try again later",
                                        { autoClose: true }
                                    );
                                }
                            )
                    } else {
                        this.filePriceUpdatesInput.nativeElement.value = '';
                    }
                });

        }
    }

    retryByTransaction(transId) {
        this.spinner.show();
        this.alertService.clear();
        console.log(transId);
        this.priceupdatesService.doretryPriceupdateByTransaction(transId)
            .subscribe(data => {
                if (data['responseCode'] == 200) {
                    // this.getFailedCommissionList();
                    this.alertService.success("Successfully submitted for Retry",
                        { autoClose: true }
                    );
                    this.spinner.hide();
                }
            });
    }


    printTemplate(Content) {

        console.log("Print");

        this.modalService.open(Content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
            this.closeModal = `Closed with: ${res}`;
        }, (res) => {
            this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
        });

        this.priceupdatesService.getTemplateById()
            .subscribe(data => {
                if (data['responseCode'] == 200) {
                    this.templateByIdList = data['objList'];
                }
                else
                    console.log("Print error");
            });

    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    downloadTemplate(formValue) {
        console.log("PDF printing");
        this.printloading = true;

        let formContent = {
            eslId: '',
            itemName: formValue.itemName,
            price: formValue.price,
            quantityValue: formValue.quantityValue,
            quantityUnit: formValue.quantityUnit,
            count: formValue.count,
            itemDescription: formValue.itemDescription,
            unitPrice: formValue.unitPrice,
        };

        this.priceupdatesService.doPreviewPDF(formContent, formValue.pdfTypeName).subscribe(
            res => {
                this.printloading = false;
                console.log("PDF downloading");
                console.log('template size ' + formValue.pdfTypeName);
                let blob: any = new Blob([res], { type: 'application/pdf' });
                // saveAs.saveAs(blob, 'Response_' + formValue.pdfTypeName + '.pdf');
                console.log("PDF testing");
                const blobUrl = URL.createObjectURL(blob);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = blobUrl;
                document.body.appendChild(iframe);
                iframe.contentWindow.print();
            },
            res => {

            }
        );
    }


    getGatewayList() {
        this.gatewayService.getAllGateways()
            .subscribe(data => {
                if (data['responseCode'] == 200) {
                    this.gatewayList = data['gateways'];
                }
                else
                    this.logout();
            });
    }

    logout() {
        this.accountService.logout();
    }

    unitList() {
        this.unitListVisible = true;
        this.unitService.getAllUnits()
            .subscribe(data => {
                this.unitListData = data;
                // console.log(this.unitListData);
            });
    }

    isAlphaNumericKey(evt) {
        return this.helper.isAlphaNumericKey(evt);
    }

    isNumericKey(evt) {
        return this.helper.isNumericKey(evt);
    }

    isNumericKey1(evt) {
        return this.helper.isNumericKey1(evt);
    }
}