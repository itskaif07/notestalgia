import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import gsap from 'gsap';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  authService = inject(AuthService)
  auth = inject(Auth)

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (!user) {
        this.authService.logInAsGuest().subscribe({
          next: (res) => {
            console.warn(res.user)
            console.info('Hello')
          },
          error: (error) => console.error(error)
        })
      }
      else {
        console.warn('User is already logged in')
      }
    })
    this.heroAnimation()
  }

  heroAnimation() {
    document.body.style.overflow = 'hidden';

    gsap.from('#left', {
      x: '-100%',
      opacity: 1,
      ease: 'power1.inOut',
      duration: 1,
      display: 'none',
      onComplete: () => {
        document.body.style.overflow = '';
      }
    })
    gsap.from('#right', {
      x: '100%',
      opacity: 1,
      ease: 'power1.inOut',
      duration: 1,
      display: 'none'
    })
  }

}
