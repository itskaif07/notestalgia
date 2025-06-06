import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCwGLnBqMwvQFJjn9wYZN5n4qUCYZp-_dU",
  authDomain: "notestalgia-45cd7.firebaseapp.com",
  projectId: "notestalgia-45cd7",
  storageBucket: "notestalgia-45cd7.firebasestorage.app",
  messagingSenderId: "594178840117",
  appId: "1:594178840117:web:348480457167501a46c37c",
  measurementId: "G-EWC8LSGX7W"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideFirebaseApp(() => initializeApp(firebaseConfig)), provideAuth(() => getAuth())
  ]
};
