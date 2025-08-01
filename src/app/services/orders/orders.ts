import { Injectable } from '@angular/core';
import { Order } from '../../models/order';
import { from, map, Observable } from 'rxjs';
import { addDoc, collection, collectionData, Firestore, getDoc, query, setDoc, where } from '@angular/fire/firestore';
import { doc, DocumentSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class Orders {

  constructor(private firestore: Firestore) { }

  saveOrderDetails(userId: string, orderId: string, order: Order): Observable<any> {
    const docRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);
    return from(setDoc(docRef, order));
  }


  // Simplified example in Angular service
  checkIfNotePurchased(userId: string, noteId: string): Observable<boolean> {
    const ordersRef = collection(this.firestore, `users/${userId}/orders`);
    // Query orders collection for this noteId where isPaymentCompleted == true
    const q = query(ordersRef,
      where('noteId', '==', noteId),
      where('isPaymentCompleted', '==', true));
    return collectionData(q).pipe(
      map(orders => orders.length > 0)
    );
  }


}
