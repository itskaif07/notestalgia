import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, Firestore, setDoc } from '@angular/fire/firestore';
import { collection, CollectionReference, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Cart {

  constructor(private fireStore: Firestore) {
  }

  addToWishlist(userId: string, note: any): Observable<any> {
    const wishlistRef = doc(this.fireStore, `users/${userId}/wishlist/${note.id}`)
    return from(setDoc(wishlistRef, {
      id: note.id,
      title: note.title,
      price: note.price,
      thumbnail: note.thumbnail || '',
      subject: note.subject,
      level: note.level,
      category: note.category,
      addedAt: Timestamp.now()
    }))
  }

  getAllItems(userId: string) {
    const wishlistRef = collection(this.fireStore, `users/${userId}/wishlist`)
    return from(collectionData(wishlistRef, { idField: 'id' }))
  }

  removeWishlist(userId:string, noteId:string){
    const wishlistItemRef = doc(this.fireStore, `users/${userId}/wishlist/${noteId}`)
    return from(deleteDoc(wishlistItemRef))
  }

}
