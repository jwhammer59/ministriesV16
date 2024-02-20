import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { Volunteer } from 'src/app/models/volunteer';
import { VolunteersService } from 'src/app/services/volunteers.service';

import { FamilyId } from 'src/app/models/family-id';
import { FamilyIdsService } from 'src/app/services/family-ids.service';

import { State } from 'src/app/models/state';
import { STATES } from 'src/app/data/state-data';

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
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-volunteer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    BodyComponent,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DropdownModule,
    InputMaskModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './add-volunteer.component.html',
  styleUrls: ['./add-volunteer.component.scss'],
})
export class AddVolunteerComponent implements OnInit {
  headerTitle: string = 'Add Volunteers';
  headerIcon: string = 'pi pi-fw pi-user-plus';
  headerLogo: string = 'assets/MSP_Logo2.png';
  cardHeader: string = 'Add Volunteers Form';

  id: string = '';
  submitted: boolean = false;

  addVolunteerForm!: FormGroup;

  allVolunteers$!: Observable<Volunteer[]>;

  allFamilyIds$!: Observable<FamilyId[]>;

  states: State[] = STATES;

  constructor(
    private volunteersService: VolunteersService,
    private familyIdsService: FamilyIdsService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {
    this.addVolunteerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      middleInit: '',
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      address1: ['', Validators.required],
      address2: '',
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      familyID: ['', Validators.required],
      ministries: [],
      isActive: false,
      isFamilyIDHead: false,
    });
    this.allFamilyIds$ = this.familyIdsService.getFamilyIds();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  get f() {
    return this.addVolunteerForm.controls;
  }

  getFirstNameMessage() {
    return this.f['firstName'].hasError('required')
      ? 'You must enter a name'
      : this.f['firstName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  getLastNameMessage() {
    return this.f['lastName'].hasError('required')
      ? 'You must enter a name'
      : this.f['lastName'].hasError('minlength')
      ? 'Min length 6 characters'
      : '';
  }

  onSubmit({ value, valid }: { value: Volunteer; valid: boolean }) {
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
      this.volunteersService.addVolunteer(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Volunteer Added!',
        life: 3000,
        key: 'success',
      });
    }
  }

  goToVolunteers() {
    this.ngZone.run(() => {
      this.router.navigate(['volunteers']);
    });
  }

  cancelAddVolunteer() {
    this.addVolunteerForm.reset();
    this.goToVolunteers();
  }
}
