import { Component, inject, OnInit } from '@angular/core';
import { NoteCategories } from '../../models/category';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Notes } from '../../services/notes/notes';

@Component({
  selector: 'app-browse',
  imports: [CommonModule],
  templateUrl: './browse.html',
  styleUrl: './browse.css'
})
export class Browse implements OnInit {

  categoriesList = NoteCategories
  notesList: any[] | null = null

  imagesList: any[] | null = null
  apiUrl = 'https://picsum.photos/v2/list';
  noteService = inject(Notes)

  http = inject(HttpClient)

  ngOnInit(): void {
    this.getNotes()
    this.getImagesList()
  }

  getImagesList() {
    this.http.get(this.apiUrl).subscribe(
      (response: any) => {
        this.imagesList = response;
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  getNotes() {
    this.noteService.getAllNotes().subscribe({
      next: (data) => {
        this.notesList = data
        console.log(data)
      },
      error: (err) => console.log(err)
    })
  }

}
