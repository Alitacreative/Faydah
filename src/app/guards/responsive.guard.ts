import { Injectable, inject } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { DeviceService } from "../services/device.service";

@Injectable({
  providedIn: 'root'
})
export class ResponsiveGuard implements CanActivate {
  private deviceService = inject(DeviceService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedDevices = route.data['allowedDevices'] as string[] || ['desktop', 'tablet', 'mobile'];
    const redirectUrl = route.data['redirectUrl'] as string;
    const currentDevice = this.getCurrentDeviceType();
    
    if (allowedDevices.includes(currentDevice)) {
      return true;
    }
    
    if (redirectUrl) {
      this.router.navigate([redirectUrl]);
    } else {
      this.router.navigate(['/device-not-supported'], {
        queryParams: { 
          device: currentDevice,
          allowed: allowedDevices.join(',')
        }
      });
    }
    
    return false;
  }

  private getCurrentDeviceType(): string {
    const deviceInfo = this.deviceService.getCurrentDeviceInfo();
    if (deviceInfo.isMobile) return 'mobile';
    if (deviceInfo.isTablet) return 'tablet';
    return 'desktop';
  }
}