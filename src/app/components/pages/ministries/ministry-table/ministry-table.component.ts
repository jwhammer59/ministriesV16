import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Ministry } from 'src/app/models/ministry';
import { MinistryService } from 'src/app/services/ministry.service';

import { TableModule } from 'primeng/table';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-ministry-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './ministry-table.component.html',
  styleUrls: ['./ministry-table.component.scss'],
})
export class MinistryTableComponent {
  ministries$!: Observable<Ministry[]>;

  constructor(
    private ministryService: MinistryService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.ministries$ = this.ministryService.getMinistries();
  }

  goToSelectedMinistry(val: any) {
    console.log('go to selected ministry clicked', val);
    this.ngZone.run(() => {
      this.router.navigate([`edit-ministry/${val.data.id}`]);
    });
  }
}
