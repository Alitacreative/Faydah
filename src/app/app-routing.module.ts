import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { GuestGuard } from './features/auth/guards/guest.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.page').then(m => m.RegisterPage),
    canActivate: [GuestGuard]
  },
  {
    path: 'tabs',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./features/tabs-layout/tabs-layout.module').then(m => m.TabsLayoutPageModule)
  },
  {
    path: 'infos/detail-infos',
    loadChildren: () => import('./features/infos/pages/detail-infos/detail-infos.module').then(m => m.DetailInfosPageModule)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage),
    canActivate: [GuestGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./Admin/base-layout-admin/base-layout-admin.module').then(m => m.BaseLayoutAdminPageModule)
  },
  {
    path: 'bibliotheque/lire-ouvrage/:id',
    loadChildren: () => import('./features/bibliotheque/pages/lire-ouvrage/lire-ouvrage.module').then(m => m.LireOuvragePageModule)
  },
  {
    path: 'bibliotheque/detail-tafsir/:id',
    loadChildren: () => import('./features/bibliotheque/pages/detail-tafsir/detail-tafsir.module').then(m => m.DetailTafsirPageModule)
  },
  {
    path: 'admin-login',
    loadChildren: () => import('./Admin/pages/admin-login/admin-login.module').then(m => m.AdminLoginPageModule)
  },
  {
    path: 'demandes',
    loadChildren: () => import('./features/demandes/demandes.module').then(m => m.DemandesPageModule)
  },
  {
    path: 'demande-dahira/:id',
    loadChildren: () => import('./features/demande-dahira/demande-dahira.module').then( m => m.DemandeDahiraPageModule)
  },
  {
    path: 'dahiras/create',
    loadChildren: () => import('./features/dahiras/pages/create-dahira/create-dahira.module').then( m => m.CreateDahiraPageModule)
  },
    {
    path: 'finances/create-collect',
    loadChildren: () => import('./features/finances/pages/create-collect/create-collect.module').then( m => m.CreateCollectPageModule)
  },
  {
    path: 'disciples',
    loadChildren: () => import('./features/disciples/disciples.module').then( m => m.DisciplesPageModule)
  },
  {
    path: 'mydahira/:id',
    loadChildren: () => import('./features/my-dahira/my-dahira.module').then( m => m.MyDahiraPageModule)
  },
  {
    path: 'mycollecte',
    loadChildren: () => import('./features/my-collecte/my-collecte.module').then( m => m.MyCollectePageModule)
  },
  {
    path: 'mymoukhadam/:id',
    loadChildren: () => import('./features/my-moukhadam/my-moukhadam.module').then( m => m.MyMoukhadamPageModule)
  },  {
    path: 'tourisme',
    loadChildren: () => import('./features/tourisme/tourisme.module').then( m => m.TourismePageModule)
  },



  // Route fallback si aucune correspondance
  // {
  //   path: '**',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
