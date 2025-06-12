import { Component, inject, OnInit } from '@angular/core';
import { Auth, sendEmailVerification } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service';
import { applyActionCode } from 'firebase/auth';

@Component({
  selector: 'app-auth-call-back',
  imports: [],
  templateUrl: './auth-call-back.html',
  styleUrl: './auth-call-back.css'
})
export class AuthCallBack implements OnInit {

  isEmailReceived: boolean = false;
  activatedRoute = inject(ActivatedRoute);
  auth = inject(Auth);
  router = inject(Router)
  authService = inject(AuthService)

  oobCode: string | null = null;
  mode: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  async ngOnInit() {
    this.getParams()

    if (this.oobCode != null && this.mode != null) {

      if (this.mode == 'verifyEmail') {
        try {
          await applyActionCode(this.auth, this.oobCode)
          this.successMessage = 'Your email has been verified!'
          this.router.navigate(['/'])
        }
        catch (error) {
          this.errorMessage = 'Verification failed. Try again.';
        }
      }
      else if (this.mode == 'password-reset') {
        this.router.navigate(['/new-password'], { queryParams: { oobCode: this.oobCode } })
      }
      else {
        this.errorMessage = 'Unknown action type.';
      }
    }

  }

  getParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'] || null
      this.mode = params['mode'] || null
    })
  }

  resendEmail() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user && !user.emailVerified) {
        sendEmailVerification(user)
          .then(() => {
            this.successMessage = 'Verification email sent again!'
          })
          .catch((error) => {
            this.errorMessage = 'Failed to resend verification email.';
            console.error(error);
          });
      }
      else {
        this.errorMessage = 'User is already verified or not logged in.';
      }
    })
  }

}
