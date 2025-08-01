import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { from, Observable } from 'rxjs';
import { kycModel } from '../../models/kyc';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class Kyc {

   constructor(private fireStore: Firestore) { }
 
  addKyc(userId:string, data:kycModel):Observable<any>{
    const collectionRef = collection(this.fireStore, `users/${userId}/kyc`)
    return from(addDoc(collectionRef, data))
  }
}
