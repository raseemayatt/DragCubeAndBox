import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class DeCommissionService {

    constructor(private router: Router, private http: HttpClient) { }

    doDeCommission(skuList) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "skuList": skuList };
        return this.http.post(`${environment.apiUrl}/decommissionBySkuList`, body);
    }

    doDeCommissionByESL(id) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": id };
        return this.http.post(`${environment.apiUrl}/decommissionByEslId`, body);
    }
    getAllFailedDeCommission() {
        return this.http.get(`${environment.apiUrl}/getFailedDecommissions`);
    }
    retryDeComm(id) {
        var userToken = localStorage.getItem('userCheckVal');
        const skuList = [id];
        const body = { "authToken": userToken, "skuList": skuList };
        return this.http.post(`${environment.apiUrl}/retryDecommissionBySkuList`, body);
    }
    bulkDeCommissionStatus(id) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": id };
        return this.http.post(`${environment.apiUrl}/decommissionStatusByTransactionId`, body);
    }

    retryDeCommByTxnId(id){
        var userToken = localStorage.getItem('userCheckVal');
        const body= { "authToken": userToken ,"key":id};
        return this.http.post(`${environment.apiUrl}/retryDecommissionByTransactionId`, body);
    }

    doCheckSKU(prodSKU){
        var userToken = localStorage.getItem('userCheckVal');
        const body= { "authToken": userToken ,"key":prodSKU};
        return this.http.post(`${environment.apiUrl}/checkIsCommissionedByProductSKU`, body);
    }
}
