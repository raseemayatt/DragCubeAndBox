import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { AccountService, SearchService } from '@app/_services';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent{
    user: User;
    alertService: any;
    spinnerLoading: boolean = false;

    constructor(
        private accountService: AccountService, 
        private searchService: SearchService, 
        private router: Router,
        ) {
            this.user = this.accountService.userValue;
            this.accountService.user.subscribe(x => this.user = x);
        
    }


    
}