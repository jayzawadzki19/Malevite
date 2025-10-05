import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginPageComponent } from './login-page/login-page.component';
import { WrapperPageComponent } from './wrapper-page/wrapper-page.component';
import { CheckupPageComponent } from './checkup-page/checkup-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { OptimizePageComponent } from './optimize-page/optimize-page.component';
import { DailyPageComponent } from './daily-page/daily-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'app',
    component: WrapperPageComponent,
    children: [
      {
        path: 'checkup',
        component: CheckupPageComponent,
        canActivate: [() => {
          const hasSubmitted = localStorage.getItem('malevite.hasSubmittedMetrics') === 'true';
          return hasSubmitted ? inject(Router).createUrlTree(['/app/daily']) : true;
        }]
      },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'optimize', component: OptimizePageComponent },
      { path: 'daily', component: DailyPageComponent },
      { path: 'profile', component: ProfileOverviewComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
