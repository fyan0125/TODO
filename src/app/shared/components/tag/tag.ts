import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.html',
  styleUrls: ['./tag.scss'],
})
export class TagComponent {
  text = input<string>('');
  color = input<'primary' | 'accent' | 'warn' | 'default'>('default');
  size = input<'sm' | 'md' | 'lg'>('md');
}
