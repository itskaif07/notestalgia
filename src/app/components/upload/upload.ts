import { Component, inject, OnInit } from '@angular/core';
import { Notes } from '../../services/notes/notes';
import { Note } from '../../models/note';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import gsap from 'gsap';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-upload',
  imports: [ReactiveFormsModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload implements OnInit {

  notesService = inject(Notes)
  authService = inject(AuthService)
  router = inject(Router)

  uid: string | null = null
  selectedFileName: string | null = null
  thumbnailPreviewUrl: string | null = null
  title: string | null = null
  category: string | null = null
  subject: string | null = null
  description: string | null = null
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.setFormState()

    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.uploadForm.get('userId')?.setValue(user.uid);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }


  fb = inject(FormBuilder)

  uploadForm: FormGroup = this.fb.group({})

  setFormState() {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: 30,
      category: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      thumbnail: [''],
      fileUrl: ['', [Validators.required]],
      userId: [this.uid, [Validators.required]],
      createdAt: [new Date()],
    })
  }

  // File upload 

  async selectFile(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      this.selectedFile = file; // 🔐 Store separately, NOT in form

      const storage = getStorage();
      const fileRef = ref(storage, `notes/${file.name}`);

      try {
        await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(fileRef);
        this.uploadForm.get('fileUrl')?.setValue(downloadUrl); // ✅ Only URL goes in form
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  }



  //Thumbnail Upload

 async selectThumbnail(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const storage = getStorage();
    const thumbRef = ref(storage, `thumbnail/${file.name}`); // ✅ Fix here

    try {
      await uploadBytes(thumbRef, file);
      const thumbnailUrl = await getDownloadURL(thumbRef);
      this.thumbnailPreviewUrl = thumbnailUrl
      this.uploadForm.get('thumbnail')?.setValue(thumbnailUrl); // ✅ Only URL saved
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }
}


  //For Data Preview

  getOtherFields() {
    this.title = this.uploadForm.get('title')?.value
    this.subject = this.uploadForm.get('subject')?.value
    this.category = this.uploadForm.get('category')?.value
    this.description = this.uploadForm.get('description')?.value
    console.log(this.uploadForm.getRawValue())
  }

  // Submit

  formSubmit() {

    const note: Note = {
      ...this.uploadForm.getRawValue(),
      createdAt: new Date(),
      price: 30,
      userId: this.uid
    }

    this.notesService.addNote(note).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => console.log(error)
    })
  }



  //Animation

  phase1Animation() {
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

    this.getOtherFields()
  }

  phase2BackAnimation() {
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
