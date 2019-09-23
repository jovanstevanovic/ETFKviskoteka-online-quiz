import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { UsersService } from './users.service';

import { HttpClientModule } from '@angular/common/http';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GuestComponent } from './guest/guest.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { AnagramGameComponent } from './anagram-game/anagram-game.component';
import { MyNumberComponent } from './my-number/my-number.component';
import { GeoComponent } from './geo/geo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    AdminComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    GuestComponent,
    SupervisorComponent,
    AnagramGameComponent,
    MyNumberComponent,
    GeoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
