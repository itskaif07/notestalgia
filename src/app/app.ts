import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth-service';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'notestalgia';

  authService = inject(AuthService);
  isVerified: boolean = false
  isAuthenticated: boolean = false

  fullName: string = '';

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    return this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.fullName = user.displayName || '';
      }
    }, error => {
      console.error('Error fetching user details:', error);
    })
  }



}
