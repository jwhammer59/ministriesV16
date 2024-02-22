import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../common/header/header.component';
import { BodyComponent } from '../../common/body/body.component';
import { CardComponent } from '../../common/card/card.component';

import { EventMinistriesTableComponent } from './event-ministries-table/event-ministries-table.component';

import { ButtonModule } from 'primeng/button';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-event-ministries',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    EventMinistriesTableComponent,
    ButtonModule,
  ],
  templateUrl: './event-ministries.component.html',
  styleUrls: ['./event-ministries.component.scss'],
})
export class EventMinistriesComponent implements OnInit {
  headerTitle: string = 'Event Ministries';
  headerIcon: string = 'pi pi-fw pi-users';
  headerBtnToolTip: string = 'Add Event Ministry';
  headerBtnIcon: string = 'pi pi-fw pi-plus';
  headerBtnVisible: boolean = true;
  headerLogo: string = 'assets/MSP_Logo2.png';

  cardHeader: string = 'Event Minstries List';

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
      this.router.navigate(['add-event-ministry']);
    });
  }
}
