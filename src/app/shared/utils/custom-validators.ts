import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valide que le champ `confirmPassword` est égal au champ `password`
 */
export function passwordMatchValidator(passwordKey = 'password', confirmPasswordKey = 'confirmPassword'): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirmPassword = group.get(confirmPasswordKey)?.value;

    if (password !== confirmPassword) {
      group.get(confirmPasswordKey)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      
      const confirmControl = group.get(confirmPasswordKey);
      if (confirmControl?.hasError('passwordMismatch')) {
        delete confirmControl.errors?.['passwordMismatch'];
        if (Object.keys(confirmControl.errors || {}).length === 0) {
          confirmControl.setErrors(null);
        }
      }
      return null;
    }
  };
}
