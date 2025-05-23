import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotificationsPageRoutingModule } from './notifications-routing.module';
import { NotificationsPage } from './notifications.page';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NotificationEffects } from './store/notification.effects';
import { notificationReducer } from './store/notification.store';
import { TimeFormatService } from './services/time-format.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsPageRoutingModule,
    StoreModule.forFeature('notifications', notificationReducer),
    EffectsModule.forFeature([NotificationEffects])
  ],
  providers: [
    TimeFormatService
  ],
  declarations: [NotificationsPage]
})
export class NotificationsPageModule {}
