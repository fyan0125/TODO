import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _count = signal(0);
  readonly isLoading = computed(() => this._count() > 0);

  show() {
    this._count.update(count => count + 1);
    console.log('show', this._count());
  }

  hide() {
    this._count.update(count => Math.max(0, count - 1));
  }

  reset() {
    this._count.set(0);
  }
}
