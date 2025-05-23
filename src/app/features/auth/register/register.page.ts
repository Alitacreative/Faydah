import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
})
export class RegisterPage {
  private destroyRef = inject(DestroyRef);
  maxDate = new Date().toISOString();
  registerForm: FormGroup;
  selectedGender: string = 'male';
  showPassword = false;
  registerError = "";
  isLoading = false;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.registerForm = this.createForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'login';

    this.store.select(state => state.auth).subscribe(authState => {
      this.isLoading = authState.loading;
      this.registerError = authState.error ?? '';
      if (authState.user) {
        this.router.navigate(['/login']);
      }
    });

    // this.store.select(selectAuthState)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe(authState => {
    //     this.isLoading = authState.loading;
    //     this.registerError = authState.error ?? '';
    //     if (authState.user) {
    //       this.router.navigate(['/login']);
    //     }
    //   });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['Epl', Validators.required],
      lastName: ['EPL', Validators.required],
      email: ['dr@epl', [Validators.required, Validators.email]],
      username: ['Epl', [Validators.required, Validators.minLength(3)]],
      password: ['password', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['12345678', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{8,20}$/)]],
      gender: ['male', Validators.required],
      dateOfBirth: ['1990-01-01', Validators.required],
      nationality: ['American', Validators.required],
      country: ['USA', Validators.required],
      region: ['California', Validators.required],
      department: ['Engineering'],
      address: ['123 Main St']
    });
  }

  // register() {
  //   if (this.registerForm.valid) {
  //     this.isLoading = true;
  //     this.registerError = "";

  //     const formData = this.prepareFormData();

  //     this.authService.register(formData)
  //       .pipe(finalize(() => this.isLoading = false))
  //       .subscribe({
  //         next: (result) => this.handleRegistrationResult(result),
  //         error: (error) => this.handleRegistrationError(error)
  //       });
  //   } else {
  //     this.markFormAsTouched();
  //   }
  // }


 register() {
  if (this.registerForm.valid) {
    const formData = this.prepareFormData();
    console.log("Form data:", formData);
    
    // Dispatcher l'action sans subscription directe
    this.authService.register(formData);
    
    // L'état sera mis à jour via le store et la subscription dans le constructor
  } else {
    this.markFormAsTouched();
  }
}


  private prepareFormData(): any {
    return {
      ...this.registerForm.value,
      userIdKeycloak: "",
      location: {
        nationality: this.registerForm.value.nationality,
        country: this.registerForm.value.country,
        region: this.registerForm.value.region,
        department: this.registerForm.value.department,
        address: this.registerForm.value.address
      }
    };
  }

  // private autoLoginAfterRegistration(): void {
  //   const { email, password } = this.registerForm.value;
  //   this.authService.login(email, password).subscribe(loginResult => {
  //     const redirectUrl = loginResult.isAdmin ? '/admin/dashboard' : this.returnUrl;
  //     this.router.navigate([redirectUrl]);
  //   });
  // }

  private markFormAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  // Méthodes d'interface utilisateur
  selectGender(gender: string): void {
    this.selectedGender = gender;
    this.registerForm.patchValue({ gender });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && (field.dirty || field.touched));
  }

  getInputClass(fieldName: string): string {
    return this.isFieldInvalid(fieldName)
      ? 'border-b border-red-500'
      : 'border-b border-white focus:border-light-green';
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return 'Ce champ est obligatoire';
    if (field.errors['email']) return 'Email invalide';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    if (field.errors['pattern']) return 'Format invalide';

    return '';
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}