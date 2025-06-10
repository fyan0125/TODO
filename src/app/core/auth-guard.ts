import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  return new Promise<boolean>((resolve) => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      unsub();
      if (user) {
        // 取得token並存localStorage
        const token = await user.getIdToken();
        localStorage.setItem('firebase_token', token);
        resolve(true);
      } else {
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
