import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder)

  loginForm: FormGroup = this.fb.group({});
  errorMessage: string = '';
  successMessage: string = '';

  isDisplayingMessage: boolean = false;

  ngOnInit(): void {
    this.setFormState();
  }

  setFormState() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    const email = this.loginForm.controls['email']?.value.trim();
    const password = this.loginForm.controls['password']?.value.trim();

    if (!email || !password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.authService.logIn(email, password).subscribe({
      next: () => {
        this.successMessage = 'Login successful!';
        this.errorMessage = '';
        this.loginForm.reset();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log('Login error:', error);
        if (error.code === 'auth/user-not-found') {
          this.errorMessage = 'User not found. Please check your email or sign up.';
          this.isDisplayingMessage = true;
        }
        else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'Invalid email format. Please enter a valid email address.';
          this.isDisplayingMessage = true;
        }
        else if (error.code === 'auth/too-many-requests') {
          this.errorMessage = 'Too many login attempts. Please try again later.';
          this.isDisplayingMessage = true;
        }
        else if (error.code === 'auth/user-disabled') {
          this.errorMessage = 'User account is disabled. Please contact support.';
          this.isDisplayingMessage = true;
        }
        else if (error.code === 'auth/operation-not-allowed') {
          this.errorMessage = 'Login operation is not allowed. Please contact support.';
          this.isDisplayingMessage = true;
        }
        else if (error.code === 'auth/invalid-password') {
          this.errorMessage = 'Invalid password. Please check your password and try again.';
          this.isDisplayingMessage = true;
        }
        else if (error.code === 'auth/invalid-credential') {
          this.errorMessage = 'Wrong credentials. Please check your email and password.';
          this.isDisplayingMessage = true;
        }
        else if (error.code === 'auth/wrong-password') {
          this.errorMessage = 'Incorrect password. Please try again.';
          this.isDisplayingMessage = true;
        }
        else {
          this.errorMessage = 'Login failed. Please try again.';
          this.isDisplayingMessage = true;
        }
        setTimeout(() => {
          this.isDisplayingMessage = false;
          this.errorMessage = '';
          this.successMessage = '';
        }, 3000);
      }
    });
  }

  googleLogin() {
    this.authService.googleSignUp().subscribe({
      next: () => {
        this.isDisplayingMessage = true;
        this.successMessage = 'Google login successful!';
        this.errorMessage = '';
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isDisplayingMessage = true;
        this.errorMessage = 'Google login failed. Please try again.';
        this.successMessage = '';
        console.error('Google login error:', error);
      }
    });
  }
}