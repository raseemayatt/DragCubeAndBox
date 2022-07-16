import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class DownloadService {

    constructor(private router: Router, private http: HttpClient) { }

    doDownload(): any {        
        return this.http.get(`${environment.apiUrl}/downloadAllEslData`, {responseType: 'blob'});
    }

    doDownloadReport(startDate): any {        
        return this.http.get(`${environment.apiUrl}/downloadPriceUpdateReport?startDate=`+startDate+`&endDate=`+new Date().getTime(), {responseType: 'blob'});
    }
       
}
