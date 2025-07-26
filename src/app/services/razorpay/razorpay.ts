import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Razorpay {

  private baseUrl = 'https://api-2irx5macqa-uc.a.run.app';
  constructor(private http: HttpClient){}

  placeOrder(amount:number){
    return this.http.post(`${this.baseUrl}/createOrder`, { amount },     {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
