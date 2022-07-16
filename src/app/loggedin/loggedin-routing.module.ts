import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { SummaryComponent } from './summary/summary';
import { PriceupdatesComponent } from './price_updates/priceupdates';
import { SidebarComponent } from './layout/sidebar';
import { CommissionComponent } from './commission/commission';
import { DecommissionComponent } from './commission/decommission';
import { DownloadsComponent } from './downloads/downloads';


import { GatewaysComponent } from './gateways/gateways';
import { AddGatewaysComponent } from './gateways/addgateways';
import { DesignerComponent } from './designer/designer';
import { BatteryComponent } from './esl/battery';
import { DesignerDetailsComponent } from './designer/designer_details';
import { StorelayoutComponent } from './store_layout/storelayout';



const routes: Routes = [

    {

        path: '', component: LayoutComponent,
        children: [

            { path: 'commission', component: CommissionComponent },
            { path: 'decommission', component: DecommissionComponent },
            { path: 'downloads', component: DownloadsComponent },
            { path: 'priceupdates', component: PriceupdatesComponent },

            { path: 'gateways', component: GatewaysComponent },
            { path: 'addgateways', component: AddGatewaysComponent },
            { path: 'designer', component: DesignerComponent },
            { path: 'designer/:id', component: DesignerDetailsComponent },
            { path: 'storelayout', component: StorelayoutComponent },

            { path: 'lowbattery', component: BatteryComponent },

            { path: '', component: SummaryComponent }

        ]

    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoggedinRoutingModule { }