import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent {
  @Input() bodyTitle: string = '';
}
