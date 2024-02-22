import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { EventMinistry } from 'src/app/models/event-ministry';
import { EventMinistryService } from 'src/app/services/event-ministry.service';

import { TableModule } from 'primeng/table';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-ministries-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './event-ministries-table.component.html',
  styleUrls: ['./event-ministries-table.component.scss'],
})
export class EventMinistriesTableComponent {
  eventMinistries$!: Observable<EventMinistry[]>;

  constructor(
    private eventMinistryService: EventMinistryService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.eventMinistries$ = this.eventMinistryService.getEventMinistries();
  }

  goToSelectedEventMinistry(val: any) {
    this.ngZone.run(() => {
      this.router.navigate([`edit-event-ministry/${val.data.id}`]);
    });
  }
}
