import { Component, inject, OnInit } from '@angular/core';
import { Notes } from '../../services/notes/notes';
import { Note } from '../../models/note';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import gsap from 'gsap';
import { Router } from '@angular/router';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { AuthService } from '../../services/auth/auth-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { noteSubjects } from '../../models/subject';
import { NoteCategories } from '../../models/category';
import { noteLevels } from '../../models/level';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload implements OnInit {

  notesService = inject(Notes)
  authService = inject(AuthService)
  router = inject(Router)
  sanitizer = inject(DomSanitizer)

  subjectModel = noteSubjects
  categoryModel = NoteCategories
  levelModel = noteLevels

  uid: string | null = null
  selectedFileName: string | null = null
  filePreviewUrl: SafeResourceUrl | null = null
  thumbnailPreviewUrl: string | null = null
  title: string | null = null
  category: string | null = null
  level: string | null = null
  subject: string | null = null
  description: string | null = null
  selectedFile: File | null = null;
  isShowingFilePreview: boolean = false

  currentStep: number = 1;
  isDragging = false;
  isDropped = false;

  errorMessageForFile: string | null = null;



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

  goToStep(step: number) {
    this.currentStep = step;
  }



  fb = inject(FormBuilder)

  uploadForm: FormGroup = this.fb.group({})

  setFormState() {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: 30,
      category: ['', [Validators.required]],
      level: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      thumbnail: [''],
      fileUrl: ['', [Validators.required]],
      userId: [this.uid, [Validators.required]],
      createdAt: [new Date()],
    })
  }

  // File upload 

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  async handleFileUpload(file: File) {
    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.filePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));

    const storage = getStorage();
    const fileRef = ref(storage, `notes/${file.name}`);

    try {
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      

      this.uploadForm.get('fileUrl')?.setValue(downloadUrl);
    } catch (err) {
      console.error('Upload failed:', err);

    }
  }

  fileUploadOnClick(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      if (input.files[0].type !== 'application/pdf') {
        this.errorMessageForFile = 'Please upload a valid PDF file.';
        return;
      }
      const file = input.files[0];
      this.handleFileUpload(file);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    this.isDropped = true;

    if (event.dataTransfer && event.dataTransfer.files.length === 0) {
      this.errorMessageForFile = 'No file dropped. Please try again.';
      return;
    }

    if(event.dataTransfer && event.dataTransfer.files[0].type !== 'application/pdf') {
      this.errorMessageForFile = 'Please upload a valid PDF file.';
      return;
    }

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.errorMessageForFile = null
      this.handleFileUpload(file);
    }
  }



  //Thumbnail Upload

  async selectThumbnail(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const storage = getStorage();
      const thumbRef = ref(storage, `thumbnail/${file.name}`);

      try {
        await uploadBytes(thumbRef, file);
        const thumbnailUrl = await getDownloadURL(thumbRef);
        this.thumbnailPreviewUrl = thumbnailUrl
        this.uploadForm.get('thumbnail')?.setValue(thumbnailUrl);
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
    this.level = this.uploadForm.get('level')?.value
    this.description = this.uploadForm.get('description')?.value
  }

  // File Preview

  toggleFilePreview() {
    this.isShowingFilePreview = !this.isShowingFilePreview
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
      next: () => this.router.navigate(['/browse']),
      error: (error) => console.log(error)
    })
  }



  //Animation

  phase1Animation() {

    this.goToStep(2)

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

    this.goToStep(3)

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
    this.goToStep(1)
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
    this.goToStep(2)
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
