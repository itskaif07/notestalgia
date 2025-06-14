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
            console.log(res.user)
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

  gsap.from('#left > *', {
  opacity: 0,
  y: 20,
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.2,
  delay: 0.5
})

gsap.from('.bg-glow', {
  opacity: 0,
  scale: 0.9,
  duration: 1.5,
  ease: 'power2.out',
  delay: 0.1
})



gsap.from('#right', {
  x: '200',
  opacity: 0,
  ease: 'power2.out',
  duration: 1,
  delay: 0.5 // comes in a bit later
})




  }

}
