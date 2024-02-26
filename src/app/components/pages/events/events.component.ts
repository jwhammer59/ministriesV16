import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../common/header/header.component';
import { BodyComponent } from '../../common/body/body.component';
import { CardComponent } from '../../common/card/card.component';

import { EventTableComponent } from './event-table/event-table.component';

import { ButtonModule } from 'primeng/button';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    EventTableComponent,
    ButtonModule,
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  headerTitle: string = 'Events';
  headerIcon: string = 'pi pi-fw pi-calendar';
  headerBtnToolTip: string = 'Add Event';
  headerBtnIcon: string = 'pi pi-fw pi-calendar-plus';
  headerBtnVisible: boolean = true;
  headerLogo: string = 'assets/MSP_Logo2.png';

  cardHeader: string = 'Events List';

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  addEvent() {
    this.ngZone.run(() => {
      this.router.navigate(['add-event']);
    });
  }
}
