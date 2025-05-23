/**
* @author Dr_EPL
* @summary "dolnickenzanza@gmail.com"
* @copyright 2025
*/

import { provideAppInitializer, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { axiosInitializer } from './store/axios-initializer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    FormsModule,
    StoreModule.forRoot({ auth: authReducer }),
    IonicStorageModule.forRoot(),
    EffectsModule.forRoot([AuthEffects]),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAppInitializer(axiosInitializer()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}