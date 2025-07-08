import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TourismePage } from './tourisme.page';

const routes: Routes = [
  {
    path: '',
    component: TourismePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TourismePageRoutingModule {}
