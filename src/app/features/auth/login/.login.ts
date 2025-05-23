import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, ReactiveFormsModule],
})
export class LoginPage {
  loginForm: FormGroup
  hidePassword = true
  loginError = ""
  isLoading = false
  returnUrl: string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })

    // Récupérer l'URL de retour des paramètres de requête ou définir la valeur par défaut
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/dashboard"

    // Rediriger si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl])
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.loginError = ""

      const { username, password } = this.loginForm.value

      this.authService
        .login(username, password)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (success) => {
            if (success) {
              this.router.navigate([this.returnUrl])
            } else {
              this.loginError = "Identifiant ou mot de passe incorrect"
            }
          },
          error: (error) => {
            console.error("Erreur de connexion", error)
            this.loginError = "Une erreur est survenue lors de la connexion"
          },
        })
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key)
        control?.markAsTouched()
      })
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword
  }

  forgotPassword() {
    alert("Fonctionnalité de récupération de mot de passe à implémenter")
  }
}










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
    // if (this.router.url !== '/logs')
      console.log(this.router.url);
      
  }
}
