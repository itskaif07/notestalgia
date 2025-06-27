import { Component, inject, OnInit } from '@angular/core';
import { NoteCategories } from '../../models/category';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Notes } from '../../services/notes/notes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-browse',
  imports: [CommonModule, RouterLink],
  templateUrl: './browse.html',
  styleUrl: './browse.css'
})
export class Browse implements OnInit {

  categoriesList = NoteCategories
  allNotesList: any[] | null = null
  notesList: any[] | null = null

  activeCategory: any = null

  imagesList: any[] | null = null
  noteService = inject(Notes)

  lsList: any[] | null = null

  http = inject(HttpClient)

  ngOnInit(): void {
    this.getNotes()
  }


  getNotes() {
    this.noteService.getAllNotes().subscribe({
      next: (data) => {
        this.allNotesList = data
        this.notesList = data
      },
      error: (err) => console.log(err)
    })
  }

  filterByCategory(category: string) {
    if (this.notesList && this.allNotesList) {
      const selected = category.trim().toLowerCase();
      this.activeCategory = category
      this.notesList = this.allNotesList.filter(note =>
        note.category?.trim().toLowerCase() === selected
      );
    }
  }

  resetCategory(){
    this.activeCategory = null
    this.notesList = this.allNotesList
  }



}
