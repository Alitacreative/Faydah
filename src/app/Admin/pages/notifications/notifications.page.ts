import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TimeFormatService } from './services/time-format.service';
import * as NotificationActions from './store/notification.store';
import * as NotificationSelectors from './store/notification.selectors';
import { Notification } from './models/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false
})
export class NotificationsPage implements OnInit {

  filteredNotifications$: Observable<Notification[]>;
  unreadCount$: Observable<number>;
  currentFilter$: Observable<'all' | 'unread'>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    private timeFormatService: TimeFormatService
  ) {
    this.filteredNotifications$ = this.store.select(NotificationSelectors.selectFilteredNotifications);
    this.unreadCount$ = this.store.select(NotificationSelectors.selectUnreadCount);
    this.currentFilter$ = this.store.select(NotificationSelectors.selectFilterType);
    this.loading$ = this.store.select(NotificationSelectors.selectLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(NotificationActions.loadNotifications());
  }

  markAsRead(id: string): void {
    this.store.dispatch(NotificationActions.markAsRead({ id }));
  }

  markAllAsRead(): void {
    this.store.dispatch(NotificationActions.markAllAsRead());
  }

  setFilter(filterType: 'all' | 'unread'): void {
    this.store.dispatch(NotificationActions.filterNotifications({ filterType }));
  }

  formatTimeAgo(timestamp: Date | string): string {
    // S'assurer que nous avons un objet Date
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return this.timeFormatService.formatTimeAgo(date);
  }
}
