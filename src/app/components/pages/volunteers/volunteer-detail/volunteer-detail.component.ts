import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { Volunteer } from 'src/app/models/volunteer';
import { VolunteersService } from 'src/app/services/volunteers.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

import {
  PrimeNGConfig,
  MessageService,
  ConfirmationService,
  ConfirmEventType,
} from 'primeng/api';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-volunteer-detail',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BodyComponent,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    TabViewModule,
    ToastModule,
  ],
  templateUrl: './volunteer-detail.component.html',
  styleUrls: ['./volunteer-detail.component.scss'],
})
export class VolunteerDetailComponent implements OnInit {
  headerTitle: string = 'Volunteer Details';
  headerIcon: string = 'pi pi-fw pi-user';
  headerLogo: string = 'assets/MSP_Logo2.png';

  id: string = '';

  volunteer$!: Observable<Volunteer>;

  volunteer: Volunteer = {
    id: '',
    firstName: '',
    middleInit: '',
    lastName: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    ministries: [],
    familyID: '',
    isActive: false,
    isFamilyIDHead: false,
  };

  constructor(
    private volunteersService: VolunteersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.volunteer$ = this.volunteersService.getVolunteer(this.id);
    this.volunteersService.getVolunteer(this.id).subscribe((vol) => {
      this.volunteer = vol;
    });
  }

  goToVolunteers() {
    this.ngZone.run(() => {
      this.router.navigate(['volunteers']);
    });
  }

  editVolunteer() {
    this.ngZone.run(() => {
      this.router.navigate([`edit-volunteer/${this.id}`]);
    });
  }

  deleteVolunteer() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?  This cannot be undone!',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Volunteer Deleted!!',
        });
        this.volunteersService.deleteVolunteer(this.id);
        this.goToVolunteers();
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Volunteer deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Volunteer deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
