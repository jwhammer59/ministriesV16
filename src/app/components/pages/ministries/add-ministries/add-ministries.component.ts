import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { HeaderComponent } from 'src/app/components/common/header/header.component';
import { BodyComponent } from 'src/app/components/common/body/body.component';

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
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

import { PrimeNGConfig, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-ministries',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    BodyComponent,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './add-ministries.component.html',
  styleUrls: ['./add-ministries.component.scss'],
})
export class AddMinistriesComponent implements OnInit {
  headerTitle: string = 'Add Ministry';
  headerIcon: string = 'pi pi-fw pi-heart';
  headerLogo: string = 'assets/MSP_Logo2.png';
  cardHeader: string = 'Add Ministry Form';

  id: string = '';
  submitted: boolean = false;

  addMinistryForm!: FormGroup;

  allMinistries$!: Observable<Ministry[]>;
  allMinistryArray: Ministry[] = [];
  ministryNameArray: string[] = [];
  selectedMinistryName: string = '';

  constructor(
    private ministryService: MinistryService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private primengConfig: PrimeNGConfig
  ) {
    this.addMinistryForm = this.fb.group({
      ministryName: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.allMinistries$ = this.ministryService.getMinistries();
    this.allMinistries$.subscribe((ministries) => {
      this.allMinistryArray = ministries;
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    setTimeout(() => {
      this.processMinistryNameArray(this.allMinistryArray);
    }, 2000);
  }

  get f() {
    return this.addMinistryForm.controls;
  }

  getMinistryNameMessage() {
    return this.f['ministryName'].hasError('required')
      ? 'You must enter a name'
      : this.f['ministryName'].hasError('minlength')
      ? 'Min length 5 characters'
      : '';
  }

  processMinistryNameArray(data: Ministry[]) {
    this.ministryNameArray = [];
    data.map((el) => this.ministryNameArray.push(el.ministryName));
  }

  onSubmit({ value, valid }: { value: Ministry; valid: boolean }) {
    this.submitted = true;
    this.selectedMinistryName = value.ministryName;
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form Invalid',
        life: 3000,
        key: 'error',
      });
    } else if (this.ministryNameArray.includes(this.selectedMinistryName)) {
      const tempMinistryName = this.selectedMinistryName;
      this.selectedMinistryName = '';
      this.messageService.add({
        severity: 'error',
        summary: `${tempMinistryName} is already in use.`,
        detail: 'Please choose another name',
        life: 3000,
        key: 'error',
      });
    } else {
      this.ministryService.addMinistry(value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Ministry Added!',
        life: 3000,
        key: 'success',
      });
    }
  }

  goToMinistries() {
    this.ngZone.run(() => {
      this.router.navigate(['ministries']);
    });
  }
}
