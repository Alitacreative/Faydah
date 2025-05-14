import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DahiraPage } from './dahira.page';

const routes: Routes = [
  {
    path: '',
    component: DahiraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DahiraPageRoutingModule {}
