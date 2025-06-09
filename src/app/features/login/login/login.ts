import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = signal<string>('');
  password = signal<string>('');

  private auth = inject(Auth);
  private router = inject(Router);

  async onLogin() {
    try {
      await signInWithEmailAndPassword(
        this.auth,
        this.email(),
        this.password()
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      alert(error.message || '登入失敗');
    }
  }
}
