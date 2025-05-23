import { Component, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';




export interface LoginResponse {
  status: string;
  statusCodeValue: number;
  message: string;
  data: {
    scope: string;
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    'not-before-policy': number;
    session_state: string;
  };
}
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  reponse: string="";
  private http = inject(HttpClient);
  constructor(
    private router: Router,
    private alertController: AlertController,
    public auth: AuthService
  ) {
    
  }
 async login(): Promise<LoginResponse> {
  try {
    const response = await this.http.post<LoginResponse>(
      "http://89.47.51.6:8787/api/v1/auth/login",
      {
        "username": this.email,
        "password": this.password
      }
    ).toPromise();
    // Vérifier si la réponse existe
    if (response) {
      console.log('Réponse de connexion:', response);
      // Traitement de la réponse réussie
      if (response.status === 'Success' && response.data) {
        // Stocker le token d'accès
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        // Optionnel: stocker d'autres informations
        localStorage.setItem('token_type', response.data.token_type);
        localStorage.setItem('expires_in', response.data.expires_in.toString());
        console.log('Connexion réussie!');
        console.log(localStorage.getItem('access_token'))
        return response;
      } else {
        console.error('Erreur de connexion:', response.message);
        throw new Error(response.message || 'Erreur de connexion');
      }
    } else {
      throw new Error('Aucune réponse reçue du serveur');
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
}


  // async login() {
  //   this.http.post("http://89.47.51.6:8787/api/v1/auth/login",{
  //     "username": this.email,
  //     "password": this.password
  //     },
  //   ).subscribe((data)=>{
  //         console.log(data)
  //   });
    // if (this.email === 'admin@' && this.password === 'admin') {
    //   this.router.navigate(['/admin']);
    // } else if (this.email === 'user@' && this.password === 'user') {
    //   this.router.navigate(['/tabs']);
    // } else {
    //   const alert = await this.alertController.create({
    //     header: 'Erreur',
    //     message: 'Identifiant ou mot de passe incorrect.',
    //     buttons: ['OK'],
    //   });
    //   await alert.present();
    // }
  //}

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
