import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResourcesPage } from './resources.page';

const routes: Routes = [
  {
    path: '',
    component: ResourcesPage
  },

  {
    path: 'resource/:id',
    loadChildren: () => import('../../../Admin/pages/resources/pages/resource-detail/resource-detail.module').then(m => m.ResourceDetailPageModule)
  },
 
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourcesPageRoutingModule {}
