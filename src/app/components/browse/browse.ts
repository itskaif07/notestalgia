import { Component, inject, OnInit } from '@angular/core';
import { NoteCategories } from '../../models/category';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse',
  imports: [CommonModule],
  templateUrl: './browse.html',
  styleUrl: './browse.css'
})
export class Browse implements OnInit  {

  categoriesList = NoteCategories

  imagesList: any[] | null = null
  apiUrl = 'https://picsum.photos/v2/list';

  http = inject(HttpClient)

  ngOnInit(): void {
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

}
