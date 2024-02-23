import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../common/header/header.component';
import { BodyComponent } from '../../common/body/body.component';
import { CardComponent } from '../../common/card/card.component';

import { EventTypeTableComponent } from './event-type-table/event-type-table.component';

import { ButtonModule } from 'primeng/button';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-event-types',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    EventTypeTableComponent,
    ButtonModule,
  ],
  templateUrl: './event-types.component.html',
  styleUrls: ['./event-types.component.scss'],
})
export class EventTypesComponent implements OnInit {
  headerTitle: string = 'Event Types';
  headerIcon: string = 'pi pi-fw pi-heart';
  headerBtnToolTip: string = 'Add Event Type';
  headerBtnIcon: string = 'pi pi-fw pi-plus';
  headerBtnVisible: boolean = true;
  headerLogo: string = 'assets/MSP_Logo2.png';

  cardHeader: string = 'Event Types List';

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  addEventType() {
    this.ngZone.run(() => {
      this.router.navigate(['add-event-type']);
    });
  }
}
