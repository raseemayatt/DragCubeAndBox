import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class CommissionService {

    constructor(private router: Router,private http: HttpClient) {}

    doCommission(eslData){
        var userToken = localStorage.getItem('userCheckVal');
        const eslMappingList = [eslData];
        const body= { "authToken": userToken, "eslMappingList" : eslMappingList };
        return this.http.post(`${environment.apiUrl}/eslBulkCommissioningApi`, body);
    }

    doBulkCommission(eslData, options){
        
        return this.http.post(`${environment.apiUrl}/eslBulkCommissioningApi`, eslData, options);
    }

    getAllFailedCommission(){
        
        return this.http.get(`${environment.apiUrl}/getFailedCommissions`);
    }

    retryComm(id){
        var userToken = localStorage.getItem('userCheckVal');
        const body= { "authToken": userToken ,"key":id};
        return this.http.post(`${environment.apiUrl}/retryCommissionByTransactionId`, body);
    }

    bulkCommissionStatus(id){
        var userToken = localStorage.getItem('userCheckVal');
        const body= { "authToken": userToken ,"key":id};
        return this.http.post(`${environment.apiUrl}/commissionStatusByTransactionId`, body);
    }

    setSleepTimeout(sleepStartTime, sleepHr, sleepMin){
        var userToken = localStorage.getItem('userCheckVal');
        const body= { 
            "authToken": userToken ,
            "startHour": sleepStartTime[0],
            "startMin": sleepStartTime[1],
            "durationHour": sleepHr,
            "durationMin": sleepMin,
            "recurring": "false"
        };
        return this.http.post(`${environment.apiUrl}/setEslSleepStrategy`, body);
    }
}


