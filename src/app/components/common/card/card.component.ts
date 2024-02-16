import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() cardHeader: string = '';
  @Input() cardSubheader: string = '';
  @Input() cardBgColor: string = '#ABC9FB';
  @Input() cardWidth: string = '90vw';
}
