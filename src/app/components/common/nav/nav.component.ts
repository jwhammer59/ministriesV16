import { Component, inject, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, authState, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnDestroy {
  @Input() navTitle: string = 'Ministries Scheduler Pro';
  @Input() navLogo: string = 'assets/MSP_Logo2.png';

  auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription!: Subscription;

  loggedInStatus: boolean = false;
  loggedInUser!: string | null;
  loggedInUserId: string = '';

  loggedInItems: MenuItem[] = [
    {
      label: 'Log Out',
      icon: 'pi pi-fw pi-sign-out',
      command: (event) => {
        this.logOut();
      },
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-table',
      routerLink: ['dashboard'],
    },
    {
      label: 'Events',
      icon: 'pi pi-fw pi-calendar',
      items: [
        {
          label: 'Events',
          icon: 'pi pi-fw pi-calendar',
          routerLink: ['events'],
        },
        {
          label: 'Add Event',
          icon: 'pi pi-fw pi-calendar-plus',
          routerLink: ['add-event'],
        },
      ],
    },
    {
      label: 'Volunteers',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Volunteers',
          icon: 'pi pi-fw pi-users',
          routerLink: ['volunteers'],
        },
        {
          label: 'Add Volunteer',
          icon: 'pi pi-fw pi-user-plus',
          routerLink: ['add-volunteer'],
        },
      ],
    },
    {
      separator: true,
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'Organization',
          icon: 'pi pi-fw pi-building',
          routerLink: ['organizations'],
        },
        {
          label: 'Family IDs',
          icon: 'pi pi-fw pi-id-card',
          routerLink: ['family-ids'],
        },
        {
          label: 'Ministries',
          icon: 'pi pi-fw pi-heart',
          routerLink: ['ministries'],
        },
      ],
    },
  ];

  loggedOutItems: MenuItem[] = [
    {
      label: 'Login',
      icon: 'pi pi-fw pi-sign-in',
      routerLink: ['login'],
    },
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.authStateSubscription = this.authState$.subscribe(
      (aUser: User | null) => {
        if (aUser) {
          this.loggedInUser = aUser.email;
          this.loggedInUserId = aUser.uid;
          this.loggedInStatus = true;
        }
      }
    );
  }

  logOut() {
    this.loggedInUser = '';
    this.loggedInStatus = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.authStateSubscription.unsubscribe();
  }
}
