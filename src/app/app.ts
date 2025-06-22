import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth-service';
import { Auth, browserLocalPersistence, onAuthStateChanged, setPersistence, signInAnonymously } from '@angular/fire/auth';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { filter } from 'rxjs';

gsap.registerPlugin(ScrollTrigger)

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

    if (document.visibilityState == 'visible') {
    }
    else {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState == 'visible') {
        }
      })
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Use timeout to let view render before scroll
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo({ top: 0 });
      }, 50);
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
