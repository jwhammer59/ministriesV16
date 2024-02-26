import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Event } from 'src/app/models/event';
import { EventsService } from 'src/app/services/events.service';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-table',
  standalone: true,
  imports: [CommonModule, TableModule, CheckboxModule, FormsModule],
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss'],
})
export class EventTableComponent {
  events$!: Observable<Event[]>;

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.events$ = this.eventsService.getEvents();
  }

  goToSelectedEvent(val: any) {
    this.ngZone.run(() => {
      this.router.navigate([`event-detail/${val.data.id}`]);
    });
  }
}
