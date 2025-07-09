import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Notes } from '../../services/notes/notes';
import { AddReview } from "../reviews/add-review/add-review";
import { Reviews } from '../../services/reviews/reviews';
import { CommonModule, DatePipe } from '@angular/common';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Cart } from '../../services/cart/cart';

@Component({
  selector: 'app-shop',
  imports: [AddReview, DatePipe, CommonModule, RouterLink],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {

  reviewService = inject(Reviews)
  noteService = inject(Notes)
  cartService = inject(Cart)

  auth = inject(Auth)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

  noteData: any = null
  docId: string | null = null
  reviewsList: any[] | null = null
  currentUser: User | null = null
  reviewCount: number | null = null
  averageRatings: number | null = null
  reviewId: string | null = null

  isShowingReviewBox: boolean = false
  userReviewed: boolean = false
  isLoading = true


  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
      }
      this.getDocumentId(); // Call only after user is ready
    });
  }


  getDocumentId() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.docId = params.get('id')
      if (this.docId != null) {
        this.getNoteDetails()
        this.getReviewsList()
        this.checkUserReview()
        this.isLoading = false
      }
    })
  }

  getNoteDetails() {
    if (this.docId != null) {
      this.noteService.getNote(this.docId).subscribe({
        next:(note) => {
          this.noteData = note 
        },
        error:(e) => console.log('error while finding note details')
      })
    }
  }


  // Reviews & Ratings

  getReviewsList() {
    if (this.docId != null) {
      this.reviewService.getAllReviews(this.docId).subscribe({
        next: (reviews) => {
          this.reviewsList = reviews;
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
          else {
            this.userReviewed = false;
          }
          this.getReviewsCount()
        },
        error: (err) => {
          console.error('Error checking user review:', err)
          this.userReviewed = false
        }
      })
    }
  }


  getReviewsCount(): void {
    if (this.docId) {
      this.reviewService.getReviewCount(this.docId).subscribe({
        next: (count) => {
          this.reviewCount = count;
          this.getRatingAverage()
        },
        error: (err) => {
          console.error('Error fetching review count:', err);
        }
      });
    }
  }

  getRatingAverage() {
    if (this.reviewsList && this.reviewsList.length > 0) {
      const totalRating = this.reviewsList.reduce((acc, review) => acc + review.rating, 0);
      this.averageRatings = totalRating / this.reviewsList.length;
    }
  }



  deleteReview(reviewId: string) {
    if (this.docId && this.reviewsList) {
      this.reviewService.deleteReview(reviewId, this.docId).subscribe({
        next: () => {
          console.log('Review deleted successfully');
          this.userReviewed = false
          this.getReviewsList(); // Refresh the reviews list after deletion
        },
        error: (err) => console.log('Error deleting review:', err)
      })
    }
  }


  // Wishlist 

  addtoWishlist() {
    if (this.currentUser && this.noteData) {
      this.cartService.addToWishlist(this.currentUser.uid, this.noteData).subscribe({
        next: () => {
          console.log('cart Added Successfully')
          this.router.navigate(['/wishlist'])
        },
        error: (e) => console.log('There have been an error while adding cart')
      })
    }
  }

}
