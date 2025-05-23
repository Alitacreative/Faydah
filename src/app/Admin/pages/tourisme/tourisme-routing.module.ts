import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TourismePage } from './tourisme.page';

const routes: Routes = [
  {
    path: '',
    component: TourismePage
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('../../../Admin/pages/tourisme/pages/event-detail/event-detail.module').then( m => m.EventDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TourismePageRoutingModule {}
