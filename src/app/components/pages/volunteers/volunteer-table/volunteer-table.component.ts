import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Volunteer } from 'src/app/models/volunteer';
import { VolunteersService } from 'src/app/services/volunteers.service';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-volunteer-table',
  standalone: true,
  imports: [CommonModule, TableModule, CheckboxModule, FormsModule],
  templateUrl: './volunteer-table.component.html',
  styleUrls: ['./volunteer-table.component.scss'],
})
export class VolunteerTableComponent {
  volunteers$!: Observable<Volunteer[]>;

  constructor(
    private volunteersService: VolunteersService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.volunteers$ = this.volunteersService.getVolunteers();
  }

  goToSelectedVolunteer(val: any) {
    this.ngZone.run(() => {
      this.router.navigate([`volunteer-detail/${val.data.id}`]);
    });
  }
}
