import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit {

  router = inject(Router)

  ngOnInit(): void {
   
  }

}
