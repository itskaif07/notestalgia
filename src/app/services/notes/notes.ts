import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { Note } from '../../models/note';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Notes {

  private notesCollection: CollectionReference;

  constructor(private fireStore: Firestore){
    this.notesCollection = collection(this.fireStore, 'notes');
  }
  

  addNote(note: Note) {
    return from(addDoc(this.notesCollection, note))
  }

  deleteNote(noteId: string) {
    const docReference = doc(this.fireStore, `notes/${noteId}`)
    return from(deleteDoc(docReference))
  }

  updateNote(noteId: string, notesObj: Partial<Note>) {
    const docReference = doc(this.fireStore, `notes/${noteId}`)
    return from(updateDoc(docReference, notesObj))
  }

  getNote(noteId: string) {
    const docReference = doc(this.fireStore, `notes/${noteId}`)
    return from(getDoc(docReference))
  }

  getAllNotes(): Observable<Note[]> {
    return collectionData(this.notesCollection, { idField: 'id' }) as Observable<Note[]>;
  }
}
