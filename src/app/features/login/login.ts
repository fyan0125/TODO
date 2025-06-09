declare global {
  interface Window {
    google: any;
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from '@angular/fire/auth';

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
export class Login implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';
  isRegister = false;

  private auth = inject(Auth);
  private router = inject(Router);

  ngOnInit(): void {
    // 載入Google登入SDK
    if (!document.getElementById('gsi-client')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.id = 'gsi-client';
      script.onload = () => this.renderGoogleButton();
      document.body.appendChild(script);
    } else {
      this.renderGoogleButton();
    }
  }

  renderGoogleButton() {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: '364891571168-pt40epodgjvvei8g184aa1h0eae6ddi8.apps.googleusercontent.com',
        callback: (response: any) => {
          this.handleGoogleCredential(response.credential);
        }
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large' }
      );
      window.google.accounts.id.prompt();
    }
  }

  async handleGoogleCredential(credential: string) {
    try {
      const provider = new GoogleAuthProvider();
      const firebaseCredential = GoogleAuthProvider.credential(credential);
      await signInWithCredential(this.auth, firebaseCredential);
      this.router.navigate(['/']);
    } catch (error: any) {
      alert(error.message || 'Google 登入失敗');
    }
  }

  switchToRegister(event: Event) {
    event.preventDefault();
    this.isRegister = true;
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  switchToLogin(event: Event) {
    event.preventDefault();
    this.isRegister = false;
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  async onLogin() {
    try {
      await signInWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      alert(error.message || '登入失敗');
    }
  }

  async onRegister() {
    if (this.password !== this.confirmPassword) {
      alert('密碼與確認密碼不一致');
      return;
    }
    try {
      await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/']);
    } catch (error: any) {
      alert(error.message || '註冊失敗');
    }
  }
}
