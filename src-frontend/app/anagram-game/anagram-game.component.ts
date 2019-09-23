import { Component, OnInit } from '@angular/core';
import { AnagramModule } from '../anagram/anagram.module';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anagram-game',
  templateUrl: './anagram-game.component.html',
  styleUrls: ['./anagram-game.component.css']
})
export class AnagramGameComponent implements OnInit {

  private successMessage : string;
  private failMessage : string;

  private timer : string;
  private timerValue : number;

  private anagram1 : AnagramModule;
  private anagram2 : AnagramModule;
  private answer1 : AnagramModule;
  private answer2 : AnagramModule;

  private secondAnagram : boolean;

  private timerMethod;

  private firstPartGameEnd : boolean;
  private secondPartGameEnd : boolean = false;

  private nextGameBool : boolean;

  private answerMessage1 : string;
  private answerMessage2 : string;
  private finalScore : number = 0;

  private anagramAnswer1 : string;
  private anagramAnswer2 : string;

  private gameCreationFail : boolean;

  private username : string;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem("username");

    this.timer = "1m : 0s";
    this.timerValue = 60;
    this.nextGameBool = false;

    let date : Date = new Date();
    let dateString : string = date.getFullYear() + "-";

    if(date.getMonth() + 1 < 10) {
      dateString = dateString + "0" + (date.getMonth() + 1) + "-";
    } else {
      dateString = dateString + (date.getMonth() + 1) + "-";
    }

    if(date.getDate() < 10) {
      dateString = dateString + "0" + date.getDate();
    } else {
      dateString = dateString + date.getDate();
    }

    this.service.getAnagramsForDate(dateString).subscribe((anagrams : Array<AnagramModule>) => { 
      if(anagrams != null && anagrams.length > 1) {
        this.anagram1 = anagrams[0];
        this.anagram2 = anagrams[1];

        this.timerMethod = setInterval(() => {
          this.timerValue--;
          if(this.timerValue == 0) {
            if(!this.firstPartGameEnd) {
              this.firstPartGameEnd = true;
              this.timer = "1m : 0s";
              this.timerValue = 60;
              this.secondAnagram = true;
              this.failMessage = null;
            } else {
              this.secondPartGameEnd = true;
              this.nextGameBool = true;
              this.timer = "0m : 0s";
              clearInterval(this.timerMethod);
            }
          } else {
            this.timer = Math.floor(this.timerValue / 60) + "m : " + this.timerValue % 60 + "s";
          }
        }, 1000);
      } else {
        this.gameCreationFail = true;
        this.failMessage = "**** Ne postoji dovoljno anagrama za ovaj dan! ****";
      }
    });
  }

  sendFirstAnswer() {
    if(this.gameCreationFail) {
      return;
    }

    if(this.anagramAnswer1 == null) {
      this.failMessage = "**** Niste uneli nikakav odgovor! ****";
      return;
    }

    if(this.anagram1.answer == this.anagramAnswer1) {
      this.answerMessage1 = "**** Odgovor je tacan! ****";
      this.finalScore = 10;
    } else {
      this.answerMessage1 = "**** Odgovor je netacan! ****";
      this.finalScore = 0;
    }

    this.firstPartGameEnd = true;
    this.timer = "1m : 0s";
    this.timerValue = 60;
    this.secondAnagram = true;
    this.failMessage = null;
  }

  sendSecondAnswer() {
    if(this.anagramAnswer2 == null) {
      this.failMessage = "**** Niste uneli nikakav odgovor! ****";
      return;
    }

    if(this.anagram2.answer == this.anagramAnswer2) {
      this.answerMessage2 = "**** Odgovor je tacan! ****";
      this.finalScore += 10;
    } else {
      this.answerMessage2 = "**** Odgovor je netacan! ****";
    }

    this.failMessage = null;
    this.secondPartGameEnd = true;
    this.nextGameBool = true;
    clearInterval(this.timerMethod);
  }

  nextGame() {
    if(this.secondPartGameEnd) {
      this.service.updateGameResult(this.username, this.finalScore).subscribe((result) => { 
        if(result) {
          this.router.navigate(['/my-number']);
        } else {
          this.failMessage = "**** Doslo je do greske prilikom upisa rezultata! ****";
        }
      });
    } else {
      this.failMessage = "**** Igra je i dalje u toku! ****";
    }
  }
}
