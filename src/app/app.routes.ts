import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { WrapperPageComponent } from './wrapper-page/wrapper-page.component';
import { PageStubComponent } from './page-stub/page-stub.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'app',
    component: WrapperPageComponent,
    children: [
      { path: '', component: PageStubComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
