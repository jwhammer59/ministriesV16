import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule, TooltipModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() buttonToolTip: string = '';
  @Input() buttonIcon: string = '';
  @Input() buttonVisible: boolean = false;
  @Input() logo: string = '';
  // Logo Exp:  assets/Logo.png

  @Output() buttonAction = new EventEmitter<string>();

  headerBtnAction() {
    this.buttonAction.emit();
  }
}
