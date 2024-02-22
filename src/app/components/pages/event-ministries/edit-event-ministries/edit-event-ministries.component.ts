import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { EventMinistry } from 'src/app/models/event-ministry';
import { EventMinistryService } from 'src/app/services/event-ministry.service';

import { Ministry } from 'src/app/models/ministry';
import { MinistryService } from 'src/app/services/ministry.service';

import { LoadingService } from 'src/app/services/loading.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

import {
  PrimeNGConfig,
  MessageService,
  ConfirmationService,
  ConfirmEventType,
} from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-event-ministries',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    BodyComponent,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    DropdownModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './edit-event-ministries.component.html',
  styleUrls: ['./edit-event-ministries.component.scss'],
})
export class EditEventMinistriesComponent {
  headerTitle: string = 'Edit Event Ministry';
  headerIcon: string = 'pi pi-fw pi-pencil';
  headerLogo: string = 'assets/MSP_Logo2.png';
  cardHeader: string = 'Edit Event Ministry Form';

  id: string = '';
  submitted: boolean = false;

  editEventMinistryForm!: FormGroup;

  allEventMinistries$!: Observable<EventMinistry[]>;
  allEventMinistryArray: EventMinistry[] = [];
  eventMinistryNameArray: string[] = [];
  selectedEventMinistryName: string = '';

  allMinistries$!: Observable<Ministry[]>;

  eventMinistryRef: any;

  eventMinistry: EventMinistry = {
    id: '',
    eventMinistryName: '',
    ministryName: '',
  };

  constructor(
    private eventMinistryService: EventMinistryService,
    private ministryService: MinistryService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {
    this.editEventMinistryForm = this.fb.group({
      eventMinistryName: ['', [Validators.required, Validators.minLength(5)]],
      ministryName: ['', Validators.required],
    });
    this.allEventMinistries$ = this.eventMinistryService.getEventMinistries();
    this.allEventMinistries$.subscribe((eventMinistries) => {
      this.allEventMinistryArray = eventMinistries;
    });
    this.allMinistries$ = this.ministryService.getMinistries();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.eventMinistryService
      .getEventMinistry(this.id)
      .subscribe((eventMinistry) => {
        this.eventMinistryRef = eventMinistry;
      });
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editEventMinistryForm = this.fb.group({
        id: [this.eventMinistryRef.id],
        eventMinistryName: [this.eventMinistryRef.eventMinistryName],
        ministryName: [this.eventMinistryRef.ministryName],
      });
      this.loadingService.loadingOff();
      this.processEventMinistryNameArray(this.allEventMinistryArray);
    }, 3000);
  }

  get f() {
    return this.editEventMinistryForm.controls;
  }

  getEventMinistryNameMessage() {
    return this.f['eventMinistryName'].hasError('required')
      ? 'You must enter a name'
      : this.f['eventMinistryName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  processEventMinistryNameArray(data: EventMinistry[]) {
    this.eventMinistryNameArray = [];
    data.map((el) => this.eventMinistryNameArray.push(el.eventMinistryName));
  }

  onSubmit({ value, valid }: { value: EventMinistry; valid: boolean }) {
    this.submitted = true;
    this.selectedEventMinistryName = value.eventMinistryName;
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        life: 3000,
        key: 'error',
      });
    } else if (
      this.eventMinistryNameArray.includes(this.selectedEventMinistryName)
    ) {
      const tempEventMinistryName = this.selectedEventMinistryName;
      this.selectedEventMinistryName = '';
      this.messageService.add({
        severity: 'error',
        summary: `${tempEventMinistryName} is already in use.`,
        detail: 'Please choose another name',
        life: 3000,
        key: 'error',
      });
    } else {
      this.eventMinistryService.updateEventMinistry(this.id, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Event Ministry Updated!',
        life: 3000,
        key: 'success',
      });
    }
  }

  goToEventMinistries() {
    this.ngZone.run(() => {
      this.router.navigate(['event-ministries']);
    });
  }

  deleteEventMinisitry() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?  This cannot be undone!',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Event Ministry Deleted!!',
        });
        this.eventMinistryService.deleteEventMinistry(this.id);
        this.goToEventMinistries();
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Event Ministry deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Event Ministry deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
