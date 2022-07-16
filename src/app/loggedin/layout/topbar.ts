import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@app/_models';
import { AccountService, CommissionService, SearchService, } from '@app/_services';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../alert/alert.service';
import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';


@Component({
  selector: 'topbar-element',
  templateUrl: 'topbar.html',
  styles: ['.nav-item .fa { color: ' + environment.config.theme.background + '; }']
})

export class TopbarComponent {

  user: User;
  closeModal: string;
  searchResult: any;
  searchResultProductData: any = null;
  imageUrl: string;
  userLastLogin: string;
  userObj: any;
  theme: any = environment.config.theme;
  title: string = environment.config.title;
  sleepTimeoutForm: FormGroup;
  navsAvailability: any = environment.config.navs;
  searchButtonColor: any =  environment.config.theme.background;
  @Input() searchword: string;
  @Output() searchcriteria = new EventEmitter<String>();

  constructor(
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private searchService: SearchService,
    private router: Router,
    private alertService: AlertService,
    private commissionService: CommissionService
  ) {
    this.user = this.accountService.userValue;
    this.accountService.user.subscribe(x => this.user = x);
    this.searchword = "";
    this.userObj = localStorage.getItem('user');
    const processedUserObj = JSON.parse(this.userObj);
    this.userLastLogin = new Date(processedUserObj.lastLogin).toLocaleDateString('en-GB') + " " + new Date(processedUserObj.lastLogin).toLocaleTimeString();


  }
  ngOnInit() {

    this.sleepTimeoutForm = new FormGroup({
      'startTime': new FormControl(null),
      'setDurationHour': new FormControl(null),
      'setDurationMinute': new FormControl(null)
    });

  }

  onSubmitSleepTimeout() {

    let sleepTOVal = this.sleepTimeoutForm.value;
    if (sleepTOVal.startTime == null || sleepTOVal.setDurationMinute == null) {
      this.alertService.error("Enter all values",
        { autoClose: true }
      );
    } else {
      this.spinner.show();
      let sleepStartTime = sleepTOVal.startTime.split(":");
      this.commissionService.setSleepTimeout(sleepStartTime, sleepTOVal.setDurationHour, sleepTOVal.setDurationMinute)
        .subscribe(data => {
          if (data["responseCode"] == 200) {
            this.sleepTimeoutForm.reset();
            this.spinner.hide();
            this.alertService.success("Successfully set Sleep Timeout",
              { autoClose: true }
            );
          } else {
            this.alertService.error("Failed to set Sleep Timeout",
              { autoClose: true }
            );
          }
        });
    }
  }

  counter(durationHour: number) {
    return new Array(durationHour);
  }


  logout() {
    this.accountService.logout();
  }

  searchThis(val: string) {
    this.searchword = val;

  }

  searchTag(content, notFoundContent) {
    // this.searchcriteria.emit(this.searchword);
    // this.searchword = '';
    this.spinner.show();
    this.searchService.doSearch(this.searchword)
      .subscribe(data => {
        if (data['responseCode'] == 200) {
          if (data['eslMappingVO'] == null) {
            this.spinner.hide();
            this.modalService.open(notFoundContent, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
              this.closeModal = `Closed with: ${res}`;
            }, (res) => {
              this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
            });
          } else {
            let productId = data['eslMappingVO']['productSKU'];
            // console.log(data['eslMappingVO']['stage']);
            if (data['eslMappingVO']['stage'] == 5) {
              this.searchService.getProductInfo(productId)
                .subscribe(productData => {
                  this.spinner.hide();
                  this.searchResultProductData = productData['productInfo'];
                  this.searchword = '';
                  this.searchResult = data['eslMappingVO'];
                  this.imageUrl = "data:image/jpeg;base64, " + this.searchResult.imageData;
                  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
                    this.closeModal = `Closed with: ${res}`;
                  }, (res) => {
                    this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
                  });
                });
            } else {
              this.spinner.hide();
              this.searchword = '';
              this.searchResult = data['eslMappingVO'];
              this.imageUrl = "data:image/jpeg;base64, " + this.searchResult.imageData;
              this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
                this.closeModal = `Closed with: ${res}`;
              }, (res) => {
                this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
              });
            }

          // this.router.navigate(['search'], { state: { example: data['eslMappingVO'] } });
          }
        } else {
          this.spinner.hide();
          this.modalService.open(notFoundContent, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
            this.closeModal = `Closed with: ${res}`;
          }, (res) => {
            this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
          });
        }


      });

  }



  triggerModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
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

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  sleepTimerModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissionReason(res)}`;
    });
  }

  private getDismissionReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  checkVisibility(navVisible, navName) {
    var userObj = JSON.parse(localStorage.getItem('user'));
    var userType = userObj.type;
    if (navVisible) {
      if (navName == "settings") {
        if (userType == 0) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

}