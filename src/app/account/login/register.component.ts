import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { AlertService } from '../../alert/alert.service';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }


        this.loading = true;
        console.log(this.form.value);
        this.accountService.register(this.form.value.username, this.form.value.password, this.form.value.firstName)
            .pipe(first())
            .subscribe(
                data => {
                    if (data['responseCode'] == 200) {
                        console.log("Register");
                        this.router.navigate(['../login'], { relativeTo: this.route });
                        this.alertService.success('Registration successful', { autoClose: true });
                    }
                    else {
                        this.alertService.error('User Already Exists');
                        this.loading = false;
                    }
                }
        
            );
    }
}