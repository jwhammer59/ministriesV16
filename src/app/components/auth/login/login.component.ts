import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, User, user } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private auth: Auth = inject(Auth);
  private router = inject(Router);

  loginForm!: FormGroup;
  submitted: boolean = false;

  loggedInUserID: any;

  user$ = user(this.auth);
  userSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private primengConfig: PrimeNGConfig
  ) {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      if (aUser) {
        this.loggedInUserID = aUser.email;
        this.router.navigate(['dashboard']);
      }
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  getEmailErrorMessage() {
    return this.f['email'].hasError('required')
      ? 'You must enter a value'
      : this.f['email'].hasError('email')
      ? 'Not a valid email'
      : '';
  }

  getPasswordErrorMessage() {
    return this.f['password'].hasError('required')
      ? 'You must enter a value'
      : this.f['password'].hasError('minlength')
      ? 'Password must be at least 6 characters'
      : '';
  }

  onSubmit({ value, valid }: { value: User; valid: boolean }) {
    this.authService
      .login(this.f['email'].value, this.f['password'].value)
      .then((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Congratulations you are logged in!',
          life: 3000,
        });
        this.router.navigate(['dashboard']);
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Unauthorized User',
          detail: 'You must register!',
          life: 3000,
        });
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
