import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { EventMinistry } from 'src/app/models/event-ministry';
import { EventMinistryService } from 'src/app/services/event-ministry.service';

import { Ministry } from 'src/app/models/ministry';
import { MinistryService } from 'src/app/services/ministry.service';

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
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-event-ministries',
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
    ToastModule,
  ],
  templateUrl: './add-event-ministries.component.html',
  styleUrls: ['./add-event-ministries.component.scss'],
})
export class AddEventMinistriesComponent implements OnInit {
  headerTitle: string = 'Add Ministry Event';
  headerIcon: string = 'pi pi-fw pi-heart';
  headerLogo: string = 'assets/MSP_Logo2.png';
  cardHeader: string = 'Add Ministry Event Form';

  id: string = '';
  submitted: boolean = false;

  addEventMinistryForm!: FormGroup;

  allEventMinistries$!: Observable<EventMinistry[]>;
  allEventMinistryArray: EventMinistry[] = [];
  eventMinistryNameArray: string[] = [];
  selectedEventMinistryName: string = '';

  allMinistries$!: Observable<Ministry[]>;

  constructor(
    private eventMinistryService: EventMinistryService,
    private ministryService: MinistryService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {
    this.addEventMinistryForm = this.fb.group({
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
    setTimeout(() => {
      this.processEventMinistryNameArray(this.allEventMinistryArray);
    }, 2000);
  }

  get f() {
    return this.addEventMinistryForm.controls;
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
      this.eventMinistryService.addEventMinistry(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Event Ministry Added!',
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
}
