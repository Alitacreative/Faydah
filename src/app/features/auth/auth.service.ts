import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';


// export const authConfig: AuthConfig = {
//   issuer: 'http://89.47.51.6:8081/admin/master/realms', // URL de ton realm
//   redirectUri: window.location.origin,
//   clientId: 'master-realm', // identique à ce qui est défini dans Keycloak
//   responseType: 'code',
//   scope: 'openid profile email',
//   showDebugInformation: true,
//   requireHttps: false,
// };
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private OAuthService: OAuthService) { 
       //this.OAuthService.configure(authConfig);
    }
    login() {
      this.OAuthService.initCodeFlow();
    }
}
