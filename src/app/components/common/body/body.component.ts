import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, PanelModule],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent {
  @Input() bodyTitle: string = '';
  @Input() bodyBgColor: string = '#D0E1FD';
}
