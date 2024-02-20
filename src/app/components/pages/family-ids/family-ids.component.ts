import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from '../../common/header/header.component';
import { BodyComponent } from '../../common/body/body.component';
import { CardComponent } from '../../common/card/card.component';

import { FamilyIdTableComponent } from './family-id-table/family-id-table.component';

import { ButtonModule } from 'primeng/button';

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-family-ids',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    CardComponent,
    FamilyIdTableComponent,
    ButtonModule,
  ],
  templateUrl: './family-ids.component.html',
  styleUrls: ['./family-ids.component.scss'],
})
export class FamilyIdsComponent implements OnInit {
  headerTitle: string = 'Family IDs';
  headerIcon: string = 'pi pi-fw pi-id-card';
  headerBtnToolTip: string = 'Add Family ID';
  headerBtnIcon: string = 'pi pi-fw pi-plus';
  headerBtnVisible: boolean = true;
  headerLogo: string = 'assets/MSP_Logo2.png';

  cardHeader: string = 'Family IDs List';

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
      this.router.navigate(['add-family-ids']);
    });
  }
}
