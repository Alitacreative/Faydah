import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdminDashboardPageRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardPage } from './admin-dashboard.page';
import { NgApexchartsModule } from 'ng-apexcharts';

// ✅ Import correct du composant standalone
import { StatCardsComponent } from './components/stat-cards/stat-cards.component';

@NgModule({
  declarations: [
    AdminDashboardPage
    // ❌ Ne pas déclarer StatCardsComponent ici car il est standalone
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminDashboardPageRoutingModule,
    NgApexchartsModule,
    StatCardsComponent // ✅ importer ici
  ]
})
export class AdminDashboardPageModule {}
