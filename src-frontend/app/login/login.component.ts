import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { UsersService } from '../users.service';
import { User } from '../user/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private message: string;

  private username: string;
  private password: string;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
  }

  login():void{
    this.message = "";

    if(this.username == null) {
      this.message = "**** Polje korisnickog imena ne sme biti prazno! ****";
      return;
    }

    if(this.password == null) {
      this.message = "**** Polje lozinke ne sme biti prazno! ****";
      return;
    }

    this.service.login(this.username, this.password).subscribe((user: User)=>{
      if(user){
        sessionStorage.setItem("username", this.username);
        
        if(user.type == 'user') {
          this.router.navigate(['/user']);
        }
        else {
          if(user.type == 'admin') {
            this.router.navigate(['/admin']);
          } else {
            if(user.type == 'supervisor') {
              this.router.navigate(['/supervisor']);
            } else {
              this.message = "**** Doslo je do greske u sistemu! :( ****";
            }
          }
        }     
      } else {
        this.message = "**** Korisnik ne postoji! ****";
      }
    });
  }
}
