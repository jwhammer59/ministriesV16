import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { EventType } from 'src/app/models/event-type';
import { EventTypeService } from 'src/app/services/event-type.service';

import { TableModule } from 'primeng/table';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-type-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './event-type-table.component.html',
  styleUrls: ['./event-type-table.component.scss'],
})
export class EventTypeTableComponent {
  eventTypes$!: Observable<EventType[]>;

  constructor(
    private eventTypeService: EventTypeService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.eventTypes$ = this.eventTypeService.getEventTypes();
  }

  goToSelectedEventType(val: any) {
    this.ngZone.run(() => {
      this.router.navigate([`event-type-detail/${val.data.id}`]);
    });
  }
}
