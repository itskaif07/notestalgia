import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Reviews {

  fireStore = inject(Firestore)

  addReview(data:any, noteId:string):Observable<any>{
    const reviewsCollection = collection(this.fireStore, `notes/${noteId}/reviews`)
    return from(addDoc(reviewsCollection, data))
  }

  deleteReview(reviewId:string, noteId:string):Observable<any>{
    const reviewRef = doc(this.fireStore, `notes/${noteId}/reviews/${reviewId}`)
    return from(deleteDoc(reviewRef))
  }

  getAllReviews(noteId:string):Observable<any[]>{
    const reviewsCollection = collection(this.fireStore, `notes/${noteId}/reviews`);
    return collectionData(reviewsCollection)
  }
}
