import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GuestComponent } from './guest/guest.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { AnagramGameComponent } from './anagram-game/anagram-game.component';
import { MyNumberComponent } from './my-number/my-number.component';
import { GeoComponent } from './geo/geo.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'changePassword', component: ChangePasswordComponent},
  {path: 'forgotOldPassword', component: ForgotPasswordComponent},
  {path: 'guest', component: GuestComponent},
  {path: 'user', component: UserComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'supervisor', component: SupervisorComponent},
  {path: 'anagram-game', component: AnagramGameComponent},
  {path: 'my-number', component: MyNumberComponent},
  {path: 'geo', component: GeoComponent},
  {path: '', component: LoginComponent}
]

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
