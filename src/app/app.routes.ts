import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { WrapperPageComponent } from './wrapper-page/wrapper-page.component';
import { CheckupPageComponent } from './checkup-page/checkup-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { OptimizePageComponent } from './optimize-page/optimize-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'app',
    component: WrapperPageComponent,
    children: [
      { path: 'checkup', component: CheckupPageComponent },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'optimize', component: OptimizePageComponent },
      { path: 'profile', component: ProfileOverviewComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
