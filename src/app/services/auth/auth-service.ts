import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, updateProfile } from '@angular/fire/auth';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);

 
  signUp(email: string, password: string, name: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credentials => {
        if (credentials) {
          return from(
            sendEmailVerification(credentials.user).then(() => {
              updateProfile(credentials.user, { displayName: name })
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