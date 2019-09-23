import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { RegisterStatusModule } from '../register-status/register-status.module';
import { User } from '../user/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private message : string;
  private successMessage : string;

  private name : string;
  private surname : string;
  private email : string;
  private job : string;
  private username : string;
  private password : string;
  private password2 : string;
  private sex : string;
  private jmbg : string;
  private picture : string;
  private secretQuestion : string;
  private secretQuestionAnswer : string;

  private checkReqApproval;

  constructor(private service: UsersService, private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    clearInterval(this.checkReqApproval);
  }

  isPasswordCorrect() : boolean {
    if(this.password.length < 8 || this.password.length > 12) {
      this.message = "**** Lozinka mora imati najmanje 8, a najvise 12 karaktera! ****";
      return false;
    }

    if(this.password.match("\.*[A-Z]\.*") == null) {
      this.message = "**** Lozinka mora barem jedno veliko slovo! ****";
      return false;
    }

    if(this.password.match("\.*[a-z]\.*[a-z]\.*[a-z]\.*") == null) {
      this.message = "**** Lozinka mora barem tri mala slova! ****";
      return false;
    }

    if(this.password.match("^[a-z A-Z]\.+$") == null) {
      this.message = "**** Lozinka mora poceti malim ili velikm slovom! ****";
      return false;
    }

    if(this.password.match("\.*[1-9]\.*") == null) {
      this.message = "**** Lozinka mora imati barem jedan broj! ****";
      return false;
    }
    
    if(this.password.match("^[A-Z a-z 1-9]+$") != null) {
      this.message = "**** Lozinka mora barem jedan specijalni karakter! ****";
      return false;
    }

    return true;
  }

  onFileChanged(event): void{
    var file : File = event.target.files[0];
    var myReader : FileReader = new FileReader();
    myReader.onloadend = (e)=>{
      let img = new Image();
      img.src = myReader.result.toString();
      img.onload = (e) => {    
        if(img.height <= 300 && img.width <= 300){
          this.message = "";
          this.picture = img.src;
        } else {
          this.message = "**** Dimenzija slike je vec od 300x300 piksela! ****";
        } 
      }
    }

    myReader.readAsDataURL(file);
  }

  onRegisterClick() {
    this.message = "";

    if(this.name == null) {
      this.message = "**** Polje imena ne sme biti prazno! ****";
      return;
    }

    if(this.surname == null) {
      this.message = "**** Polje prezimena ne sme biti prazno! ****";
      return;
    }

    if(this.email == null) {
      this.message = "**** Polje e-mail ne sme biti prazno! ****";
      return;
    }

    if(this.email.match("^[a-z A-Z ]+@[a-z A-Z ]+\\.com$") == null) {
      this.message = "**** Polje e-mail ne zadovoljava format! ****";
      return;
    }

    if(this.job == null) {
      this.message = "**** Polje zanimanja ne sme biti prazno! ****";
      return;
    }

    if(this.username == null) {
      this.message = "**** Polje korisnickog imena ne sme biti prazno! ****";
      return;
    }

    if(this.password == null) {
      this.message = "**** Polje lozinke ne sme biti prazno! ****";
      return;
    }

    var passwordCorrecteness = this.isPasswordCorrect();
    if(!passwordCorrecteness) {
      return false;
    }
    
    if(this.password != this.password2) {
      this.message = "**** Lozinka i potvrda lozinke nisu iste vrednosti! ****";
      return;
    }

    if(this.sex == null) {
      this.message = "**** Nije odabran pol! ****";
      return;
    }

    if(this.jmbg == null) {
      this.message = "**** Polje JMBG ne sme biti prazno! ****";
      return;
    }

    if(this.jmbg.match("^\\d{12}$") == null) {
      this.message = "**** Polje JMBG nije odgovarajuceg formata! ****";
      return;
    }

    if(this.picture == null) {
      this.message = "**** Polje slike ne sme biti prazno! ****";
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

    this.service.register(this.name, this.surname, this.email, 
      this.job, this.username, this.password, this.sex, this.jmbg,
      this.secretQuestion, this.secretQuestionAnswer, this.picture).subscribe((user : User) => {
        if (user) {
          if(user.isApproved == 0) {
              this.message = null;
              this.successMessage = "**** Pricekajte na odobrenje zahteva... ****";
              this.checkReqApproval = setInterval(() => {
                this.service.isReqApproved(this.username).subscribe((user : User) => { 
                  if(user.isApproved == 1) {
                    this.message = null;
                    this.successMessage = "**** Vas zahtev je prihvacen! ****";
                    this.router.navigate(['/login']);
                  } else {
                    if(user.isApproved == 2) {
                      this.successMessage = null;
                      this.message = "**** Vas zahtev nije odobren! :( *****";
                    }
                  }
                });
              }, 3000);
          } else {
            this.message = "**** Korisnik sa tim korisnickim imenom vec postoji! ****";
          }
        } else {
          this.message = "**** Doslo je do greske u sistemu! :( ****";
        }
    });
  }
}
