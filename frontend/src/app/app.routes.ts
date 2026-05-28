import { Routes } from '@angular/router';

import { Home } from './features/dashboard/home/home';
import { UserManagement } from './features/admin/user-management/user-management';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
     path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(c => c.LoginComponent)
  },
  
  
  {
  path: 'dashboard',
  canActivate:[authGuard],
  loadComponent: () =>
    import('./features/dashboard/home/home')
      .then(c => c.Home)
},

  {
     path: 'home',
    loadComponent: () =>
      import('./features/dashboard/home/home')
        .then(c => c.Home)

  },
  {
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/dashboard/home/home')
      .then(c => c.Home)
},

  {
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  loadComponent: () =>
    import('./features/admin/user-management/user-management')
      .then(c => c.UserManagement)
},

  
  {
    path: '**',
    redirectTo: 'login'
  }

];
