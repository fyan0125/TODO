import { Component, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private auth = inject(Auth);
  private router = inject(Router);
  private loading = inject(LoadingService);

  async logout() {
    this.loading.show();
    try {
      await signOut(this.auth);
      localStorage.removeItem('firebase_token');
      this.router.navigate(['/login']);
    } finally {
      this.loading.hide();
    }
  }
}
