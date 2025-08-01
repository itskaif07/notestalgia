import { Timestamp } from "firebase/firestore";

export interface Order {
  orderId: string;            // Razorpay order Id
  userId: string;             // User Id who made payment
  noteId: string;             // Note Id which is purchased
  amount: number;             // Payment amount
  currency: string;           // Currency code, e.g. "INR"
  paymentId?: string;         // Razorpay payment Id (optional, after payment)
  isPaymentCompleted: boolean;// true/false for payment status
  status: 'pending' | 'paid' | 'failed' | string; // Order status
  createdAt: Date | string | Timestamp

}