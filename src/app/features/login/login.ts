import {
  Component,
  inject,
  signal,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { LoadingService } from '../../core/services/loading.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
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
  private auth = inject(Auth);
  private router = inject(Router);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);
  private injector = inject(EnvironmentInjector);

  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  isRegister = signal(false);
  googleLoading = signal(false);

  /**
   * 用 Firebase Auth 內建 Google 登入
   */
  async loginWithGoogle() {
    this.googleLoading.set(true);
    this.loading.show();
    try {
      const provider = new GoogleAuthProvider();
      await runInInjectionContext(this.injector, () =>
        signInWithPopup(this.auth, provider)
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      this.toast.error(error.message || 'Google 登入失敗');
    } finally {
      this.googleLoading.set(false);
      this.loading.hide();
    }
  }

  switchToRegister(event: Event) {
    event.preventDefault();
    this.isRegister.set(true);
    this.email.set('');
    this.password.set('');
    this.confirmPassword.set('');
  }

  switchToLogin(event: Event) {
    event.preventDefault();
    this.isRegister.set(false);
    this.email.set('');
    this.password.set('');
    this.confirmPassword.set('');
  }

  async onLogin() {
    this.loading.show();
    try {
      await signInWithEmailAndPassword(
        this.auth,
        this.email(),
        this.password()
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      this.toast.error(error.message || '登入失敗');
    } finally {
      this.loading.hide();
    }
  }

  async onRegister() {
    if (this.password() !== this.confirmPassword()) {
      this.toast.error('密碼與確認密碼不一致');
      return;
    }
    this.loading.show();
    try {
      await createUserWithEmailAndPassword(
        this.auth,
        this.email(),
        this.password()
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      this.toast.error(error.message || '註冊失敗');
    } finally {
      this.loading.hide();
    }
  }
}
