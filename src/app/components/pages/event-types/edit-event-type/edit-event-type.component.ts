import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { EventType } from 'src/app/models/event-type';
import { EventTypeService } from 'src/app/services/event-type.service';

import { EventMinistry } from 'src/app/models/event-ministry';
import { EventMinistryService } from 'src/app/services/event-ministry.service';

import { LoadingService } from 'src/app/services/loading.service';

import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PickListModule } from 'primeng/picklist';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-event-type',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    BodyComponent,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    PickListModule,
    ToastModule,
  ],
  templateUrl: './edit-event-type.component.html',
  styleUrls: ['./edit-event-type.component.scss'],
})
export class EditEventTypeComponent implements OnInit {
  headerTitle: string = 'Edit Event Type';
  headerIcon: string = 'pi pi-fw pi-pencil';
  headerLogo: string = 'assets/MSP_Logo2.png';
  cardHeader: string = 'Edit Event Type Form';

  id: string = '';
  submitted: boolean = false;

  editEventTypeForm!: FormGroup;

  allEventTypes$!: Observable<EventType[]>;
  eventTypeRef: any;

  allEventTypesArray: EventType[] = [];
  eventTypeNameArray: string[] = [];
  selectedEventTypeName: string = '';

  sourceMinistries: EventMinistry[] = [];
  targetMinistries: EventMinistry[] = [];

  constructor(
    private eventTypeService: EventTypeService,
    private eventMinistryService: EventMinistryService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {
    this.editEventTypeForm = this.fb.group({
      eventTypeName: ['', [Validators.required, Validators.minLength(5)]],
      requiredMinistries: [],
    });
    this.allEventTypes$ = this.eventTypeService.getEventTypes();
    this.allEventTypes$.subscribe((eventTypes) => {
      this.allEventTypesArray = eventTypes;
    });
    this.eventMinistryService.getEventMinistries().subscribe((data) => {
      this.sourceMinistries = data;
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.eventTypeService.getEventType(this.id).subscribe((eventType) => {
      this.eventTypeRef = eventType;
    });
    setTimeout(() => {
      this.processEventTypeArray(this.allEventTypesArray);
    }, 2000);
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editEventTypeForm = this.fb.group({
        eventTypeName: [this.eventTypeRef.eventTypeName],
        requiredMinistries: [this.eventTypeRef.requiredMinistries],
      });
      this.targetMinistries =
        this.editEventTypeForm.controls['requiredMinistries'].value;
      this.processSourceMinistries();
      this.loadingService.loadingOff();
    }, 2000);
  }

  processSourceMinistries() {
    // Remove id's from Volunteers current ministry list
    let ministriesToFilter: string[] = this.targetMinistries.map(
      (ministry) => ministry.id!
    );

    // Filter Source Ministiries to only include ministries that are
    // not already belonging to volunteer
    let tempMinistires = this.sourceMinistries.filter((ministry) => {
      return ministriesToFilter.indexOf(ministry.id!) == -1;
    });
    // Set Source Ministries in Form
    this.sourceMinistries = tempMinistires;
  }

  get f() {
    return this.editEventTypeForm.controls;
  }

  getEventTypeNameMessage() {
    return this.f['eventTypeName'].hasError('required')
      ? 'You must enter a name'
      : this.f['eventTypeName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  processEventTypeArray(data: EventType[]) {
    this.eventTypeNameArray = [];
    data.map((el) => this.eventTypeNameArray.push(el.eventTypeName));
  }

  onSubmit({ value, valid }: { value: EventType; valid: boolean }) {
    this.submitted = true;
    this.selectedEventTypeName = value.eventTypeName;
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        life: 3000,
        key: 'error',
      });
    } else if (this.eventTypeNameArray.includes(this.selectedEventTypeName)) {
      const tempEventTypeName = this.selectedEventTypeName;
      this.selectedEventTypeName = '';
      this.messageService.add({
        severity: 'error',
        summary: `${tempEventTypeName} is already in use.`,
        detail: 'Please choose another name',
        life: 3000,
        key: 'error',
      });
    } else {
      this.eventTypeService.updateEventType(this.id, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Event Type Updated!',
        life: 3000,
        key: 'success',
      });
    }
  }

  goToEventTypes() {
    this.ngZone.run(() => {
      this.router.navigate(['event-types']);
    });
  }

  sendToEventTypesTarget() {
    this.f['requiredMinistries'].setValue(this.targetMinistries);
  }

  sendToEventTypesSource() {
    this.f['requiredMinistries'].setValue(this.targetMinistries);
  }
}
