import { Component, inject, OnInit } from '@angular/core';
import { NoteCategories } from '../../models/category';
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
  isLoading: boolean = true

  activeCategory: any = null

  imagesList: any[] | null = null
  noteService = inject(Notes)

  lsList: any[] | null = null


  ngOnInit(): void {
    this.getNotes();
  }

  // Fetch Notes

  getNotes() {
    this.noteService.getAllNotes().subscribe({
      next: (data) => {
        this.allNotesList = data
        this.notesList = data
        this.sortByNewestFirst()
        this.isLoading = false
      },
      error: (err) => {
        console.log(err)
        this.isLoading = false
      }
    })
  }

  // Filter Methods

  filterByCategory(category: string) {
    this.isLoading = true
    if (this.notesList && this.allNotesList) {
      const selected = category.trim().toLowerCase();
      this.activeCategory = category
      this.notesList = this.allNotesList.filter(note =>
        note.category?.trim().toLowerCase() === selected
      );
      this.isLoading = false
    }
  }

  //Search Method

  searchNotes(event: any) {
    this.isLoading = true
    const searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (this.allNotesList && this.notesList) {
      this.notesList = this.allNotesList.filter(note => {
        return note.title?.trim().toLowerCase().includes(searchTerm) ||
          note.category?.trim().toLowerCase().includes(searchTerm) ||
          note.subject?.trim().toLowerCase().includes(searchTerm) ||
          note.level?.trim().toLowerCase().includes(searchTerm);
      })
      this.isLoading = false
    }
  }

  // Sort Methods

  HandleSortChange(event: any) {
    const value = (event.target as HTMLSelectElement).value;

    switch (value) {
      case 'oldest':
        this.sortByOldestFirst();
        break;
      case 'newest':
        this.sortByNewestFirst();
        break;
      case 'title:asc':
        this.sortByTitleAsc();
        break;
      case 'title:desc':
        this.sortByTitleDesc();
    }
  }

  sortByOldestFirst() {
    this.isLoading = true
    if (this.notesList && this.allNotesList) {
      this.activeCategory = null;

      this.notesList = [...this.allNotesList].sort((a, b) => {
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
        return dateA - dateB;
      });
      this.isLoading = false
    }
  }
  
  sortByNewestFirst() {
    this.isLoading = true
    if ((this.notesList && this.allNotesList)) {
      this.notesList = [...this.allNotesList].sort((a, b) => {
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
        return dateB - dateA;
      })
      this.isLoading = false
    }
  }

  sortByTitleAsc() {
    this.isLoading = true
    if (this.notesList && this.allNotesList) {
      this.notesList = [...this.allNotesList].sort((a, b) => {
        const titleA = a.title?.toLowerCase() || '';
        const titleB = b.title?.toLowerCase() || '';
        return titleA.localeCompare(titleB);
      })
    this.isLoading = false
    }
  }

  sortByTitleDesc() {
    this.isLoading = true
    if (this.notesList && this.allNotesList) {
      this.notesList = [...this.allNotesList].sort((a, b) => {
        const titleA = a.title?.toLowerCase() || '';
        const titleB = b.title?.toLowerCase() || '';
        return titleB.localeCompare(titleA);
      })
    this.isLoading = false
    }
  }


  // Reset Methods

  resetList() {
    this.activeCategory = null
    this.notesList = this.allNotesList
  }



}
