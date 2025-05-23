export interface Notification {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    message: string;
    timestamp: Date;
    read: boolean;
    type: NotificationType;
  }
  
  export enum NotificationType {
    REQUEST = 'request',
    STATUS_UPDATE = 'status_update'
  }