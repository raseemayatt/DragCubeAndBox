import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class HelperService {

    constructor(private router: Router, private http: HttpClient) { }

    isAlphaNumericKey(evt) {
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode >= 65 && charCode <= 90) || (charCode >= 95 && charCode <= 122)) {
            return true;
        }
        else if (charCode >= 48 && charCode <= 57) {
            return true;
        }
        else if (charCode == 32) {
            return true;
        }
        else {
            return false;
        }
    }
    isNumericKey(evt) {
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode >= 48 && charCode <= 57) {
            return true;
        }
        else if (charCode == 46) {
            return true;
        }
        else {
            return false;
        }
    }

    isNumericKey1(evt) {
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode >= 48 && charCode <= 57) {
            return true;
        }
        else if (charCode == 47) {
            return true;
        }
        else {
            return false;
        }
    }

}