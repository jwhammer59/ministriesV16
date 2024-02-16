import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  currentLoggedInUserId: string = '';

  constructor() {}

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password).then(
        (userData) => resolve(userData),
        (err) => reject(err)
      );
    });
  }

  getAuth() {
    return this.auth.currentUser;
  }

  logout() {
    this.auth.signOut();
  }
}
