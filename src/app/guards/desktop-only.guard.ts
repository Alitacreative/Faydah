import { Injectable, inject } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { DeviceService } from "../services/device.service";

@Injectable({
  providedIn: 'root'
})
export class DesktopOnlyGuard implements CanActivate {
  private deviceService = inject(DeviceService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.deviceService.isDesktop()) {
      return true;
    }
    
    // Rediriger vers une page mobile-friendly
    this.router.navigate(['/mobile-not-supported'], {
      queryParams: { requestedUrl: state.url }
    });
    return false;
  }
}