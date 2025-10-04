import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { WrapperPageComponent } from './wrapper-page/wrapper-page.component';
import { CheckupPageComponent } from './checkup-page/checkup-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'app',
    component: WrapperPageComponent,
    children: [
      { path: '', component: CheckupPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
