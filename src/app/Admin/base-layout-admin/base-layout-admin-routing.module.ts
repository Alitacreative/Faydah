import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseLayoutAdminPage } from './base-layout-admin.page';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutAdminPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../pages/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardPageModule)
      },
      // {
      //   path: 'utilisateurs',
      //   loadChildren: () => import('../infos/infos.module').then(m => m.InfosPageModule)
      // },
      // {
      //   path: 'cotisations',
      //   loadChildren: () => import('../bibliotheque/bibliotheque.module').then(m => m.BibliothequePageModule)
      // },
      {
        path: 'dahira',
        loadChildren: () => import('../pages/dahira/dahira.module').then( m => m.DahiraPageModule)
      },
      // {
      //   path: 'projets',
      //   loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      // },
      // {
      //   path: 'ressources',
      //   loadChildren: () => import('../finances/finances.module').then( m => m.FinancesPageModule)
      // },
      // {
      //   path: 'tourisme',
      //   loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      // },
      // {
      //   path: 'statistiques',
      //   loadChildren: () => import('../finances/finances.module').then( m => m.FinancesPageModule)
      // },
      // {
      //   path: 'demandes',
      //   loadChildren: () => import('../finances/finances.module').then( m => m.FinancesPageModule)
      // },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseLayoutAdminPageRoutingModule {}
