import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { UserScore } from '../user/users-score.module';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {

  private message : string;

  private usersForCurrentMonth : Array<UserScore>;
  private usersForPrev20Days : Array<UserScore>;

  private besfForCurrentMonthBool : boolean;
  private besfFromPast20Days : boolean;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    this.besfForCurrentMonthBool = false;
    this.besfFromPast20Days = false;

    this.service.getBestPlayersForCurrentMonth().subscribe((usersScore : Array<UserScore>)=>{
       if(usersScore) {
          this.usersForCurrentMonth = usersScore;
       } else {
        this.message = "**** Doslo je do greske u sistemu! :( ****";
      }
    });

    this.service.getBestPlayersForPast20Days().subscribe((usersScore : Array<UserScore>)=>{
       if(usersScore) {
        this.usersForPrev20Days = usersScore;
       } else {
         this.message = "**** Doslo je do greske u sistemu! :( ****";
       }
    });
  }

  bestFromCurrentMonth() {
    this.besfFromPast20Days = false;
    this.besfForCurrentMonthBool = true;
  }

  bestFromPast20days() {
    this.besfForCurrentMonthBool = false;
    this.besfFromPast20Days = true;
  }

  loginForQuests() {
    this.router.navigate(['/login']);
  }

  registerForQuests() {
    this.router.navigate(['/register']);
  }
}
