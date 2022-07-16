import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {

        return this.http.post<any>(`${environment.apiUrl}/doLogin` ,{"user":{"username":username,"crd":password}})
        .pipe(map(data => {
            
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('userCheckVal', data.checkVal);
                var userObj = {
                    id : data.user.id,
                    username: data.user.username,
                    password: data.user.crd,
                    firstName: data.user.name,
                    lastName: data.user.name,
                    token: data.checkVal
                 };
                userObj.id = data.user.id;
                this.userSubject.next(userObj);
                if(data["responseCode"] != 200 ){
                    return false;
                }
               
                return data.user;
            
            
        }))
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        localStorage.removeItem('userCheckVal');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }


    register(usName,usCrd,usFname) {
        var userToken = "1234";
        // const eslMappingList = [eslData];
        const body= { "authToken": userToken, "user" : {"username":usName,"crd":usCrd,"name":usFname }};
        return this.http.post(`${environment.apiUrl}/addUpdateUser`, body);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
}