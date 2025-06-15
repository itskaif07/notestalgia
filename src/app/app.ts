import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth-service';
import { Auth, browserLocalPersistence, onAuthStateChanged, setPersistence, signInAnonymously } from '@angular/fire/auth';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'notestalgia';

  authService = inject(AuthService);
  auth = inject(Auth)
  router = inject(Router)

  isVerified: boolean = false
  isAuthenticated: boolean = false

  fullName: string = '';
  data: any = null

  ngOnInit() {
    this.getUserDetails();
    this.checkLoginAndVerification()

    if (document.visibilityState == 'visible') {
      this.anonymousLogin()
    }
    else {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState == 'visible') {
          this.anonymousLogin()
        }
      })
    }

    this.router.events.subscribe(event => {
      console.log('Router Event:', event);
    });

  }


  anonymousLogin() {
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        return signInAnonymously(this.auth)
      }, error => {
        console.log('Error returned with', error)
      })
  }

  checkLoginAndVerification() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        if (!user.emailVerified && !user.isAnonymous) {
          this.router.navigate(['/auth-callback']);
        } else {
          console.log('User is verified or anonymous');
        }
      }
    });
  }


  getUserDetails() {
    return this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.data = user
        this.fullName = user.displayName || '';
      }
    }, error => {
      console.error('Error fetching user details:', error);
    })
  }

  openMenu() {
    gsap.to("#menubar", {
      x: 0,
      opacity: 1,
      ease: "expo.in",
      duration: 0.2
    });
  }

  closeMenu() {
    gsap.to("#menubar", {
      x: "100%",
      opacity: 0,
      ease: "expo.in",
      duration: 0.5
    });
  }


  navigateToHome() {
    this.router.navigate(['/'])
    this.closeMenu()
  }

  navigateToAbout() {
    this.router.navigate(['/about'])
    this.closeMenu()
  }

  navigateToLogin() {
    this.router.navigate(['/login'])
    this.closeMenu()
  }

  navigateToSignUp() {
    this.router.navigate(['/signup'])
    this.closeMenu()
  }


}
