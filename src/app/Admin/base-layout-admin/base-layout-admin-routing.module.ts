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
      {
        path: 'utilisateurs',
        loadChildren: () => import('../pages/utilisateurs/utilisateurs.module').then(m => m.UtilisateursPageModule)
      },
      // {
      //   path: 'cotisations',
      //   loadChildren: () => import('../bibliotheque/bibliotheque.module').then(m => m.BibliothequePageModule)
      // },
      {
        path: 'dahira',
        loadChildren: () => import('../pages/dahira/dahira.module').then(m => m.DahiraPageModule)
      },
      {
        path: 'projets',
        loadChildren: () => import('../pages/projets/projets.module').then(m => m.ProjetsPageModule)
      },
      {
        path: 'ressources',
        loadChildren: () => import('../pages/ressources/ressources.module').then(m => m.RessourcesPageModule)
      },
      {
        path: 'tourisme',
        loadChildren: () => import('../pages/tourisme/tourisme.module').then(m => m.TourismePageModule)
      },
      // {
      //   path: 'statistiques',
      //   loadChildren: () => import('../finances/finances.module').then( m => m.FinancesPageModule)
      // },
      {
        path: 'demandes',
        loadChildren: () => import('../pages/demandes/demandes.module').then(m => m.DemandesPageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('../pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
      },
      {
        path: 'maps',
        loadChildren: () => import('../pages/maps/maps.module').then(m => m.MapsPageModule)
      },
      {
        path: 'logs',
        loadChildren: () => import('../pages/logs/logs.module').then(m => m.LogsPageModule)
      },
      {
        path: 'discussions',
        loadChildren: () => import('../pages/discussions/discussions.module').then(m => m.DiscussionsPageModule)
      },
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
export class BaseLayoutAdminPageRoutingModule { }
