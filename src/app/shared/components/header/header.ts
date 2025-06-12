import {
  Component,
  inject,
  signal,
  computed,
  runInInjectionContext,
  EnvironmentInjector,
} from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private auth = inject(Auth);
  private router = inject(Router);
  private loading = inject(LoadingService);
  private injector = inject(EnvironmentInjector);

  user = signal(this.auth.currentUser);

  userName = computed(
    () => this.user()?.displayName || this.user()?.email || ''
  );

  async logout() {
    this.loading.show();
    try {
      runInInjectionContext(this.injector, async () => {
        await signOut(this.auth);
        // 登出後導頁等
        localStorage.removeItem('firebase_token');
        this.router.navigate(['/login']);
      });
    } finally {
      this.loading.hide();
    }
  }
}
