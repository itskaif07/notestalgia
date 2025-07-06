import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Functions } from '@angular/fire/functions';
import { httpsCallable } from 'firebase/functions';

@Injectable({
  providedIn: 'root'
})
export class Payment {

  constructor(private functions: Functions) { }

  createOrder(amount:number){
    const createOrderFn = httpsCallable(this.functions, 'createOrder')
    return from(createOrderFn({amount}))
  }
}
