import { Injectable, inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { DeviceService } from "../services/device.service";

@Injectable({
  providedIn: 'root'
})
export class MobileOnlyGuard implements CanActivate {
  private deviceService = inject(DeviceService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.deviceService.isMobile()) {
      return true;
    }
    
    this.router.navigate(['/desktop-version']);
    return false;
  }
}