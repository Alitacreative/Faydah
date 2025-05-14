import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailDemandePage } from './detail-demande.page';

const routes: Routes = [
  {
    path: '',
    component: DetailDemandePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailDemandePageRoutingModule {}
