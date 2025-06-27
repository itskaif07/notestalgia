import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notes } from '../../services/notes/notes';

@Component({
  selector: 'app-shop',
  imports: [],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {

  activatedRoute = inject(ActivatedRoute)
  docId: string | null = null
  noteData:any = null

  noteService = inject(Notes)

  ngOnInit(): void {
    this.getDocumentId()
    this.getNoteDetails()
  }

  getDocumentId() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.docId = params.get('id')
      if (this.docId) {
        console.log(this.docId)
      }
    })
  }

  getNoteDetails() {
    if (this.docId != null) {
      this.noteService.getNote(this.docId).subscribe({
        next: (docSnap) => {
          if (docSnap.exists()) {
            this.noteData = docSnap.data(); // 👈 Actual note content here
            console.log('Note data:', this.noteData);
          } else {
            console.log('No such document exists!');
          }
        },
        error: (err) => console.error('Error fetching note:', err)
      });
    }
  }


}
