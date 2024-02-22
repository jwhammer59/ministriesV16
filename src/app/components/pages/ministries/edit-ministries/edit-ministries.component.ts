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

import { Ministry } from 'src/app/models/ministry';
import { MinistryService } from 'src/app/services/ministry.service';

import { LoadingService } from 'src/app/services/loading.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
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
  selector: 'app-edit-ministries',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    BodyComponent,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './edit-ministries.component.html',
  styleUrls: ['./edit-ministries.component.scss'],
})
export class EditMinistriesComponent implements OnInit {
  headerTitle: string = 'Edit Ministry';
  headerIcon: string = 'pi pi-fw pi-heart';
  headerLogo: string = 'assets/MSP_Logo2.png';
  cardHeader: string = 'Edit Ministry Form';

  id: string = '';
  submitted: boolean = false;

  editMinistryForm!: FormGroup;

  allMinistries$!: Observable<Ministry[]>;
  allMinistryArray: Ministry[] = [];
  ministryNameArray: string[] = [];
  selectedMinistryName: string = '';

  ministryRef: any;

  ministry: Ministry = {
    id: '',
    ministryName: '',
  };

  constructor(
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
    this.allMinistries$ = this.ministryService.getMinistries();
    this.allMinistries$.subscribe((ministries) => {
      this.allMinistryArray = ministries;
    });
    this.editMinistryForm = this.fb.group({
      ministryName: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.id = this.route.snapshot.params['id'];
    this.ministryService.getMinistry(this.id).subscribe((ministry) => {
      this.ministryRef = ministry;
    });
  }

  ngAfterViewInit() {
    this.loadingService.loadingOn();
    setTimeout(() => {
      this.editMinistryForm = this.fb.group({
        id: [this.ministryRef.id],
        ministryName: [this.ministryRef.ministryName],
      });
      this.loadingService.loadingOff();
      this.processMinistryNameArray(this.allMinistryArray);
    }, 3000);
  }

  get f() {
    return this.editMinistryForm.controls;
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
      this.ministryService.updateMinistry(this.id, value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Ministry Updated!',
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

  deleteMinsitry() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?  This cannot be undone!',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Ministry Deleted!!',
        });
        this.ministryService.deleteMinistry(this.id);
        this.goToMinistries();
        this.confirmationService.close();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected Ministry deletion.',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled Ministry deletion.',
            });
            break;
        }
        this.confirmationService.close();
      },
    });
  }
}
