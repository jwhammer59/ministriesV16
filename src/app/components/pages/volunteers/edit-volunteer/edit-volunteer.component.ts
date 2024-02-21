import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { Volunteer } from 'src/app/models/volunteer';
import { VolunteersService } from 'src/app/services/volunteers.service';

import { FamilyId } from 'src/app/models/family-id';
import { FamilyIdsService } from 'src/app/services/family-ids.service';

import { Ministry } from 'src/app/models/ministry';
import { MinistryService } from 'src/app/services/ministry.service';

import { LoadingService } from 'src/app/services/loading.service';

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
import { PickListModule } from 'primeng/picklist';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-volunteer',
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
    PickListModule,
    TabViewModule,
    ToastModule,
  ],
  templateUrl: './edit-volunteer.component.html',
  styleUrls: ['./edit-volunteer.component.scss'],
})
export class EditVolunteerComponent {
  headerTitle: string = 'Edit Volunteer';
  headerIcon: string = 'pi pi-fw pi-user-plus';
  headerLogo: string = 'assets/MSP_Logo2.png';

  id: string = '';
  submitted: boolean = false;

  editVolunteerForm!: FormGroup;

  allVolunteers$!: Observable<Volunteer[]>;
  volunteerRef: any;

  allFamilyIds$!: Observable<FamilyId[]>;

  sourceMinistries: Ministry[] = [];
  targetMinistries: Ministry[] = [];

  states: State[] = STATES;

  constructor(
    private volunteersService: VolunteersService,
    private ministryService: MinistryService,
    private familyIdsService: FamilyIdsService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {
    this.editVolunteerForm = this.fb.group({
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
    this.ministryService.getMinistries().subscribe((data) => {
      this.sourceMinistries = data;
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.volunteersService.getVolunteer(this.id).subscribe((vol) => {
      this.volunteerRef = vol;
    });
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editVolunteerForm = this.fb.group({
        firstName: [this.volunteerRef.firstName],
        middleInit: [this.volunteerRef.middleInit],
        lastName: [this.volunteerRef.lastName],
        phone: [this.volunteerRef.phone],
        email: [this.volunteerRef.email],
        address1: [this.volunteerRef.address1],
        address2: [this.volunteerRef.address2],
        city: [this.volunteerRef.city],
        state: [this.volunteerRef.state],
        zipcode: [this.volunteerRef.zipcode],
        familyID: [this.volunteerRef.familyID],
        ministries: [this.volunteerRef.ministries],
        isActive: [this.volunteerRef.isActive],
        isFamilyIDHead: [this.volunteerRef.isFamilyIDHead],
      });
      this.targetMinistries =
        this.editVolunteerForm.controls['ministries'].value;
      this.loadingService.loadingOff();
    }, 2000);
  }

  get f() {
    return this.editVolunteerForm.controls;
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

  onSubmit({ value, valid }: { value: FamilyId; valid: boolean }) {
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
      this.volunteersService.updateVolunteer(this.id, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Volunteer Updated!',
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

  cancelEditVolunteer() {
    this.editVolunteerForm.reset();
    this.ngZone.run(() => {
      this.router.navigate(['volunteers']);
    });
  }

  sendToMinistriesTarget() {
    this.f['ministries'].setValue(this.targetMinistries);
  }

  sendToMinistriesSource() {
    this.f['ministries'].setValue(this.targetMinistries);
  }
}
