import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notes } from '../../services/notes/notes';
import { SafeUrlPipe } from '../../pipes/safe-url-pipe';
import { AddReview } from "../reviews/add-review/add-review";

@Component({
  selector: 'app-shop',
  imports: [SafeUrlPipe, AddReview],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {

  activatedRoute = inject(ActivatedRoute)
  docId: string | null = null
  noteData:any = null

  reviewsList: any[] | null =  null

  isShowingReviewBox: boolean = false

  noteService = inject(Notes)

  ngOnInit(): void {
    this.getDocumentId()
    this.getNoteDetails()
  }

  getDocumentId() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.docId = params.get('id')
    })
  }

  getNoteDetails() {
    if (this.docId != null) {
      this.noteService.getNote(this.docId).subscribe({
        next: (docSnap) => {
          if (docSnap.exists()) {
            this.noteData = docSnap.data();
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
