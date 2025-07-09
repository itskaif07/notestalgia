import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router, RouterLink } from '@angular/router';
import { Cart } from '../../../services/cart/cart';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage {

  wishlistNotes: any[] = [];
  currentUser: User | null = null
  isLoading = true

  cartService = inject(Cart)

  auth = inject(Auth)
  firestore = inject(Firestore)
  router = inject(Router)

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user
        this.loadWishlist()
      }
      else {
        this.router.navigate(['/login'])
      }
    })
  }

  loadWishlist() {
    if (this.currentUser) {
      this.cartService.getAllItems(this.currentUser.uid).subscribe({
        next: (data) => {
          this.wishlistNotes = data
          this.isLoading = false
        },
        error:(e) =>{
          console.log(e)
          this.isLoading = false
        }
      })
    }

  }

  removeFromWishlist(noteId: string) {
    if (this.currentUser && this.wishlistNotes) {
      this.cartService.removeWishlist(this.currentUser.uid, noteId).subscribe({
        next: () => {
          console.log('Item deleted successfully')
        },
        error: (e) => console.log('some error occured while deleting the data')
      })
    }
  }


}
