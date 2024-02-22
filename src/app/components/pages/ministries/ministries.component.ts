import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../common/header/header.component';
import { BodyComponent } from '../../common/body/body.component';
import { CardComponent } from '../../common/card/card.component';

import { MinistryTableComponent } from './ministry-table/ministry-table.component';

import { ButtonModule } from 'primeng/button';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-ministries',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    MinistryTableComponent,
    ButtonModule,
  ],
  templateUrl: './ministries.component.html',
  styleUrls: ['./ministries.component.scss'],
})
export class MinistriesComponent implements OnInit {
  headerTitle: string = 'Ministry Types';
  headerIcon: string = 'pi pi-fw pi-heart';
  headerBtnToolTip: string = 'Add Ministiry Type';
  headerBtnIcon: string = 'pi pi-fw pi-plus';
  headerBtnVisible: boolean = true;
  headerLogo: string = 'assets/MSP_Logo2.png';

  cardHeader: string = 'Ministry Types List';

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  addMinistry() {
    this.ngZone.run(() => {
      this.router.navigate(['add-ministries']);
    });
  }
}
