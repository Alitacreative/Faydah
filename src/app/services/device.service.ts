import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  platform: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private deviceInfoSubject = new BehaviorSubject<DeviceInfo>(this.getDeviceInfo());
  public deviceInfo$ = this.deviceInfoSubject.asObservable();

  constructor(private platform: Platform) {
    // Écouter les changements de taille d'écran
    window.addEventListener('resize', () => {
      this.deviceInfoSubject.next(this.getDeviceInfo());
    });
  }

  private getDeviceInfo(): DeviceInfo {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      isMobile: this.platform.is('mobile') || width < 768,
      isTablet: this.platform.is('tablet') || (width >= 768 && width < 1024),
      isDesktop: this.platform.is('desktop') || width >= 1024,
      screenWidth: width,
      screenHeight: height,
      platform: this.getPlatformName()
    };
  }

  private getPlatformName(): string {
    if (this.platform.is('ios')) return 'iOS';
    if (this.platform.is('android')) return 'Android';
    if (this.platform.is('desktop')) return 'Desktop';
    return 'Unknown';
  }

  getCurrentDeviceInfo(): DeviceInfo {
    return this.deviceInfoSubject.value;
  }

  isMobile(): boolean {
    return this.getCurrentDeviceInfo().isMobile;
  }

  isTablet(): boolean {
    return this.getCurrentDeviceInfo().isTablet;
  }

  isDesktop(): boolean {
    return this.getCurrentDeviceInfo().isDesktop;
  }
}