import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

import { FamilyId } from 'src/app/models/family-id';
import { FamilyIdsService } from 'src/app/services/family-ids.service';

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
  selector: 'app-add-family-ids',
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
  templateUrl: './add-family-ids.component.html',
  styleUrls: ['./add-family-ids.component.scss'],
})
export class AddFamilyIdsComponent implements OnInit {
  headerTitle: string = 'Add Family IDs';
  headerIcon: string = 'pi pi-fw pi-id-card';
  headerLogo: string = 'assets/MSP_Logo2.png';
  cardHeader: string = 'Add Family ID Form';

  id: string = '';
  submitted: boolean = false;

  addFamilyIdForm!: FormGroup;

  allFamilyIds$!: Observable<FamilyId[]>;
  allFamilyIdArray: FamilyId[] = [];
  familyIdNameArray: string[] = [];
  selectedFamilyIdName: string = '';

  states: State[] = STATES;

  constructor(
    private familyIdsService: FamilyIdsService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {
    this.addFamilyIdForm = this.fb.group({
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
    setTimeout(() => {
      this.processFamilyIdNameArray(this.allFamilyIdArray);
    }, 2000);
  }

  get f() {
    return this.addFamilyIdForm.controls;
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
    } else if (this.familyIdNameArray.includes(this.selectedFamilyIdName)) {
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
      this.familyIdsService.addFamilyId(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Family ID Added!',
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
    this.addFamilyIdForm.reset();
    this.ngZone.run(() => {
      this.router.navigate(['family-ids']);
    });
  }
}
