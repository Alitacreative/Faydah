// Selectors
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from './notification.store';

export const selectNotificationState = createFeatureSelector<NotificationState>('notifications');

export const selectAllNotifications = createSelector(
  selectNotificationState,
  state => state.notifications
);

export const selectFilterType = createSelector(
  selectNotificationState,
  state => state.filterType
);

export const selectFilteredNotifications = createSelector(
  selectAllNotifications,
  selectFilterType,
  (notifications, filterType) => {
    if (filterType === 'unread') {
      return notifications.filter(notification => !notification.read);
    }
    return notifications;
  }
);

export const selectUnreadCount = createSelector(
  selectAllNotifications,
  notifications => notifications.filter(notification => !notification.read).length
);

export const selectLoading = createSelector(
  selectNotificationState,
  state => state.loading
);