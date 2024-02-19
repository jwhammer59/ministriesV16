import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { Organization } from 'src/app/models/organization';
import { OrganizationsService } from 'src/app/services/organizations.service';

import { LoadingService } from 'src/app/services/loading.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { PrimeNGConfig, MessageService } from 'primeng/api';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BodyComponent,
    ButtonModule,
    CardModule,
    DialogModule,
    InputMaskModule,
    InputNumberModule,
    ToastModule,
    ToolbarModule,
  ],
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss'],
})
export class OrganizationsComponent implements OnInit {
  headerTitle: string = 'Organization Info';
  headerIcon: string = 'pi pi-building';
  buttonVisible: boolean = false;
  headerLogo: string = 'assets/MSP_Logo2.jpg';

  id: string = '';

  organizations: Organization[] = [];

  organization: Organization = {
    id: '1',
    orgName: '',
    orgPastorName: '',
    orgOfficeMgrName: '',
    orgAddress1: '',
    orgAddress2: '',
    orgCity: '',
    orgEmail: '',
    orgPhone: '',
    orgState: '',
    orgWebsite: '',
    orgZipcode: 0,
  };

  constructor(
    private organizationService: OrganizationsService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private ngZone: NgZone,
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {
    this.organizationService.getOrganizations().subscribe((org) => {
      this.organizations = org;
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.loadingService.loadingOn();
    setTimeout(() => {
      if (this.organizations.length > 0) {
        this.organization = this.organizations[0];
        this.id = this.organization.id!;
      }

      this.loadingService.loadingOff();
    }, 2000);
  }

  onSubmit(val: Organization, id: string) {
    if (this.organization.orgName === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Organization Name Required',
        life: 3000,
      });
    } else {
      this.organizationService.updateOrganization(id, val);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Organization Updated',
        life: 3000,
      });
    }
  }
}
