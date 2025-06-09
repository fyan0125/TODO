import { Routes } from '@angular/router';
import { TodoListComponent } from './features/todo/todo-list/todo-list';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', component: TodoListComponent, canActivate: [authGuard] },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login/login').then((m) => m.Login),
  },
];
