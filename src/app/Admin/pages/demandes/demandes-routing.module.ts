import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemandesPage } from './demandes.page';

const routes: Routes = [
  {
    path: '',
    component: DemandesPage
  },
  {
    path: 'demande/:id',
    loadChildren: () => import('../../../Admin/pages/demandes/pages/detail-demande/detail-demande.module').then( m => m.DetailDemandePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemandesPageRoutingModule {}
