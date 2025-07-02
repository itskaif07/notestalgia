import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notes } from '../../services/notes/notes';
import { SafeUrlPipe } from '../../pipes/safe-url-pipe';
import { AddReview } from "../reviews/add-review/add-review";
import { Reviews } from '../../services/reviews/reviews';
import { DatePipe } from '@angular/common';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-shop',
  imports: [SafeUrlPipe, AddReview, DatePipe],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {

  reviewService = inject(Reviews)
  noteService = inject(Notes)
  auth = inject(Auth)
  activatedRoute = inject(ActivatedRoute)

  noteData: any = null
  docId: string | null = null
  reviewsList: any[] | null = null
  currentUser: User | null = null

  isShowingReviewBox: boolean = false
  userReviewed: boolean = false


  ngOnInit(): void {
  onAuthStateChanged(this.auth, (user) => {
    if (user) {
      this.currentUser = user;
      this.getDocumentId(); // Call only after user is ready
    }
  });
}


  getDocumentId() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.docId = params.get('id')
      if (this.docId != null) {
        this.getNoteDetails()
        this.getReviewsList()
        this.checkUserReview();
      }
    })
  }

  getNoteDetails() {
    if (this.docId != null) {
      this.noteService.getNote(this.docId).subscribe({
        next: (docSnap) => {
          if (docSnap.exists()) {
            this.noteData = docSnap.data();
            console.log('Note data:', this.noteData);
          } else {
            console.log('No such document exists!');
          }
        },
        error: (err) => console.error('Error fetching note:', err)
      });
    }
  }

  getReviewsList() {
    if (this.docId != null) {
      this.reviewService.getAllReviews(this.docId).subscribe({
        next: (reviews) => {
          this.reviewsList = reviews;
          console.log('Reviews:', this.reviewsList);
        },
        error: (err) => console.error('Error fetching reviews:', err)
      })
    }
  }

  checkUserReview() {
    if (this.currentUser && this.docId) {
      this.reviewService.checkIfUserReviewed(this.docId, this.currentUser.uid).subscribe({
        next: (review) => {
          if (review.length > 0) {
            this.userReviewed = true;
          }
          console.log('User has reviewed:', this.userReviewed, review);
        },
        error: (err) => console.error('Error checking user review:', err)
      })
    }
  }

}
