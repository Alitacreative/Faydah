import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

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

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  async login() {
    if (this.email === 'admin@' && this.password === 'admin') {
      this.router.navigate(['/admin']);
    } else if (this.email === 'user@' && this.password === 'user') {
      this.router.navigate(['/tabs']);
    } else {
      const alert = await this.alertController.create({
        header: 'Erreur',
        message: 'Identifiant ou mot de passe incorrect.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
