import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user/user.model';
import { AnagramModule } from '../anagram/anagram.module';
import { RegisterRequestModule } from '../register-req/register-req.module';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  
  private successMessage : string;
  private failMessage : string;

  private dayGameName : string;
  private dayGameDate : Date;
  private dayGameBool : boolean;
  private dayErrorMessage : string;
  private listOfAnagrams : Array<AnagramModule>;

  private unresolvedRegisterReqBool : boolean;
  private reqErrorMessage : string; 
  private listOfReqs : Array<RegisterRequestModule>;

  private currentUserName : string;

  private failDuringCreation : boolean;

  constructor(private service: UsersService) { }

  ngOnInit() {
  }

  insertDayGame() {
    this.listOfAnagrams = null;
    this.reqErrorMessage = null;
    this.dayGameBool = false;
    this.unresolvedRegisterReqBool = false;
    this.failDuringCreation = false;
    
    if(this.dayGameName == null) {
      this.failMessage = "**** Nije uneto ime igre dana! ****";
      this.successMessage = null;
      return;
    }

    if(this.dayGameName != "Anagram" && this.dayGameName != "Moj broj" && this.dayGameName != "Zanimljive geografije") {
      this.failMessage = "**** Ne postoji ta igra medju ponudjenima! ****";
      this.successMessage = null;
      return;
    }

    if(this.dayGameDate == null) {
      this.failMessage = "**** Nije unet datum igre dana! ****";
      this.successMessage = null;
      return;
    }

    this.service.insertNewDayGame(this.dayGameDate, this.dayGameName).subscribe((newGameStatus)=> {
      if(newGameStatus) {
        this.failMessage = null;
        this.successMessage = "**** Igra dana uspesno kreirana! ****";
      }
      else {
        this.failDuringCreation = true;
        this.successMessage = null;
        this.failMessage = "**** Igra vec postoji! ****";
      }
    });

    if(this.dayGameName == "Anagram") {
      this.service.getAllApprovedAnagrams().subscribe((listOfApprovedAnagrams : Array<AnagramModule>)=> {
        if(listOfApprovedAnagrams) {
          this.dayGameBool = true;
          this.listOfAnagrams = listOfApprovedAnagrams;
        }
        else {
          this.successMessage = null;
          this.failMessage = "**** Nema dostupnih anagrama! ****";
        }
      });
    }
  }

  acceptAnagram(anagram) {
    this.service.acceptAnagram(this.dayGameDate, this.dayGameName, anagram.question, anagram.answer).subscribe((acceptingStatus : AnagramModule)=> {
      if(acceptingStatus) {
       this.dayErrorMessage = "**** Dodat anagram: " + anagram.question + " ****";
      }
      else {
        this.dayErrorMessage = "**** Doslo je do greske u sistemu! :( ****";
      }
    });
  }

  resolveRegisterRequeststs() {
    this.listOfReqs = null;
    this.dayGameBool = false;
    this.reqErrorMessage = null;
    this.unresolvedRegisterReqBool = true;

    this.service.getAllUnresolvedReqs().subscribe((listOfUnsresolvedReqs : Array<RegisterRequestModule>)=> {
      if(listOfUnsresolvedReqs){
          this.listOfReqs = listOfUnsresolvedReqs;
        }
        else {
          this.reqErrorMessage = "**** Nema dostupnih zahteva! ****";
        }
    });
  }

  acceptReq(req) {
    this.reqErrorMessage = null;
    this.service.acceptReq(req.username).subscribe((reqStatus : User)=> {
      if(reqStatus){
        this.reqErrorMessage = "**** Odobren zahtev za korisnika " + req.username + " ****";
      }
      else {
        this.reqErrorMessage = "**** Doslo je do greske u sistemu! :( ****";
      }
    });
  }

  declineReq(req) {
    this.reqErrorMessage = null;
    this.service.declineReq(req.username).subscribe((reqStatus : User)=> {
      if(reqStatus){
        this.reqErrorMessage = "**** Odbijen zahtev za korisnika " + req.username + " ****";
      }
      else {
        this.reqErrorMessage = "**** Doslo je do greske u sistemu! :( ****";
      }
    });
  }
}
