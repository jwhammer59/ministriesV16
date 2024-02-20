import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { FamilyId } from 'src/app/models/family-id';
import { FamilyIdsService } from 'src/app/services/family-ids.service';

import { TableModule } from 'primeng/table';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-family-id-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './family-id-table.component.html',
  styleUrls: ['./family-id-table.component.scss'],
})
export class FamilyIdTableComponent {
  familyIds$!: Observable<FamilyId[]>;

  constructor(
    private familyIdsService: FamilyIdsService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.familyIds$ = this.familyIdsService.getFamilyIds();
  }

  goToSelectedFamilyId(val: any) {
    this.ngZone.run(() => {
      this.router.navigate([`edit-family-id/${val.data.id}`]);
    });
  }
}
