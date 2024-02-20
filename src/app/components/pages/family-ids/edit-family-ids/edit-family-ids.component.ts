import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { FamilyId } from 'src/app/models/family-id';
import { FamilyIdsService } from 'src/app/services/family-ids.service';

import { LoadingService } from 'src/app/services/loading.service';

import { State } from 'src/app/models/state';
import { STATES } from 'src/app/data/state-data';

import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-family-ids',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    BodyComponent,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputMaskModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './edit-family-ids.component.html',
  styleUrls: ['./edit-family-ids.component.scss'],
})
export class EditFamilyIdsComponent implements OnInit {
  headerTitle: string = 'Edit Family IDs';
  headerIcon: string = 'pi pi-fw pi-id-card';
  headerLogo: string = 'assets/MSP_Logo2.png';
  cardHeader: string = 'Edit Family ID Form';

  id: string = '';
  submitted: boolean = false;

  editFamilyIdForm!: FormGroup;

  allFamilyIds$!: Observable<FamilyId[]>;
  allFamilyIdArray: FamilyId[] = [];
  familyIdNameArray: string[] = [];
  selectedFamilyIdName: string = '';
  startingFamilyIdName: string = '';

  familyIdRef: any;

  states: State[] = STATES;

  constructor(
    private familyIdsService: FamilyIdsService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {
    this.editFamilyIdForm = this.fb.group({
      familyIdName: ['', [Validators.required, Validators.minLength(5)]],
      familyIdFullName: ['', [Validators.required, Validators.minLength(6)]],
      familyIdPhone: ['', Validators.required],
      familyIdEmail: ['', Validators.required],
      familyIdAdd1: ['', Validators.required],
      familyIdAdd2: '',
      familyIdCity: ['', Validators.required],
      familyIdState: ['', Validators.required],
      familyIdZipcode: ['', Validators.required],
    });
    this.allFamilyIds$ = this.familyIdsService.getFamilyIds();
    this.allFamilyIds$.subscribe((ids) => {
      this.allFamilyIdArray = ids;
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.familyIdsService.getFamilyId(this.id).subscribe((famId) => {
      this.familyIdRef = famId;
    });
    setTimeout(() => {
      this.processFamilyIdNameArray(this.allFamilyIdArray);
    }, 2000);
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editFamilyIdForm = this.fb.group({
        familyIdName: [this.familyIdRef.familyIdName],
        familyIdFullName: [this.familyIdRef.familyIdFullName],
        familyIdPhone: [this.familyIdRef.familyIdPhone],
        familyIdEmail: [this.familyIdRef.familyIdEmail],
        familyIdAdd1: [this.familyIdRef.familyIdAdd1],
        familyIdAdd2: [this.familyIdRef.familyIdAdd2],
        familyIdCity: [this.familyIdRef.familyIdCity],
        familyIdState: [this.familyIdRef.familyIdState],
        familyIdZipcode: [this.familyIdRef.familyIdZipcode],
      });
      this.startingFamilyIdName = this.familyIdRef.familyIdName;
      this.loadingService.loadingOff();
    }, 2000);
  }

  get f() {
    return this.editFamilyIdForm.controls;
  }

  getFamilyIdNameMessage() {
    return this.f['familyIdName'].hasError('required')
      ? 'You must enter a name'
      : this.f['familyIdName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  getFamilyIdFullNameMessage() {
    return this.f['familyIdFullName'].hasError('required')
      ? 'You must enter a name'
      : this.f['familyIdFullName'].hasError('minlength')
      ? 'Min length 6 characters'
      : '';
  }

  processFamilyIdNameArray(data: FamilyId[]) {
    this.familyIdNameArray = [];
    data.map((el) => this.familyIdNameArray.push(el.familyIdName));
  }

  onSubmit({ value, valid }: { value: FamilyId; valid: boolean }) {
    this.submitted = true;
    this.selectedFamilyIdName = value.familyIdName;
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        life: 3000,
        key: 'error',
      });
    } else if (
      this.familyIdNameArray.includes(this.selectedFamilyIdName) &&
      this.selectedFamilyIdName !== this.startingFamilyIdName
    ) {
      const tempFamilyIdName = this.selectedFamilyIdName;
      this.selectedFamilyIdName = '';
      this.messageService.add({
        severity: 'error',
        summary: `${tempFamilyIdName} is already in use.`,
        detail: 'Please choose another name',
        life: 3000,
        key: 'error',
      });
    } else {
      this.familyIdsService.updateFamilyId(this.id, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Family ID Updated!',
        life: 3000,
        key: 'success',
      });
    }
  }

  goToFamilyIds() {
    this.ngZone.run(() => {
      this.router.navigate(['family-ids']);
    });
  }

  cancelAddFamilyID() {
    this.editFamilyIdForm.reset();
    this.ngZone.run(() => {
      this.router.navigate(['family-ids']);
    });
  }
}
