import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DahiraPage } from './dahira.page';
import { DahiraDetailsComponent } from './components/dahira-details/dahira-details.component';

const routes: Routes = [
  {
    path: '',
    component: DahiraPage
  },
  {
    path: 'detail/:id',
    component: DahiraDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DahiraPageRoutingModule {}
