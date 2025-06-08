import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth-service';
import { first } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup implements OnInit {

  authService = inject(AuthService)
  fb = inject(FormBuilder);
  router = inject(Router);

  errorMessage: string = '';
  successMessage: string = '';

  signUpForm: FormGroup = this.fb.group({})

  ngOnInit() {
    this.setFormState();
  }

  setFormState() {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {

    const fullName = this.signUpForm.value.fullName.trim();
    const email = this.signUpForm.value.email.trim();
    const password = this.signUpForm.value.password.trim();
    const confirmPassword = this.signUpForm.value.confirmPassword.trim();

    if(this.signUpForm.valid){
      if(this.signUpForm.value.password !== this.signUpForm.value.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      this.authService.signUp(email, password, fullName).subscribe(()=>{
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.signUpForm.reset();
        this.router.navigate(['/verification']);
      }, error =>{
        if(error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Email already in use. Please use a different email.';
        }
        else if(error.code === 'auth/invalid-email') {
          this.errorMessage = 'Invalid email format. Please enter a valid email address.';
        }
        else if(error.code === 'auth/weak-password') {
          this.errorMessage = 'Weak password. Please enter a stronger password.';
        }
        else if(error.code === 'auth/too-many-requests') {
          this.errorMessage = 'Too many sign-up attempts. Please try again later.';
        }
        else if(error.code === 'auth/operation-not-allowed') {
          this.errorMessage = 'Sign-up operation is not allowed. Please contact support.';
        }
        else if(error.code === 'auth/invalid-credential') {
          this.errorMessage = 'Invalid credentials. Please check your email and password.';
        }
        else if(error.code === 'auth/user-disabled') {
          this.errorMessage = 'User account is disabled. Please contact support.';
        }
        else if(error.code === 'auth/invalid-action-code') {
          this.errorMessage = 'Invalid action code. Please try again.';
        }
        else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      })
    }
  }

  googleSignUp(){
    this.authService.googleSignUp().subscribe({
      next: () =>{
        this.successMessage = 'Registration successful! Please log in.';
        this.errorMessage = '';
        this.signUpForm.reset();
        this.router.navigate(['/']);
      }
    })
  }
}
