import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './filter-button.html',
  styleUrl: './filter-button.scss',
})
export class FilterButton {
  selected = input<boolean>(false);
  label = input<string>('');
  icon = input<string | null>(null);
  color = input<string>('primary');
  disabled = input<boolean>(false);
  clickBtn = output<void>();
}
