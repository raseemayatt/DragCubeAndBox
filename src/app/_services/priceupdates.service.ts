import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';


@Injectable({ providedIn: 'root' })
export class PriceUpdatesService {

    constructor(private router: Router, private http: HttpClient) { }

    doPriceupdate(priceData) {
        var userToken = localStorage.getItem('userCheckVal');
        const productInfoVO = priceData;
        const body = { "authToken": userToken, "productInfoVO": productInfoVO };
        return this.http.post(`${environment.apiUrl}/priceUpdate`, body);

    }

    priceUpdatePreview(previewData) {
        var userToken = localStorage.getItem('userCheckVal');
        let eslId = '';
        const body = { "authToken": userToken, "eslId": eslId, "productInfoVO": previewData };
        return this.http.post(`${environment.apiUrl}/getEslImageData`, body);

    }

    doPriceretry(retrysku: string) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": retrysku };
        return this.http.post(`${environment.apiUrl}/retryPriceBySku`, body);


    }

    doPricerefresh(refreshsku: string) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": refreshsku };
        return this.http.post(`${environment.apiUrl}/refreshPriceBySku`, body);


    }

    bulkPriceupdateStatus(id) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": id };
        return this.http.post(`${environment.apiUrl}/bulkPriceUpdateStatus`, body);
    }

    doretryPriceupdateByTransaction(transacId: string) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": transacId };
        return this.http.post(`${environment.apiUrl}/retryPriceupdateByTransaction`, body);
    }

    doCheckSKU(prodUPC: string) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": prodUPC };
        return this.http.post(`${environment.apiUrl}/checkIsCommissionedByProductSKU`, body);
    }

    doPreviewPDF(previewPDFdata,pdfTypeId) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "productInfoVO": previewPDFdata, "priceLabelTemplateId": pdfTypeId };
        return this.http.post(`${environment.apiUrl}/createPDF`, body, {responseType: 'blob'});
    }

    getTemplateById() {
        var userToken = localStorage.getItem('userCheckVal');
        let id = 3;
        const body = { "authToken": userToken, "key": id };
        return this.http.post(`${environment.apiUrl}/getPriceLabelTempatesByType`, body);
    }


    getAllUnits() {
        return this.http.get(`${environment.apiUrl}/productUnits`);
    }
}













function checkIsCommissionedByProductSKU(checkSKU: any) {
    throw new Error('Function not implemented.');
}

