import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reviews } from '../../../services/reviews/reviews';
import { Auth, User } from '@angular/fire/auth';

@Component({
  selector: 'app-add-review',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-review.html',
  styleUrl: './add-review.css'
})
export class AddReview implements OnInit {

  fb = inject(FormBuilder)
  reviewService = inject(Reviews)
  auth = inject(Auth)


  @Input() noteId: string = ''
  @Output() cancelled = new EventEmitter<void>();
  
  reviewForm: FormGroup = this.fb.group({})

  selectedRating: number = 0;
  userId: string | null = null
  username: string | null = null
  userImage: string | null = null
  currentUser: User | null = null

  selectRating(rating: number) {
    this.selectedRating = rating;
  }

  ngOnInit(): void {
    if (this.auth) {
      this.currentUser = this.auth?.currentUser
    }
    this.setFormState()
  }

  setFormState() {
    this.reviewForm = this.fb.group({
      review: ['', [Validators.maxLength(500)]],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      createdAt: [new Date(), Validators.required],
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      userImage: [''],
      noteId: [this.noteId, Validators.required]
    })
  }

  submitReview(noteId: string) {

    if (!this.currentUser) {
      console.error('No user is currently logged in.');
      return;
    }

    const rating = this.selectedRating
    const review = this.reviewForm.get('review')?.value;

    this.reviewForm.patchValue({
      rating: rating,
      review: review,
      userId: this.currentUser.uid,
      userName: this.currentUser.displayName || 'Anonymous',
      userImage: this.currentUser.photoURL || 'https://t3.ftcdn.net/jpg/05/87/76/66/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH.jpg'
    })

    this.reviewService.addReview(this.reviewForm.value, noteId).subscribe({
      next: (response) => {
        this.reviewForm.reset();
        this.selectedRating = 0;
        console.log('REVIEW SAVED SUCCESSFULLY ✅');
        this.cancelled.emit()
      },
      error: (error) => {
        console.error('Error submitting review:', error);
      }
    })


  }

}
