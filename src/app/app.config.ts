import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { HttpClient, provideHttpClient } from '@angular/common/http';

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
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // ✅ scrolls to top on route change
        anchorScrolling: 'enabled',           // ✅ scrolls to #anchor links if used
      }),
      withViewTransitions()
    ),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
