import { Timestamp } from "firebase/firestore";

export interface Note {
    id?: string,
    title: string,
    description?: string,
    category: string,
    subject: string,
    price: 50,
    thumbnail: string,
    previewImages?: string[],
    fileUrl: string,
    userId: string,
    createdAt: Timestamp | Date | string
}