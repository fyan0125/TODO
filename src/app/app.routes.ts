import { Routes } from '@angular/router';
import { DefaultLayout } from './shared/layout/default-layout';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/todo/todo-list/todo-list').then(m => m.TodoListComponent),
        canActivate: [authGuard],
      },
      // 這裡可繼續加其他需要layout的路由
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.Login),
  },
];
