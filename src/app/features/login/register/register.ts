import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  email = signal<string>('');
  password = signal<string>('');
  confirmPassword = signal<string>('');

  private auth = inject(Auth);
  private router = inject(Router);

  async onRegister() {
    if (this.password() !== this.confirmPassword()) {
      alert('密碼與確認密碼不一致');
      return;
    }
    try {
      await createUserWithEmailAndPassword(
        this.auth,
        this.email(),
        this.password()
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      alert(error.message || '註冊失敗');
    }
  }
}
