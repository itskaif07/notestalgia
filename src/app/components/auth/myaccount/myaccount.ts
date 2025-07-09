import { Component, inject, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Notes } from '../../../services/notes/notes';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-myaccount',
  imports: [CommonModule],
  templateUrl: './myaccount.html',
  styleUrl: './myaccount.css'
})
export class Myaccount implements OnInit {

  auth = inject(Auth)
  router = inject(Router)

  noteService = inject(Notes)

  currentUser: User | null = null
  uid: string | null = null
  userNotesList: any[] | null = null
  userNotesCount: number | null = null
  accountCreationDate: any | null = null

  isCreator = false
  isLoading = true

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user
        this.uid = user.uid
        this.accountCreationDate = user.metadata.creationTime
        this.getUserNotes()
        this.isLoading = false
      }
      else {
        console.log('No user logged in');
        this.router.navigate(['/login'])
      }
    })
  }

  onImageError(event:Event){
    (event.target as HTMLImageElement).src = 'assets/user.png'
  }

  getUserNotes() {
    if (this.uid) {
      this.noteService.getCurrentUserNotes(this.uid).subscribe({
        next: (data) => {
          this.userNotesList = data
          this.userNotesCount = data.length

          if (this.userNotesCount > 0) {
            this.isCreator = true
          }
        },
        error: (e) => console.log(e)
      })
    }
  }


}
