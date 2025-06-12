import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth-service';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.css'
})
export class PasswordReset implements OnInit {

  fb = inject(FormBuilder)
  authService = inject(AuthService)
  auth = inject(Auth)

  successMessage: string | null = null
  errorMessage: string | null = null

  resetForm: FormGroup = this.fb.group({})

  ngOnInit(): void {
    this.setFormState()
  }

  setFormState() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  onSubmit() {
    const email = this.resetForm.value?.email

    if (email == null || email == '') {
      this.errorMessage = 'Email is required'
      setTimeout(() => {
        this.errorMessage = null
      }, 4000);
      return
    }

    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.successMessage = 'Password reset link sent! Check your email.'
      })
      .catch((error) => {
        console.error('Reset error:', error);
        if (error.code === 'auth/user-not-found') {
          this.errorMessage = 'No account with this email exists.';
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'Please enter a valid email.';
        } else {
          this.errorMessage = 'Something went wrong. Try again later.';
        }
      })

    setTimeout(() => {
      this.errorMessage = null
      this.successMessage = null
    }, 4000);
  }

}
