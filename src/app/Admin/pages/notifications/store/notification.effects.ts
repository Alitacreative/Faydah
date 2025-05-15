// Effects
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as NotificationActions from './notification.store';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class NotificationEffects {
  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.loadNotifications),
      switchMap(() =>
        this.notificationService.getNotifications().pipe(
          map(notifications => NotificationActions.loadNotificationsSuccess({ notifications })),
          catchError(() => of({ type: '[Notification] Load Notifications Error' }))
        )
      )
    )
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markAsRead),
      switchMap(({ id }) =>
        this.notificationService.markAsRead(id).pipe(
          map(() => NotificationActions.markAsReadSuccess({ id })),
          catchError(() => of({ type: '[Notification] Mark As Read Error' }))
        )
      )
    )
  );

  markAllAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationActions.markAllAsRead),
      switchMap(() =>
        this.notificationService.markAllAsRead().pipe(
          map(() => NotificationActions.markAllAsReadSuccess()),
          catchError(() => of({ type: '[Notification] Mark All As Read Error' }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private notificationService: NotificationService
  ) {}
}