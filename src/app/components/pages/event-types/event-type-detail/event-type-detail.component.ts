import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { EventType } from 'src/app/models/event-type';
import { EventTypeService } from 'src/app/services/event-type.service';

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
  selector: 'app-event-type-detail',
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
  templateUrl: './event-type-detail.component.html',
  styleUrls: ['./event-type-detail.component.scss'],
})
export class EventTypeDetailComponent {
  headerTitle: string = 'Event Type Details';
  headerIcon: string = 'pi pi-fw pi-calendar';
  headerLogo: string = 'assets/MSP_Logo2.png';

  id: string = '';

  eventType$!: Observable<EventType>;

  eventType: EventType = {
    id: '',
    eventTypeName: '',
    requiredMinistries: [],
  };

  constructor(
    private eventTypeService: EventTypeService,
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
    this.eventTypeService.getEventType(this.id).subscribe((eventType) => {
      this.eventType = eventType;
    });
  }

  goToEventTypes() {
    this.ngZone.run(() => {
      this.router.navigate(['event-types']);
    });
  }

  editEventType() {
    this.ngZone.run(() => {
      this.router.navigate([`edit-event-type/${this.id}`]);
    });
  }

  deleteEventType() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?  This cannot be undone!',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Event Type Deleted!!',
        });
        this.eventTypeService.deleteEventType(this.id);
        this.goToEventTypes();
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Event Type deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Event Type deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
