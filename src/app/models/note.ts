import { Timestamp } from "firebase/firestore";

export interface Note{
    id?: string,
    title: string,
    description?:string,
    category:string,
    subject:string,
    price: 30,
    thumbnail:string,
    fileUrl: string,
    userId: string,
    createdAt: Timestamp | Date | string
}