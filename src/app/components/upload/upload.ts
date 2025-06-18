import { Component, inject } from '@angular/core';
import { Notes } from '../../services/notes/notes';
import { Note } from '../../models/note';
import { ReactiveFormsModule } from '@angular/forms';
import gsap from 'gsap';

@Component({
  selector: 'app-upload',
  imports: [ReactiveFormsModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {

  notesService = inject(Notes)

  currentPhase:number = 1
  totalPhases:number = 3


  goNext() {
    if (this.currentPhase < this.totalPhases) {
      this.goToPhase(this.currentPhase + 1);
    }
  }

  goBack() {
    if (this.currentPhase > 1) {
      this.goToPhase(this.currentPhase - 1);
    }
  }

  goToPhase(phase: number) {
    const current = document.getElementById(`phase${this.currentPhase}`);
    const next = document.getElementById(`phase${phase}`);

    if (!current || !next) return;

    gsap.to(current, {
      x: 200,
      opacity: 0,
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: () => {
        current.classList.remove('flex');
        current.classList.add('hidden');

        next.classList.remove('hidden');
        next.classList.add('flex');

        gsap.fromTo(next, { x: -200, opacity: 0 }, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'expo.inOut'
        });

        this.currentPhase = phase;
      }
    });
  }




  addNote(note: Note) {
    this.notesService.addNote(note).subscribe({
      next: (res) => console.log('Note added!', res),
      error: (err) => console.error('Error adding note:', err)
    });
  }

  phaseSteps() {
    document.querySelector('#button1')
  }

  phase1Animation() {
    this.goNext()
    gsap.to('#phase1', {
      x: 200,
      opacity: 0,
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: () => {
        document.getElementById('phase1')!.classList.remove('flex')
        document.getElementById('phase1')!.classList.add('hidden')
      }
    })

    gsap.set('#phase2', {
      opacity: 0,
      x: -200
    })

    gsap.to('#phase2', {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'expo.inOut',
      delay: 0.5,
      onStart: () => {
        document.getElementById('phase2')!.classList.remove('hidden')
        document.getElementById('phase2')!.classList.add('flex')
      }
    })
  }

  phase2Animation() {
    this.goNext()
    gsap.to('#phase2', {
      x: 200,
      opacity: 0,
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: () => {
        document.getElementById('phase2')!.classList.remove('flex')
        document.getElementById('phase2')!.classList.add('hidden')
      }
    })

    gsap.set('#phase3', {
      x: -200,
      opacity: 0
    })

    gsap.to('#phase3', {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'expo.inOut',
      delay: 0.5,
      onStart: () => {
        document.getElementById('phase3')!.classList.remove('hidden')
        document.getElementById('phase3')!.classList.add('flex')
      }
    })
  }

  phase2BackAnimation() {
    this.goBack()
    gsap.to('#phase2', {
      x: 200,
      opacity: 0,
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: () => {
        document.getElementById('phase2')!.classList.remove('flex')
        document.getElementById('phase2')!.classList.add('hidden')
      }
    })

    gsap.to('#phase1', {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'expo.inOut',
      delay: 0.5,
      onStart: () => {
        document.getElementById('phase1')!.classList.remove('hidden')
        document.getElementById('phase1')!.classList.add('flex')
      }
    })
  }

  phase3BackAnimation() {
    this.goBack()
    gsap.to('#phase3', {
      x: 200,
      opacity: 0,
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: () => {
        document.getElementById('phase3')!.classList.remove('flex')
        document.getElementById('phase3')!.classList.add('hidden')
      }
    })

    gsap.to('#phase2', {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'expo.inOut',
      delay: 0.5,
      onStart: () => {
        document.getElementById('phase2')!.classList.remove('hidden')
        document.getElementById('phase2')!.classList.add('flex')
      }
    })
  }

}
