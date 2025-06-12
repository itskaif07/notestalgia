import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from '@angular/fire/auth';
import { BehaviorSubject, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);

  userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  user$: Observable<any> = this.userSubject.asObservable();

  constructor() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.userSubject.next(user);
      } else {
        this.userSubject.next(null);
      }
    })
  }

  getCurrentUser(): Observable<any> {
    return this.user$;
  }

  isLoggedIn$ = authState(this.auth).pipe(
    map(user => !!user) // Convert user object to boolean
  )

  logInAsGuest(){
    return from(signInAnonymously(this.auth))
  }



  signUp(email: string, password: string, fullName: string): Observable<any> {

    const actionCodeSettings = {
      url: 'http://localhost:4200/',
      handleCodeInApp: true
    }

    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credentials => {
        if (credentials) {
          return from(
            sendEmailVerification(credentials.user, actionCodeSettings).then(() => {
              updateProfile(credentials.user, { displayName: fullName, photoURL: credentials.user.photoURL })
            })
          )
        }
        return of(null)
      }))
    )
  }



  logIn(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
  }

  logOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  googleSignUp(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((credentials) => {
        if (credentials) {
          return from(updateProfile(credentials.user, { displayName: credentials.user.displayName, photoURL: credentials.user.photoURL }))
        }
        return of(null)
      })
    )
  }
}