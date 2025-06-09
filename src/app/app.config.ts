import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideFirebaseApp, initializeApp, FirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyBYsLI09El9YymxTeF7UYQeAq3SeRAdmhU",
  authDomain: "euphoric-truth-461405-h4.firebaseapp.com",
  projectId: "euphoric-truth-461405-h4",
  storageBucket: "euphoric-truth-461405-h4.firebasestorage.app",
  messagingSenderId: "364891571168",
  appId: "1:364891571168:web:c17cfe6abea513a9716185"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      // 可於此加入攔截器
      // withInterceptors([ ... ])
    ),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => {
      const firebaseApp = inject(FirebaseApp); // 注入 FirebaseApp 實例
      return getFirestore(firebaseApp, 'todo');
    }),
    provideAuth(() => {
      const firebaseApp = inject(FirebaseApp);
      return getAuth(firebaseApp);
    })
  ]
};
