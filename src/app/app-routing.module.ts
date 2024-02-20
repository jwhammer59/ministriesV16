import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/pages/welcome/welcome.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './components/auth/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'organizations',
    loadComponent: () =>
      import('./components/pages/organizations/organizations.component').then(
        (m) => m.OrganizationsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'family-ids',
    loadComponent: () =>
      import('./components/pages/family-ids/family-ids.component').then(
        (m) => m.FamilyIdsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-family-ids',
    loadComponent: () =>
      import(
        './components/pages/family-ids/add-family-ids/add-family-ids.component'
      ).then((m) => m.AddFamilyIdsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-family-id/:id',
    loadComponent: () =>
      import(
        './components/pages/family-ids/edit-family-ids/edit-family-ids.component'
      ).then((m) => m.EditFamilyIdsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'ministries',
    loadComponent: () =>
      import('./components/pages/ministries/ministries.component').then(
        (m) => m.MinistriesComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-ministries',
    loadComponent: () =>
      import(
        './components/pages/ministries/add-ministries/add-ministries.component'
      ).then((m) => m.AddMinistriesComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-ministry/:id',
    loadComponent: () =>
      import(
        './components/pages/ministries/edit-ministries/edit-ministries.component'
      ).then((m) => m.EditMinistriesComponent),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
