import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../common/header/header.component';
import { BodyComponent } from '../../common/body/body.component';
import { CardComponent } from '../../common/card/card.component';

import { VolunteerTableComponent } from './volunteer-table/volunteer-table.component';

import { ButtonModule } from 'primeng/button';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-volunteers',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    VolunteerTableComponent,
    ButtonModule,
  ],
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.scss'],
})
export class VolunteersComponent implements OnInit {
  headerTitle: string = 'Volunteers';
  headerIcon: string = 'pi pi-fw pi-users';
  headerBtnToolTip: string = 'Add Volunteer';
  headerBtnIcon: string = 'pi pi-fw pi-user-plus';
  headerBtnVisible: boolean = true;
  headerLogo: string = 'assets/MSP_Logo2.png';

  cardHeader: string = 'Volunteers List';

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  addVolunteer() {
    this.ngZone.run(() => {
      this.router.navigate(['add-volunteer']);
    });
  }
}
