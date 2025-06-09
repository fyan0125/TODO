import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  standalone: true,
  templateUrl: './tag.html',
  styleUrls: ['./tag.scss']
})
export class TagComponent {
  @Input() text: string = '';
  @Input() color: 'primary' | 'accent' | 'warn' | 'default' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
