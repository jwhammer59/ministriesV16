import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard {
  private auth: Auth = inject(Auth);
  private router = inject(Router);

  user$ = user(this.auth);

  constructor() {}

  canActivate(): Observable<boolean> {
    return this.user$.pipe(
      map((auth) => {
        if (!auth) {
          this.router.navigate(['/login']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
