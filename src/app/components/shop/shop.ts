import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Notes } from '../../services/notes/notes';
import { AddReview } from "../reviews/add-review/add-review";
import { Reviews } from '../../services/reviews/reviews';
import { CommonModule, DatePipe } from '@angular/common';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Cart } from '../../services/cart/cart';
import { Razorpay } from '../../services/razorpay/razorpay';
import { HttpClient } from '@angular/common/http';
import { Orders } from '../../services/orders/orders';

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
  razorpayService = inject(Razorpay)
  orderService = inject(Orders)

  auth = inject(Auth)
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  http = inject(HttpClient)

  noteData: any = null
  docId: string | null = null
  reviewsList: any[] | null = null
  PreviewImagesForDisplay: string[] = []
  currentUser: User | null = null
  reviewCount: number | null = null
  averageRatings: number | null = null
  reviewId: string | null = null
  razorpayId: string | null = null

  isShowingReviewBox: boolean = false
  userReviewed: boolean = false
  isLoading = true
  isShowingPreview = false
  isPaymentSuccessful = false


  currentSlide = 0;



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
        next: (note) => {
          this.noteData = note
          this.PreviewImagesForDisplay = this.noteData.previewImages
          console.log(this.noteData)
          this.verifyPurchase()
        },
        error: (e) => console.log('error while finding note details')
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


  //preview Images


  nextSlide() {
    if (this.PreviewImagesForDisplay.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.PreviewImagesForDisplay.length;
    }
  }

  prevSlide() {
    if (this.PreviewImagesForDisplay.length > 0) {
      this.currentSlide =
        (this.currentSlide - 1 + this.PreviewImagesForDisplay.length) % this.PreviewImagesForDisplay.length;
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

  verifyPurchase() {
    console.log('verifyPurchase called');  // add this first

    if (this.currentUser && this.noteData) {
      this.orderService.checkIfNotePurchased(this.currentUser.uid, this.noteData.id).subscribe({
        next: (res) => {
          console.log('Purchase status from backend:', res);
          this.isPaymentSuccessful = res;
        },
        error: (err) => {
          console.error('Error checking purchase status:', err);
          this.isPaymentSuccessful = false;
        }
      });
    } else {
      console.log('verifyPurchase skipped: currentUser or noteData missing', this.currentUser, this.noteData);
    }
  }

  // Buy Note

  buyNote() {
    this.isLoading = true
    const amount = 1; // ₹50 ka amount agar fix hai to yahi use karein
    this.razorpayService.placeOrder(amount).subscribe({
      next: (order) => {
        this.isLoading = false
        this.openRazorpay(order);
        console.log('✅ Order placed successfully');
      },
      error: (err) => {
        this.isLoading = false
        console.error('❌ Failed to place order:', err);
        // Optional: user ko error message dikha sakte hain
      }
    });
  }

  openRazorpay(order: any) {
    const options = {
      key: 'rzp_live_acjiRzTNtJCtdU',
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'NotesTalgia',
      description: `Purchase of note titled "${this.noteData?.title || 'Untitled'}" for ₹50 on Notestalgia`,
      handler: (response: any) => {
        this.handlePaymentSuccess(response, order);
      },
      prefill: {
        name: this.currentUser?.displayName || '',
        email: this.currentUser?.email || ''
      },
      theme: {
        color: '#F3C44E'
      }
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      this.isPaymentSuccessful = false;
      // Optional: user ko error message dikhayein
    });

    rzp.open();
  }


  private handlePaymentSuccess(response: any, order: any) {
    // Payment verification backend call
    this.http.post('https://api-2irx5macqa-uc.a.run.app/verifyPayment', {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    }).subscribe({
      next: () => {
        console.log('Payment successful');
        this.isPaymentSuccessful = true;

        // Order details backend me save karna
        if (this.currentUser && this.noteData) {
          this.saveOrder(response, order);
        }
      },
      error: (e) => {
        console.error('Payment verification failed', e);
        this.isPaymentSuccessful = false;
        // Optional: user ko error message dikhayein
      }
    });
  }

  private saveOrder(response: any, order: any) {
    const orderData = {
      orderId: response.razorpay_order_id,
      userId: this.currentUser?.uid || '',
      noteId: this.noteData.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: response.razorpay_payment_id,
      isPaymentCompleted: true,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    this.orderService.saveOrderDetails(this.currentUser?.uid!, response.razorpay_order_id, orderData)
      .subscribe({
        next: () => {
          console.log('Order details saved successfully');
          // Optional: user ko success feedback de sakte hain
        },
        error: (e) => {
          console.error('Error occurred while saving order details', e);
          // Optional: user ko error feedback de sakte hain
        }
      });
  }
}