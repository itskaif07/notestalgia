import { Component, inject, OnInit } from '@angular/core';
import { applyActionCode, Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-verification',
  imports: [],
  templateUrl: './verification.html',
  styleUrl: './verification.css'
})
export class Verification implements OnInit {

  isEmailReceived: boolean = false;
  activatedRoute = inject(ActivatedRoute);
  auth = inject(Auth);
  router = inject(Router)
  authService = inject(AuthService)

  oobCode: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'] || null;
    })
    this.authService.getCurrentUser().subscribe((user) => {
      console.warn('user in root', user)
    })
    if (this.oobCode != null) {
      console.warn('oobCode is ', this.oobCode)
      this.verifyEmail()
    }
  }

  verifyEmail() {
    if (this.oobCode != null && this.oobCode != '') {
      applyActionCode(this.auth, this.oobCode).then(() => {
        this.successMessage = 'Email verified successfully!';
        this.logInAfterVerification()
      }).catch((error) => {
        console.error('Error verifying email:', error);
        this.errorMessage = 'Failed to verify email. Please try again.';
      });
    }
  }

  async logInAfterVerification() {

    try {
      const user = await firstValueFrom(this.authService.getCurrentUser())

      if (user) {
        await user.reload();
        console.warn('After reload user:', user);

        if (user.emailVerified) {
          this.successMessage = 'Email verified successfully!';
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Email could not be verified. Please try again.';
        }
      } else {
        this.errorMessage = 'No user is currently logged in.';
      }

    }
    catch (error) {
      console.error('Error during verification login:', error);
      this.errorMessage = 'Something went wrong. Please try again.';
    }
  }

}