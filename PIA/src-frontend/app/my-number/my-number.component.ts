import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { ExpressionValue } from '../expression-result/expression-result.module';

@Component({
  selector: 'app-my-number',
  templateUrl: './my-number.component.html',
  styleUrls: ['./my-number.component.css']
})
export class MyNumberComponent implements OnInit {

  constructor(private router: Router, private service: UsersService) { }

  numberChoosen: boolean[] = [false, false, false, false, false, false];
  numbersChoosenBool : boolean = false;

  mojBrojGivenNumberClicked: boolean[] = [false, false, false, false, false, false];
  mojBrojErrorMessage : string;
  yourExpressionMojBroj = "";
  mojBrojExpressionArray: any[] = new Array();
  mojBrojCountdown = 60;
  submitedMojBrojAnswer = false;

  given_numbers : number[] = [0, 0, 0, 0, 0, 0];
  index : number = 0;
  predclaredNumbers : number[] = [10, 15, 20, 25, 50, 75, 100];

  private finalScore : number = 0;
  private choosenNumber : number;
  private typeNumber : number = 0;

  private timer : string;
  private timerValue : number;
  private timerMethod;

  private chooserMethod;

  private endGame : boolean = false;

  private username : string;

  private slagalicaErrorMessage : boolean;

  ngOnInit() {
    this.username = sessionStorage.getItem("username");

    this.timer = "1m : 0s";
    this.timerValue = 60;

    this.chooserMethod = setInterval(() => {
      if(this.typeNumber == 3) {
        this.choosenNumber = this.getRandomNumber();
      } else {
        this.given_numbers[this.index] = this.getRandomNumber();
      }
      
    }, 50);
  }

  getRandomNumber() : number {
    switch(this.typeNumber) {
      case 0:
        return Math.floor(Math.random() * 9) + 1;
      case 1:
        return this.predclaredNumbers[Math.floor(Math.random() * 2)];
      case 2:
        return this.predclaredNumbers[Math.floor(Math.random() * 6) + 3];
      case 3:
        return Math.floor(Math.random() * 999) + 1;
    }
  }

  stopNumberCount() {
    this.index++;
    if(this.index == 7) {
      this.numbersChoosenBool = true;
      this.timerMethod = setInterval(() => {
        this.timerValue--;
        if(this.timerValue == 0) {
          this.endGame = true;
          this.timer = "0m : 0s";
          clearInterval(this.timerMethod);
        } else {
          this.timer = Math.floor(this.timerValue / 60) + "m : " + this.timerValue % 60 + "s";
        }
      }, 1000);

      clearInterval(this.chooserMethod);
    } else {
      if(this.index == 4) {
        this.typeNumber = 1;
      }
      if(this.index == 5) {
        this.typeNumber = 2;
      }
      if(this.index == 6) {
        this.typeNumber = 3;
      }
    }
  }

  chooseGivenNumber(index) {
    if (!this.mojBrojGivenNumberClicked[index] && this.canChooseNumber()) {
      this.mojBrojErrorMessage = "";
      this.yourExpressionMojBroj += this.given_numbers[index];
      this.mojBrojGivenNumberClicked[index] = true;
      this.mojBrojExpressionArray.push(index);
    }
  }

  canChooseNumber() {
    if (this.yourExpressionMojBroj == ""
      || (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] == '(')
      || (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] == '+')
      || (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] == '-')
      || (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] == '*')
      || (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] == '/')) {
      return true;
    }
    else return false;
  }

  mojBrojLeftPar() {
    if (this.canChooseLeftPar()) {
      this.yourExpressionMojBroj += "(";
      this.mojBrojExpressionArray.push('(');
    }
  }

  canChooseLeftPar() {
    if (this.yourExpressionMojBroj == ""
      || (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1]) == '*'
      || (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1]) == '/'
      || (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1]) == '+'
      || (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1]) == '-') {
      return true;
    } else return false;
  }


  mojBrojRightPar() {
    if (this.canChooseRightPar()) {
      this.yourExpressionMojBroj += ')';
      this.mojBrojExpressionArray.push(')');
    }
  }

  canChooseRightPar() {
    if (this.yourExpressionMojBroj != ''
      && this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] != '('
      && (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1]) != '*'
      && (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1]) != '/'
      && (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1]) != '+'
      && (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1]) != '-') {
      let number_of_par = 0;
      for (let i = 0; i < this.mojBrojExpressionArray.length; i++) {
        if (this.mojBrojExpressionArray[i] == '(') {
          number_of_par++;
        }
        if (this.mojBrojExpressionArray[i] == ')') {
          number_of_par--;
        }
      }
      if (number_of_par > 0)
        return true;
      else return false;
    } else
      return false;
  }

  mojBrojPlus() {
    if (this.canChooseOperator()) {
      this.yourExpressionMojBroj += '+';
      this.mojBrojExpressionArray.push('+');
    }
  }

  mojBrojMinus() {
    if (this.canChooseOperator()) {
      this.yourExpressionMojBroj += '-';
      this.mojBrojExpressionArray.push('-');
    }
  }

  mojBrojMul() {
    if (this.canChooseOperator()) {
      this.yourExpressionMojBroj += '*';
      this.mojBrojExpressionArray.push('*');
    }
  }

  mojBrojDiv() {
    if (this.canChooseOperator()) {
      this.yourExpressionMojBroj += '/';
      this.mojBrojExpressionArray.push('/');
    }
  }

  canChooseOperator() {
    if (this.yourExpressionMojBroj != ''
      && (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] != '(')
      && (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] != '+')
      && (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] != '-')
      && (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] != '/')
      && (this.mojBrojExpressionArray[this.mojBrojExpressionArray.length - 1] != '*')) {
      return true;
    }
    else return false;
  }

  submitMojBrojAnswer() {
    if (!this.submitedMojBrojAnswer) {
      this.submitedMojBrojAnswer = true;
      this.service.submitMojBrojAnswer(this.yourExpressionMojBroj).subscribe((res: ExpressionValue) => {
        console.log(res);
        if(res.expressionStatus) {
          if(this.choosenNumber == res.expressionValue) {
            this.finalScore = 10;
          } else {
            this.finalScore = 0;
          }
        } else {
          this.finalScore = 0;
          this.slagalicaErrorMessage = true;
          this.mojBrojErrorMessage = "**** Izraz je pogresan! ****";
        }
        this.endGame = true;
        clearInterval(this.timerMethod);
      });
    }
  }

  deletePartOfExpression() {
    if (this.yourExpressionMojBroj != "") {
      let elem = this.mojBrojExpressionArray.pop();
      if (elem == '*' || elem == '/' || elem == '+' || elem == '-' || elem == ")" || elem == "(") {
        this.yourExpressionMojBroj = this.yourExpressionMojBroj.substring(0, this.yourExpressionMojBroj.length - 1);
      } else {
        let num: Number = this.given_numbers[elem];
        let num_of_digits = 1;
        if (num >= 10 && num < 100) {
          num_of_digits = 2;
        } else if (num >= 100) {
          num_of_digits = 3;
        }
        this.yourExpressionMojBroj = this.yourExpressionMojBroj.substring(0, this.yourExpressionMojBroj.length - num_of_digits);
        this.mojBrojGivenNumberClicked[elem] = false;
      }
    }
  }

  deleteWholeExpression() {
    this.yourExpressionMojBroj = "";
    for (let i = 0; i < 6; ++i) {
      this.mojBrojGivenNumberClicked[i] = false;
    }
    this.mojBrojExpressionArray = new Array();
  }

  nextGame() {
    if(this.endGame) {
      this.service.updateGameResult(this.username, this.finalScore).subscribe((result) => { 
        if(result) {
          this.router.navigate(['/geo']);
        } else {
          this.mojBrojErrorMessage = "**** Doslo je do greske prilikom upisa rezultata! ****";
        }
      });
    } else {
      this.slagalicaErrorMessage = true;
      this.mojBrojErrorMessage = "**** Igra je i dalje u toku! ****";
    }
  }

}
