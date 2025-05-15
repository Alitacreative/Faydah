
// NgRx State, Actions, Reducer
import { createReducer, on, createAction, props } from '@ngrx/store';
import { Notification } from '../models/notification.model';

// Actions
export const loadNotifications = createAction('[Notification] Load Notifications');
export const loadNotificationsSuccess = createAction(
  '[Notification] Load Notifications Success',
  props<{ notifications: Notification[] }>()
);
export const markAsRead = createAction(
  '[Notification] Mark As Read',
  props<{ id: string }>()
);
export const markAsReadSuccess = createAction(
  '[Notification] Mark As Read Success',
  props<{ id: string }>()
);
export const markAllAsRead = createAction('[Notification] Mark All As Read');
export const markAllAsReadSuccess = createAction('[Notification] Mark All As Read Success');
export const filterNotifications = createAction(
  '[Notification] Filter Notifications',
  props<{ filterType: 'all' | 'unread' }>()
);

// State
export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  filterType: 'all' | 'unread';
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  filterType: 'all'
};

// Reducer
export const notificationReducer = createReducer(
  initialState,
  on(loadNotifications, state => ({ ...state, loading: true })),
  on(loadNotificationsSuccess, (state, { notifications }) => ({
    ...state,
    notifications: [...notifications],
    loading: false
  })),
  on(markAsRead, state => ({ ...state, loading: true })),
  on(markAsReadSuccess, (state, { id }) => {
    const updatedNotifications = state.notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : { ...notification }
    );
    return { ...state, notifications: updatedNotifications, loading: false };
  }),
  on(markAllAsRead, state => ({ ...state, loading: true })),
  on(markAllAsReadSuccess, state => {
    const updatedNotifications = state.notifications.map(notification => ({
      ...notification,
      read: true
    }));
    return { ...state, notifications: updatedNotifications, loading: false };
  }),
  on(filterNotifications, (state, { filterType }) => ({
    ...state,
    filterType
  }))
);