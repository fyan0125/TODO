import { Component, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

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

  async logout() {
    await signOut(this.auth);
    localStorage.removeItem('firebase_token');
    this.router.navigate(['/login']);
  }
}
