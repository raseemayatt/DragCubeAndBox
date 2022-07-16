import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class EslService {

    constructor(private router: Router, private http: HttpClient) { }

    getAllLowBatteryCount() {

        return this.http.get(`${environment.apiUrl}/lowbatteryEslList`);
    }

    getAllPriceLabelFields() {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken };
        return this.http.post(`${environment.apiUrl}/priceLabelFields`, body);
    }

    getAllPriceLabelTempates() {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken };
        return this.http.post(`${environment.apiUrl}/getAllPriceLabelTempates`, body);
    }

    removeLabelTempates(id) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": id };
        return this.http.post(`${environment.apiUrl}/removePriceLabelTempateById`, body);
    }

    getPriceLabelTempatesbyId(id) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": id };
        return this.http.post(`${environment.apiUrl}/getPriceLabelTempateById`, body);
    }

    getPriceLabelTempatesbyName(name) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": name };
        return this.http.post(`${environment.apiUrl}/getPriceLabelTempateByName`, body);
    }

    getPriceLabelTempatesbyType() {
        var userToken = localStorage.getItem('userCheckVal');
        const typeId = "3";
        const body = { "authToken": userToken, "key": typeId };
        return this.http.post(`${environment.apiUrl}/getPriceLabelTempateByType`, body);
    }

    setActiveLabelTemplateById(id) {
        var userToken = localStorage.getItem('userCheckVal');
        const body = { "authToken": userToken, "key": id };
        return this.http.post(`${environment.apiUrl}/setActiveByPriceLabelTemplateById`, body);
    }

    getAllPriceLabelTypes(){
        return this.http.get(`${environment.apiUrl}/getAllPriceTemplateTypes`);
    }

    eslDesignPreview(productInfoVO, labelContainer) {
        var userToken = localStorage.getItem('userCheckVal');
        let eslId = '';
        const body = {
            "authToken": userToken,
            "productInfoVO": productInfoVO,
            "labelContainer": labelContainer
        };
        return this.http.post(`${environment.apiUrl}/priviewPriceLabelTempate`, body, { responseType: 'blob' });

    }

    saveUpdatePriceLabelTempate(paperType, templateName, labelContainer, templateType, activate, newTemplateId) {
        var userToken = localStorage.getItem('userCheckVal');
        let eslId = '';

        let body = {
        };
        if (newTemplateId) {
            body = {
                "authToken": userToken,
                "priceLabelTemplateVO": {
                    "paperType": paperType,
                    "templateName": templateName,
                    "id": newTemplateId,
                    "templateJson": labelContainer,
                    "type": templateType,
                    "active": activate
                }
            };
        }
        else {
            body = {
                "authToken": userToken,
                "priceLabelTemplateVO": {
                    "paperType": paperType,
                    "templateName": templateName,
                    "templateJson": labelContainer,
                    "type": templateType,
                    "active": activate
                }
            };

        }

        return this.http.post(`${environment.apiUrl}/saveUpdatePriceLabelTempate`, body);

    }
}