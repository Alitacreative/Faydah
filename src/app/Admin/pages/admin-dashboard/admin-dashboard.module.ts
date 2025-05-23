import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AdminDashboardPageRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardPage } from './admin-dashboard.page';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StatCardsComponent } from "./components/stat-cards/stat-cards.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminDashboardPageRoutingModule,
    NgApexchartsModule,
    StatCardsComponent
],
  declarations: [AdminDashboardPage], // Déclarez le composant ici
})
export class AdminDashboardPageModule {}