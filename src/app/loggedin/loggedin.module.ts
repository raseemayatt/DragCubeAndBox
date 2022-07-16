import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertModule  } from '../alert/alert.module'

import { LoggedinRoutingModule } from './loggedin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SummaryComponent } from './summary/summary';
import { PriceupdatesComponent } from './price_updates/priceupdates';
import { SidebarComponent } from './layout/sidebar';
import { CommissionComponent } from './commission/commission';
import { TopbarComponent } from './layout/topbar'
import { DownloadsComponent } from './downloads/downloads';
import { GatewaysComponent } from './gateways/gateways';
import { DecommissionComponent } from './commission/decommission';
import { AddGatewaysComponent } from './gateways/addgateways';
import { ConfirmationDialogComponent } from '@app/_components/confirm-popup/popup.component';
import { ConfirmationDialogService } from '@app/_components/confirm-popup/popup.service';
import {DpDatePickerModule} from 'ng2-date-picker';
import { DesignerComponent } from './designer/designer';
import { BatteryComponent } from './esl/battery';
import { DesignerDetailsComponent } from './designer/designer_details';
import { StorelayoutComponent } from './store_layout/storelayout';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LoggedinRoutingModule,
        AlertModule,
        DpDatePickerModule
    ],
    declarations: [
        LayoutComponent,
        SummaryComponent,
        PriceupdatesComponent,
        SidebarComponent,
        TopbarComponent,
        DecommissionComponent,
        CommissionComponent,
        DownloadsComponent,
        GatewaysComponent,
        AddGatewaysComponent,
        ConfirmationDialogComponent,
        DesignerComponent,
        BatteryComponent,
        StorelayoutComponent,
        DesignerDetailsComponent
    ],
    providers: [ ConfirmationDialogService ],
    
  entryComponents: [ ConfirmationDialogComponent ]
})
export class UsersModule { }