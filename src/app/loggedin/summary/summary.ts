import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { SseService } from '@app/_services/sse.service';
import { eventNames } from 'process';

@Component(
    {
        templateUrl: 'summary.html',
        styles: [
            '.card .fa { color: ' + environment.config.theme.background + '; }',
            '.table thead { color: ' + environment.config.theme.background + '; }',
            '.blue-card { background: ' + environment.config.theme.background + '; }',
            '.blue-card ul li { color: ' + environment.config.theme.summaryCardTextColor + '; }'
        ]
    }
)
export class SummaryComponent implements OnInit {
    summaryData: any;
    dataAv: boolean = false;
    sleepStartDate: any;
    sleepStartTime: any;
    sleepStartHour: any;
    sleepStartMinute: any;
    sleepStartStatus: any;
    gatewaysCount: any;
    eventList: any;
    eventNewList = [];
    eventNewItem = {};
    themeBg: any =  environment.config.theme.background;
    timerString:any = "Intializing ...";
    constructor(private sseService: SseService) {
        var eventNewList = [];
        var eventNewItem = {};
    }

    ngOnInit() {
        let timeinterval = null;
        
        this.sseService
            .getServerSentEvent("https://iot-ust.live/v2/api/eslStatus/1234")
            .subscribe(data => {
                if(timeinterval){
                    clearInterval(timeinterval);
                }
                this.summaryData = JSON.parse(data.data);
                if (typeof this.summaryData.eslSleepStrategy != "undefined") {
                    this.gatewaysCount = this.summaryData.gatewayStatus.gateways.length;
                    try {
                        if (typeof this.summaryData.eslSleepStrategy.startAt != "undefined") {
                            this.sleepStartDate = this.getCustomDate(this.summaryData.eslSleepStrategy.startAt);
                            localStorage.setItem("timerStart", this.summaryData.eslSleepStrategy.startAt);
                            timeinterval = setInterval(this.generateTimer,1000);
                        } else {
                            this.sleepStartDate = null;
                        }
                    } catch (e) {
                        console.log("Sleep Timer not set", e);
                    }
                }
                try {
                    if (typeof this.summaryData.telimetryList != "undefined") {
                        this.eventList = [];
                        let eventNewItem = {};
                        let eventName = "";
                        this.summaryData.telimetryList.forEach(element => {
                            eventNewItem = {};
                            switch (element.eventName) {
                                case 'eslBulkCommissioningCsvUpload':
                                    eventName = 'Bulk Commissioning by CSV Upload';
                                    break;
                                case 'reTryFailedCommissioning':
                                    eventName = 'Retrying Failed Commission';
                                    break;
                                case 'retryCommissionByTransactionId':
                                    eventName = 'Retrying Failed Commission by TID';
                                    break;
                                case 'retryDecommissionBySkuList':
                                    eventName = 'Retrying Failed Decommission';
                                    break;
                                case 'retryDecommissionByTransactionId':
                                    eventName = 'Retrying Failed Decommission by TID';
                                    break;
                                case 'commissionStatusByTransactionId':
                                    eventName = 'Bulk Commission Status';
                                    break;
                                case 'eslBulkCommissioningApi':
                                    eventName = 'Bulk Commission';
                                    break;
                                case 'setEslSleepStrategy':
                                    eventName = 'Sleep Time Setting';
                                    break;
                                case 'decommissionBySkuList':
                                    eventName = 'Bulk Decommission';
                                    break;
                                case 'decommissionByEslId':
                                    eventName = 'Single Decommission By ESL ID';
                                    break;
                                case 'downloadAllEslData':
                                    eventName = 'ESL Data Download';
                                    break;
                                case 'downloadPriceUpdateReport':
                                    eventName = 'Price Update Report Download';
                                    break;
                                case 'priceUpdate':
                                    eventName = 'Single Price Update';
                                    break;
                                case 'eslBulkPriceUpdate':
                                    eventName = 'Bulk Price Update';
                                    break;
                                case 'getEslImageData':
                                    eventName = 'Price Update Preview';
                                    break;
                                case 'refreshPriceBySku':
                                    eventName = 'Refresh Price by SKU';
                                    break;
                                case 'retryPriceBySku':
                                    eventName = 'Retry Price by SKU';
                                    break;
                                case 'retryPriceupdateByTransaction':
                                    eventName = 'Retry Price by TID';
                                    break;
                                case 'deleteGateway':
                                    eventName = 'Delete Gateway';
                                    break;
                                case 'addUpdateGateway':
                                    eventName = 'Add/Update Gateway';
                                    break;
                                default:
                                    eventName = element.eventName;
                                    break;
                            }
                            eventNewItem = {
                                id: element.id,
                                eventName: eventName,
                                totalCount: element.totalCount,
                                successCount: element.successCount,
                                ignoredByException: element.ignoredByException
                            }
                            this.eventList.push(eventNewItem);
                            //console.log(this.eventList);
                        });
                    }
                } catch (error) {
                    console.log("Telimetry list not exist", error);
                }

            });
    };


    getCustomDate(unixTime) {
        var u = new Date(unixTime);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return monthNames[u.getUTCMonth()] + ' ' + u.getUTCDay() + ' ' + ('0' + u.getUTCHours()).slice(-2) +
            ':' + ('0' + u.getUTCMinutes()).slice(-2);
    }

    unixTime(unixtime) {

        var u = new Date(unixtime);

        return u.getUTCFullYear() +
            '-' + ('0' + u.getUTCMonth()).slice(-2) +
            '-' + ('0' + u.getUTCDate()).slice(-2) +
            ' ' + ('0' + u.getUTCHours()).slice(-2) +
            ':' + ('0' + u.getUTCMinutes()).slice(-2) +
            ':' + ('0' + u.getUTCSeconds()).slice(-2)
    };

    generateTimer(){
        let sleepStart: number = parseInt(localStorage.getItem("timerStart"));
        let timeString = null;
        let currentTimestamp = new Date().getTime();
        let waitingTime = sleepStart  - currentTimestamp;
        if(waitingTime > 0){
            // timeString = this.timestampToString(waitingTime);
            let times = waitingTime/1000;
            let d = Math.floor(times/86400);
            let _d = (d < 10 ? '0' : '') + d;
        
            let h = Math.floor((times- d*86400)/3600);
            let _h = (h < 10 ? '0' : '') + h;
        
            let m = Math.floor((times-( d*86400+h*3600))/60);
            let _m = (m < 10 ? '0' : '')+ m;
        
            let s = parseInt((times-(d*86400+h*3600+ m*60)).toFixed(0));
            let _s = (s < 10 ? '0' : '') + s;
            if(_d == '00'){
                timeString = _h+':'+_m+':'+_s;
            } else {
                timeString = _d +':'+_h+':'+_m+':'+_s;
            }
        
            
    
        } 
        this.timerString =  timeString;
        localStorage.setItem('timerString', timeString);
        return this.timerString;
    }

    isTimerSet(){
        if (localStorage.hasOwnProperty("timerString")) {
            this.timerString = localStorage.getItem("timerString");
            return true;
        } else {
            this.timerString = "Timer is not set";
            return false;
        }
    }
}