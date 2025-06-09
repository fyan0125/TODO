import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages = signal<ToastMessage[]>([]);

  show(msg: ToastMessage) {
    this.messages.update(list => [...list, msg]);
    setTimeout(() => this.remove(msg), msg.duration ?? 3000);
  }

  success(message: string, title?: string) {
    this.show({ type: 'success', message, title });
  }
  error(message: string, title?: string) {
    this.show({ type: 'error', message, title });
  }
  info(message: string, title?: string) {
    this.show({ type: 'info', message, title });
  }
  warning(message: string, title?: string) {
    this.show({ type: 'warning', message, title });
  }

  remove(msg: ToastMessage) {
    this.messages.update(list => list.filter(m => m !== msg));
  }
}
