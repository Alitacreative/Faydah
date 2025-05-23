import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

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
    private store: Store<AppState>
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })

    // Récupérer l'URL de retour des paramètres de requête ou définir la valeur par défaut
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "admin/dashboard"

    // Rediriger si déjà connecté
    // if (this.authService.isLoggedIn()) {
    //   const redirectUrl = this.authService.isAdmin()
    //     ? '/admin/dashboard'
    //     : '/home';
    //   this.router.navigate([redirectUrl]);
    // }
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true
      this.loginError = ""

      const { email, password } = this.loginForm.value

      // this.authService.login(email, password).pipe(finalize(() => this.isLoading = false)).subscribe({
      //   next: (result) => {
      //     if (result.success) {
      //       // Redirection différente selon le type d'utilisateur
      //       const redirectUrl = result.isAdmin ? 'admin/dashboard' : 'tabs/home';
      //       this.router.navigate([redirectUrl]);
      //     } else {
      //       this.loginError = "Identifiant ou mot de passe incorrect";
      //     }
      //   },
      //   error: (error) => {
      //     console.error("Erreur de connexion", error);
      //     this.loginError = "Une erreur est survenue lors de la connexion";
      //   }
      // });
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

  goToRegister() {
    this.router.navigate(['/register']);
  }
}