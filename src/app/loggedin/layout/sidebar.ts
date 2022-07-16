import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { find } from 'rxjs/operators';

@Component({
    selector: 'sidebar-element',
    templateUrl: 'sidebar.html'
})
export class SidebarComponent {

    logoUrl: string = environment.config.logoUrl;
    sidebar: any = environment.config.sidebar;
    tabsAvailability: any = environment.config.tabs;
    appUrl: any;
    sidebarHighlightNo: any = 1;
    constructor(private router: Router) {

    }



    ngAfterContentInit() {
        /*
        * Following code will highlight the current item in menu on mouse click as well as on page reload
        */

        this.appUrl = this.router.url.replace('/', '');
        switch (this.appUrl) {
            case "dashboard": this.sidebarHighlightNo = 1; break;
            case "commission": this.sidebarHighlightNo = 2; break;
            case "decommission": this.sidebarHighlightNo = 4; break;
            case "downloads": this.sidebarHighlightNo = 5; break;
            case "priceupdates": this.sidebarHighlightNo = 3; break;
            case "gateways": this.sidebarHighlightNo = 6; break;
            case "addgateways": this.sidebarHighlightNo = 6; break;
        }
        $('#sidebar ul li:nth-child(' + this.sidebarHighlightNo + ')').removeClass('default-sidebar');
        $('#sidebar ul li:nth-child(' + this.sidebarHighlightNo + ')').addClass('highlighted-sidebar');
        // $('#sidebar ul li:nth-child('+this.sidebarHighlightNo+')').children('a').children('i').attr('class', 'fa fa-money highlighted-sidebar-fa');
        $('#sidebar ul li:nth-child(' + this.sidebarHighlightNo + ')').find($(".fa")).removeClass('default-sidebar-fa').addClass('highlighted-sidebar-fa');

        // $('#sidebar ul li:nth-child('+this.sidebarHighlightNo+') a').children('i').addClass('highlighted-sidebar-fa');
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
        });
        $('#sidebar ul li').on('click', function (e) {
            $('#sidebar ul li').addClass('default-sidebar');
            $('#sidebar ul li a .fa').addClass('default-sidebar-fa');
            $('#sidebar ul li').removeClass('highlighted-sidebar');
            $('#sidebar ul li a .fa').removeClass('highlighted-sidebar-fa');
            $(this).removeClass('default-sidebar');
            $(this).find('.fa').removeClass('default-sidebar-fa');
            $(this).addClass('highlighted-sidebar');
            $(this).find('.fa').addClass('highlighted-sidebar-fa');
        });
    }

    goToTabContent(pageName) {
        console.log(pageName);
        let tabRoute;
        switch (pageName) {
            case "dashboard": tabRoute = '/'; break;
            case "commission": tabRoute = '/commission'; break;
            case "priceupdates": tabRoute = '/priceupdates'; break;
            case "decommission": tabRoute = '/decommission'; break;
            case "downloads": tabRoute = '/downloads'; break;
            case "gateways": tabRoute = '/gateways'; break;
            case "designer": tabRoute = '/designer'; break;
        }
        this.router.navigateByUrl(tabRoute);
    }

    checkVisibility(tabVisible, tabName) {
        var userObj = JSON.parse(localStorage.getItem('user'));
        var userType = userObj.type;
        if (tabVisible) {
            if (tabName == "Gateways") {
                if (userType == 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }

}