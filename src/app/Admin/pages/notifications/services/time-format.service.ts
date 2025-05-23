// Utils pour formatter les dates de notification
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeFormatService {
    constructor() {}

    formatTimeAgo(date: Date): string {
      try {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        // Moins d'une minute
        if (diff < 60 * 1000) {
          return 'à l\'instant';
        }
        
        // Minutes
        const minutes = Math.floor(diff / (60 * 1000));
        if (minutes < 60) {
          return `${minutes}min`;
        }
        
        // Heures
        const hours = Math.floor(diff / (60 * 60 * 1000));
        if (hours < 24) {
          return `${hours}h`;
        }
        
        // Hier
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (date.getDate() === yesterday.getDate() && 
            date.getMonth() === yesterday.getMonth() && 
            date.getFullYear() === yesterday.getFullYear()) {
          return 'Hier';
        }
        
        // Jours
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        if (days < 7) {
          return `${days}j`;
        }
        
        // Date formatée
        return this.formatDate(date);
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Date inconnue';
      }
    }
    
    private formatDate(date: Date): string {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }