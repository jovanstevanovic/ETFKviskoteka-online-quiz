import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { User } from '../user/user.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  private message : string;
  
  private username : string;
  private jmbg : string;
  private secretQuestion : string;
  private secretQuestionAnswer : string;
  private newPassword : string;
  private newPassword2 : string;

  constructor(private service: UsersService, private router: Router) { }

  ngOnInit() {
  }

  isPasswordCorrect() : boolean {
    if(this.newPassword.length < 8 || this.newPassword.length > 12) {
      this.message = "**** Lozinka mora imati najmanje 8, a najvise 12 karaktera! ****";
      return false;
    }

    if(this.newPassword.match("\.*[A-Z]\.*") == null) {
      this.message = "**** Lozinka mora barem jedno veliko slovo! ****";
      return false;
    }

    if(this.newPassword.match("\.*[a-z]\.*[a-z]\.*[a-z]\.*") == null) {
      this.message = "**** Lozinka mora barem tri mala slova! ****";
      return false;
    }

    if(this.newPassword.match("^[a-z A-Z]\.+$") == null) {
      this.message = "**** Lozinka mora poceti malim ili velikm slovom! ****";
      return false;
    }

    if(this.newPassword.match("\.*[1-9]\.*") == null) {
      this.message = "**** Lozinka mora imati barem jedan broj! ****";
      return false;
    }
    
    if(this.newPassword.match("^[A-Z a-z 1-9]+$") != null) {
      this.message = "**** Lozinka mora barem jedan specijalni karakter! ****";
      return false;
    }

    return true;
  }

  forgotPasswordChange() {
    this.message = "";

    if(this.username == null) {
      this.message = "**** Polje korisnicko ime ne sme biti prazno! ****";
      return;
    }

    if(this.jmbg == null) {
      this.message = "**** Polje JMBG ne sme biti prazno! ****";
      return;
    }

    if(this.secretQuestion == null) {
      this.message = "**** Polje tajnog pitanja ne sme biti prazno! ****";
      return;
    }
    
    if(this.secretQuestionAnswer == null) {
      this.message = "**** Polje odgovora na tajno pitanja ne sme biti prazno! ****";
      return;
    }

    if(this.newPassword == null) {
      this.message = "**** Polje nove lozinke ne sme biti prazno! ****";
      return;
    }

    var passwordCorrecteness = this.isPasswordCorrect();
    if(!passwordCorrecteness) {
      return false;
    }
    
    if(this.newPassword != this.newPassword2) {
      this.message = "**** Lozinka i potvrda lozinke nisu iste vrednosti! ****";
      return;
    }

    this.service.forgotPasswordChange(this.username, this.jmbg, this.secretQuestion, this.secretQuestionAnswer, this.newPassword).subscribe((user : User) => {
      if (user) {
          this.router.navigate(['/login']);
       } else {
         this.message = "**** Korisnik nije pronadjen ili je pogresan odgovor na pitanje! ****";
       }
   });
  }
}
