import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AccountService } from './account.service';
 
@Injectable()
export class HttpResponseInterceptorService implements HttpInterceptor {
    constructor( 
        
        private accountService: AccountService){}
   intercept(req: HttpRequest<any>, next: HttpHandler):   Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        tap(evt => {
            if (evt instanceof HttpResponse) {
                if(evt.body){
                    console.log(evt.body.responseCode);
                    //checkVal, responseCode
                    if(evt.body.responseCode == 401){
                        this.accountService.logout();
                    } else {
                        if (typeof evt.body.checkVal !== 'undefined')
                            localStorage.setItem('userCheckVal', evt.body.checkVal);
                    }
                }              
            }
        }),
        catchError((err: any) => {
            if(err instanceof HttpErrorResponse) {
                console.log(err);
            }
            return of(err);
        }));
    
  }
}