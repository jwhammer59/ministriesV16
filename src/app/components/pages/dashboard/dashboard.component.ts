import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../../common/header/header.component';
import { BodyComponent } from '../../common/body/body.component';
import { CardComponent } from '../../common/card/card.component';

import { VolunteerTableComponent } from '../volunteers/volunteer-table/volunteer-table.component';

import { MinistryTableComponent } from '../ministries/ministry-table/ministry-table.component';

import { FamilyIdTableComponent } from '../family-ids/family-id-table/family-id-table.component';

import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    VolunteerTableComponent,
    MinistryTableComponent,
    FamilyIdTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  headerTitle: string = 'Dashboard';
  headerIcon: string = 'pi pi-fw pi-list';
  headerLogo: string = 'assets/MSP_Logo2.png';
}
