import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {

    constructor(private router: Router,private http: HttpClient) {}

    doSearch(searchInput){
        var userToken = localStorage.getItem('userCheckVal');
        
        const body= { "authToken": userToken, "key" : searchInput };
        return this.http.post(`${environment.apiUrl}/getEslByEslId`, body);
    }

    getProductInfo(productId){
        
        var userToken = localStorage.getItem('userCheckVal');
        
        const body= { "authToken": userToken, "key" : productId };
        return this.http.post(`${environment.apiUrl}/getProductInfoByUpc`, body);
    }
}