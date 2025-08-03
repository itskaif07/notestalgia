import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { from, Observable } from 'rxjs';
import { kycModel } from '../../models/kyc';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Kyc {

  constructor(private fireStore: Firestore, private http: HttpClient) { }

  addKyc(userId: string, data: kycModel): Observable<any> {
    const collectionRef = doc(this.fireStore, `users/${userId}/kyc`, 'kycData')
    return from(setDoc(collectionRef, data))
  }

  updateKycStatus(userId: string, status: boolean): Observable<any> {
    const docRef = doc(this.fireStore, `users/${userId}/kyc`, 'kycData');
    return from(setDoc(docRef, { kycCompleted: status }, { merge: true }));
  }

createContact(data: any): Observable<any> {
    return this.http.post('https://api-2irx5macqa-uc.a.run.app/create-contact', data);
}

createFundAccount(data:any){
    return this.http.post('https://api-2irx5macqa-uc.a.run.app/create-fund-account', data);

}

}
