import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { param } from 'jquery';

@Injectable({ providedIn: 'root' })
export class GatewayService {

    constructor(private router: Router,private http: HttpClient) {}

    getAllGateways(){
        var userToken = localStorage.getItem('userCheckVal');
        const body= { "authToken": userToken };
        return this.http.post(`${environment.apiUrl}/getAllGateways`, body);
    }

    deleteGateway(id: string){
        var userToken = localStorage.getItem('userCheckVal');
        const body= { "authToken": userToken ,"key":id};
        return this.http.post(`${environment.apiUrl}/deleteGateway`, body);
    }
    
    addUpdateGateway(gateData){   
        var userToken = localStorage.getItem('userCheckVal');
        const id = gateData.id;
        const gid = gateData.gwId;
        const name = gateData.gwName;
        const det = gateData.details;
        const act = gateData.active;
        const body = { "authToken": userToken , "id":id, "gwId":gid, "gwName":name, "details":det, "active":act};
        return this.http.post(`${environment.apiUrl}/addUpdateGateway`,body);
    }   

   

   
}