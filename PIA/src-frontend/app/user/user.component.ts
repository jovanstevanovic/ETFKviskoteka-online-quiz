import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { UserScore } from './users-score.module';
import { UsersGames } from './users-games.module';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { DayGame } from '../day-game/day-game.module';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private message : string;
  private successMessage : string;
  private failMessage : string;

  private username : string;

  private usersForToday : Array<UserScore>;
  private allPlayedGamesIn7Days : Array<UsersGames>;

  private bestPlayersForToday : boolean;
  private allPlayedGamesIn7DaysBool : boolean;

  private checkNewGameMethod;
  private checkJoinGameMethod;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem("username");

    this.bestPlayersForToday = false;
    this.allPlayedGamesIn7DaysBool = false;

    this.service.getBestPlayersForToday().subscribe((usersScore : Array<UserScore>)=>{
       if(usersScore) {
        this.usersForToday = usersScore;
       } else {
        this.message = "**** Doslo je do greske u sistemu! :( ****";
      }
    });
  }

  createNewGame() {
    this.service.createNewGame(this.username).subscribe((game : UsersGames)=>{
      if(game) {
        this.successMessage = "**** Igra uspesno kreirana! Cekanje na protivnika... ****";
        this.checkJoinGameMethod = setInterval(()=>{
          this.service.isSomeoneJoinedGame(this.username).subscribe((game) => {
            if(game) {
              this.successMessage = "**** Protivnik je pronadjen! ****";
              clearInterval(this.checkJoinGameMethod);
            }
          });
        }, 3000);
      } else {
        this.failMessage = "**** Doslo je do greske u sistemu! :( ****";
      }
   });
  }

  joinGame() {
    this.successMessage = "**** Trazenje partije u toku... ****";
    this.checkNewGameMethod = setInterval(()=>{
      this.service.joinGame(this.username).subscribe((game) => {
        if(game) {
         this.successMessage = "**** Uspesno ste pronasli igru! ****";
         clearInterval(this.checkNewGameMethod);
        }
      });
    }, 3000);
  }

  playSoloGame() {
    this.service.isAlreadyPlayed(this.username).subscribe((games : Array<any>) => {
      if(games.length == 0) {
        this.service.getTodayGame().subscribe((dayGame : Array<DayGame>) => {
          if(dayGame.length > 0) {
            this.service.createNewGame(this.username).subscribe((game) => {
              if(game) {
                switch(dayGame[0].name) {
                  case "Anagram":
                    this.router.navigate(['/anagram-game']);
                  break;
                  case "Moj broj":
                    this.router.navigate(['/my-number']);
                  break;
                  case "Zanimljive geografije":
                    this.router.navigate(['/geo']);
                  break;
                }
              } else {
                this.failMessage = "**** Greska prilikom kreiranja partije! ****";
              }
            });
          } else {
            this.failMessage = "**** Nema nijedne igre za danas! ****";
          }
       });
      } else {
        this.failMessage = "**** Igrac je vec igrao partiju danas! ****";
      }
   });
  }

  bestTodayPlayers() {
    this.bestPlayersForToday = true;
    this.allPlayedGamesIn7DaysBool = false;
  }

  playedGamesInPrev7Days() {
    this.bestPlayersForToday = false;
    this.allPlayedGamesIn7DaysBool = true;

    this.service.getAllPlayedGamesIn7Days(this.username).subscribe((usersGames : Array<UsersGames>)=>{
      if(usersGames) {
       this.allPlayedGamesIn7Days = usersGames;
      } else {
        this.message = "**** Doslo je do greske u sistemu! :( ****";
      }
   });
  }
}
