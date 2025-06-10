import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './filter-button.html',
  styleUrl: './filter-button.scss',
})
export class FilterButton {
  @Input() selected = false;
  @Input() label = '';
  @Input() icon: string | null = null;
  @Input() color: 'primary' | 'accent' | 'warn' | undefined;
  @Input() disabled = false;
  @Output() clickBtn = new EventEmitter<void>();
}
