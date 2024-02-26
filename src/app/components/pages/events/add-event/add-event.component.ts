import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';

import { EventType } from 'src/app/models/event-type';
import { EventTypeService } from 'src/app/services/event-type.service';

import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PickListModule } from 'primeng/picklist';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    BodyComponent,
    ButtonModule,
    CardModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputMaskModule,
    InputTextModule,
    PickListModule,
    TabViewModule,
    ToastModule,
  ],
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent implements OnInit {
  headerTitle: string = 'Add Events';
  headerIcon: string = 'pi pi-fw pi-calendar-plus';
  headerLogo: string = 'assets/MSP_Logo2.png';

  id: string = '';
  submitted: boolean = false;

  addEventForm!: FormGroup;

  allEvents$!: Observable<Event[]>;
  allEventTypes$!: Observable<EventType[]>;

  constructor(
    private eventsService: EventsService,
    private eventTypeService: EventTypeService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {
    this.addEventForm = this.fb.group({
      eventName: ['', [Validators.required, Validators.minLength(5)]],
      eventType: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventReqMinistries: [],
      eventSchedVols: [],
      eventIsFull: false,
    });
    this.allEventTypes$ = this.eventTypeService.getEventTypes();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  get f() {
    return this.addEventForm.controls;
  }

  getEventNameMessage() {
    return this.f['eventName'].hasError('required')
      ? 'You must enter a name'
      : this.f['eventName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  onSubmit({ value, valid }: { value: Event; valid: boolean }) {
    this.submitted = true;
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        life: 3000,
        key: 'error',
      });
    } else {
      this.eventsService.addEvent(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Event Added!',
        life: 3000,
        key: 'success',
      });
    }
  }

  goToEvents() {
    this.ngZone.run(() => {
      this.router.navigate(['events']);
    });
  }

  cancelAddEvent() {
    this.addEventForm.reset();
    this.goToEvents();
  }
}
