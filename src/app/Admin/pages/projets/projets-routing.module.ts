import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjetsPage } from './projets.page';
import { DetailProjetComponent } from './components/detail-projet/detail-projet.component';

const routes: Routes = [
  {
    path: '',
    component: ProjetsPage
  },
  {
    path: 'detail/:id',
    component: DetailProjetComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjetsPageRoutingModule {}
