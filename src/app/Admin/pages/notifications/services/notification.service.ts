// Service pour les notifications
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Notification, NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Ali SENE',
      userAvatar: 'assets/images/1.png',
      message: 'demande à devenir Moukhdam',
      timestamp: new Date(Date.now() - 30 * 60000), // 30min ago
      read: false,
      type: NotificationType.REQUEST
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Marie Jeanne BADIAN',
      userAvatar: 'assets/images/1.png',
      message: 'demande à devenir disciple',
      timestamp: new Date(Date.now() - 60 * 60000), // 1h ago
      read: false,
      type: NotificationType.REQUEST
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Thomas Yuan',
      userAvatar: 'assets/images/1.png',
      message: 'demande à créer une Dahira',
      timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2h ago
      read: false,
      type: NotificationType.REQUEST
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Mouhamed Ali',
      userAvatar: 'assets/images/1.png',
      message: 'demande à créer un projet de collecte de fonds',
      timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      read: false,
      type: NotificationType.REQUEST
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'Rose-Danielle MBAYE',
      userAvatar: 'assets/images/1.png',
      message: 'a mis en pause la collecte des fonds du projet',
      timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      read: false,
      type: NotificationType.STATUS_UPDATE
    },
    {
      id: '6',
      userId: 'user4',
      userName: 'Mouhamed Ali',
      userAvatar: 'assets/images/1.png',
      message: 'demande à créer un projet de collecte de fonds',
      timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      read: true,
      type: NotificationType.REQUEST
    },
    {
      id: '7',
      userId: 'user5',
      userName: 'Rose-Danielle MBAYE',
      userAvatar: 'assets/images/1.png',
      message: 'a mis en pause la collecte des fonds du projet',
      timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      read: true,
      type: NotificationType.STATUS_UPDATE
    }
  ];

  private notificationsSubject = new BehaviorSubject<Notification[]>([...this.notifications]);

  constructor() { }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  getUnreadCount(): Observable<number> {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    return of(unreadCount);
  }

  markAsRead(id: string): Observable<boolean> {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      // Créer une nouvelle copie de l'objet notification au lieu de modifier l'original
      const updatedNotification = { ...this.notifications[index], read: true };
      // Créer un nouveau tableau avec la notification mise à jour
      this.notifications = [
        ...this.notifications.slice(0, index),
        updatedNotification,
        ...this.notifications.slice(index + 1)
      ];
      this.notificationsSubject.next([...this.notifications]);
      return of(true).pipe(delay(300));
    }
    return of(false);
  }

  markAllAsRead(): Observable<boolean> {
    // Créer un nouveau tableau de notifications avec toutes les notifications marquées comme lues
    this.notifications = this.notifications.map(notification => ({
      ...notification,
      read: true
    }));
    this.notificationsSubject.next([...this.notifications]);
    return of(true).pipe(delay(300));
  }
}