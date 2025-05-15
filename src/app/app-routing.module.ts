import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './features/auth/login/login.page';
import { RegisterPage } from './features/auth/register/register.page';  // Importer le composant autonome RegisterPage

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
    component: RegisterPage
  },
  {
    path: 'tabs',
    loadChildren: () => import('./features/tabs-layout/tabs-layout.module').then(m => m.TabsLayoutPageModule)
  },
  {
    path: 'infos/detail-infos',
    loadChildren: () => import('./features/infos/pages/detail-infos/detail-infos.module').then(m => m.DetailInfosPageModule)
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'admin',
    loadChildren: () => import('./Admin/base-layout-admin/base-layout-admin.module').then( m => m.BaseLayoutAdminPageModule)
  },
  {
    path: 'bibliotheque/lire-ouvrage/:id',
    loadChildren: () => import('./features/bibliotheque/pages/lire-ouvrage/lire-ouvrage.module').then( m => m.LireOuvragePageModule)
  },
  {
    path: 'bibliotheque/detail-tafsir/:id',
    loadChildren: () => import('./features/bibliotheque/pages/detail-tafsir/detail-tafsir.module').then( m => m.DetailTafsirPageModule)
  },   {
    path: 'base-layout-admin',
    loadChildren: () => import('./Admin/base-layout-admin/base-layout-admin.module').then( m => m.BaseLayoutAdminPageModule)
  }

 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
