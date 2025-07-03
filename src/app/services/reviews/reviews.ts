import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, where } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Reviews {

  fireStore = inject(Firestore)

  addReview(data: any, noteId: string): Observable<any> {
    const reviewsCollection = collection(this.fireStore, `notes/${noteId}/reviews`)
    return from(addDoc(reviewsCollection, data))
  }

  deleteReview(reviewId: string, noteId: string): Observable<any> {
    const reviewRef = doc(this.fireStore, `notes/${noteId}/reviews/${reviewId}`)
    return from(deleteDoc(reviewRef))
  }

  getAllReviews(noteId: string): Observable<any[]> {
    const reviewsCollection = collection(this.fireStore, `notes/${noteId}/reviews`);
    return collectionData(reviewsCollection, { idField: 'id' }) as Observable<any[]>;
  }

  checkIfUserReviewed(noteId: string, userId: string): Observable<any> {
    const reviewRef = collection(this.fireStore, `notes/${noteId}/reviews`)
    const q = query(reviewRef, where('userId', '==', userId))
    return collectionData(q, { idField: 'id' }) as Observable<any>;
  }

  getReviewCount(noteId: string): Observable<number> {
    const reviewsCollection = collection(this.fireStore, `notes/${noteId}/reviews`);
    return collectionData(reviewsCollection).pipe(
      map(reviews => reviews.length)
    );
  }
  
}
