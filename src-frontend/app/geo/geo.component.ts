import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { TermResult } from '../term-result/term-result.module';

@Component({
  selector: 'app-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.css']
})
export class GeoComponent implements OnInit {

  private geoErrorMessage : string;

  private timer : string;
  private timerValue : number;
  private timerMethod;

  private countryAnswer : string;
  private cityAnswer : string;
  private mountAnswer : string;
  private lakeAnswer : string;
  private animalAnswer : string;
  private riverAnswer : string;
  private plantAnswer : string;
  private musicAnswer : string;

  private finalScore : number = 0;

  private messages : string[] = [ "", "", "", "", "", "", "", "", ""];

  private characters : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  private waitForApproval1;
  private waitForApproval2;
  private waitForApproval3;
  private waitForApproval4;
  private waitForApproval5;
  private waitForApproval6;
  private waitForApproval7;
  private waitForApproval8;

  private letter : string;

  private submittedAnswers : number = 0;

  private endGame : boolean;

  private username : string;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem("username");

    this.timer = "2m : 0s";
    this.timerValue = 120;

    this.timerMethod = setInterval(() => {
      this.timerValue--;
      if(this.timerValue == 0) {
        this.timer = "0m : 0s";
        this.submittedAnswers = 8;
        clearInterval(this.timerMethod);
      } else {
        this.timer = Math.floor(this.timerValue / 60) + "m : " + this.timerValue % 60 + "s";
      }
    }, 1000);

    this.letter = this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  sendAnswers() {
    if(this.countryAnswer != null) {
      if(this.countryAnswer[0] != this.letter) {
        this.messages[0] = "**** Rec ne pocinje na slovo " + this.letter + " ****";
        this.submittedAnswers += 1;
      } else {
        this.service.isTermValid("Zemlja", this.countryAnswer).subscribe((result : TermResult) => {
          if(result.waitForApproval) {
            this.messages[0] = "Ceka se odgovor od supervisora...";
            this.waitForApproval1 = setInterval(() => {
              this.service.checkTermNewState("Zemlja", this.countryAnswer).subscribe((result : TermResult) => {
                if(result.isTermValid) {
                  this.submittedAnswers += 1;
                  this.finalScore += 4;
                  this.messages[0] = "4 poena";
                  clearInterval(this.waitForApproval1);
                } else {
                  if(!result.waitForApproval && !result.isTermValid) {
                    this.submittedAnswers += 1;
                    this.messages[0] = "0 poena";
                    clearInterval(this.waitForApproval1);
                  }
                }
              });
            }, 3000);
          } else {
            if(result.isTermValid) {
              this.finalScore += 2;
              this.submittedAnswers += 1;
              this.messages[0] = "2 poena";
            } else {
              this.submittedAnswers += 1;
              this.messages[0] = "0 poena";
            }
          }
        });
      }
    } else {
      this.submittedAnswers += 1;
      this.messages[0] = "0 poena";
    }

    if(this.cityAnswer != null) {
      if(this.cityAnswer[0] != this.letter) {
        this.messages[1] = "**** Rec ne pocinje na slovo " + this.letter + " ****";
        this.submittedAnswers += 1;
      } else {
        this.service.isTermValid("Grad", this.cityAnswer).subscribe((result : TermResult) => {
          if(result.waitForApproval) {
            this.messages[1] = "Ceka se odgovor od supervisora...";
            this.waitForApproval2 = setInterval(() => {
              this.service.checkTermNewState("Grad", this.cityAnswer).subscribe((result : TermResult) => {
                if(result.isTermValid) {
                  this.submittedAnswers += 1;
                  this.finalScore += 4;
                  this.messages[1] = "4 poena";
                  clearInterval(this.waitForApproval2);
                } else {
                  if(!result.waitForApproval && !result.isTermValid) {
                    this.submittedAnswers += 1;
                    this.messages[1] = "0 poena";
                    clearInterval(this.waitForApproval2);
                  }
                }
              });
            }, 3000);
          } else {
            if(result.isTermValid) {
              this.submittedAnswers += 1;
              this.finalScore += 2;
              this.messages[1] = "2 poena";
            } else {
              this.submittedAnswers += 1;
              this.messages[1] = "0 poena";
            }
          }
        });
      }
    } else {
      this.submittedAnswers += 1;
      this.messages[1] = "0 poena";
    }

    if(this.lakeAnswer != null) {
      if(this.lakeAnswer[0] != this.letter) {
        this.messages[2] = "**** Rec ne pocinje na slovo " + this.letter + " ****";
        this.submittedAnswers += 1;
      } else {
        this.service.isTermValid("Jezero", this.lakeAnswer).subscribe((result : TermResult) => {
          if(result.waitForApproval) {
            this.messages[2] = "Ceka se odgovor od supervisora...";
            this.waitForApproval3 = setInterval(() => {
              this.service.checkTermNewState("Jezero", this.lakeAnswer).subscribe((result : TermResult) => {
                if(result.isTermValid) {
                  this.submittedAnswers += 1;
                  this.finalScore += 4;
                  this.messages[2] = "4 poena";
                  clearInterval(this.waitForApproval3);
                } else {
                  if(!result.waitForApproval && !result.isTermValid) {
                    this.submittedAnswers += 1;
                    this.messages[2] = "0 poena";
                    clearInterval(this.waitForApproval3);
                  }
                }
              });
            }, 3000);
          } else {
            if(result.isTermValid) {
              this.submittedAnswers += 1;
              this.finalScore += 2;
              this.messages[2] = "2 poena";
            } else {
              this.submittedAnswers += 1;
              this.messages[2] = "0 poena";
            }
          }
        });
      }
    } else {
      this.submittedAnswers += 1;
      this.messages[2] = "0 poena";
    }

    if(this.riverAnswer != null) {
      if(this.riverAnswer[0] != this.letter) {
        this.messages[3] = "**** Rec ne pocinje na slovo " + this.letter + " ****";
        this.submittedAnswers += 1;
      } else {
        this.service.isTermValid("Reka", this.riverAnswer).subscribe((result : TermResult) => {
          if(result.waitForApproval) {
            this.messages[3] = "Ceka se odgovor od supervisora...";
            this.waitForApproval4 = setInterval(() => {
              this.service.checkTermNewState("Reka", this.riverAnswer).subscribe((result : TermResult) => {
                if(result.isTermValid) {
                  this.submittedAnswers += 1;
                  this.finalScore += 4;
                  this.messages[3] = "4 poena";
                  clearInterval(this.waitForApproval4);
                } else {
                  if(!result.waitForApproval && !result.isTermValid) {
                    this.submittedAnswers += 1;
                    this.messages[3] = "0 poena";
                    clearInterval(this.waitForApproval4);
                  }
                }
              });
            }, 3000);
          } else {
            if(result.isTermValid) {
              this.submittedAnswers += 1;
              this.finalScore += 2;
              this.messages[3] = "2 poena";
            } else {
              this.submittedAnswers += 1;
              this.messages[3] = "0 poena";
            }
          }
        });
      }
    } else {
      this.submittedAnswers += 1;
      this.messages[3] = "0 poena";
    }

    if(this.mountAnswer != null) {
      if(this.mountAnswer[0] != this.letter) {
        this.messages[4] = "**** Rec ne pocinje na slovo " + this.letter + " ****";
        this.submittedAnswers += 1;
      } else {
        this.service.isTermValid("Planina", this.mountAnswer).subscribe((result : TermResult) => {
          if(result.waitForApproval) {
            this.messages[4] = "Ceka se odgovor od supervisora...";
            this.waitForApproval5 = setInterval(() => {
              this.service.checkTermNewState("Planina", this.mountAnswer).subscribe((result : TermResult) => {
                if(result.isTermValid) {
                  this.submittedAnswers += 1;
                  this.finalScore += 4;
                  this.messages[4] = "4 poena";
                  clearInterval(this.waitForApproval5);
                } else {
                  if(!result.waitForApproval && !result.isTermValid) {
                    this.submittedAnswers += 1;
                    this.messages[4] = "0 poena";
                    clearInterval(this.waitForApproval5);
                  }
                }
              });
            }, 3000);
          } else {
            if(result.isTermValid) {
              this.submittedAnswers += 1;
              this.finalScore += 2;
              this.messages[4] = "2 poena";
            } else {
              this.submittedAnswers += 1;
              this.messages[4] = "0 poena";
            }
          }
        });
      }
    } else {
      this.submittedAnswers += 1;
      this.messages[4] = "0 poena";
    }

    if(this.animalAnswer != null) {
      if(this.animalAnswer[0] != this.letter) {
        this.messages[5] = "**** Rec ne pocinje na slovo " + this.letter + " ****";
        this.submittedAnswers += 1;
      } else {
        this.service.isTermValid("Zivotinja", this.animalAnswer).subscribe((result : TermResult) => {
          if(result.waitForApproval) {
            this.messages[5] = "Ceka se odgovor od supervisora...";
            this.waitForApproval6 = setInterval(() => {
              this.service.checkTermNewState("Zivotinja", this.animalAnswer).subscribe((result : TermResult) => {
                if(result.isTermValid) {
                  this.submittedAnswers += 1;
                  this.finalScore += 4;
                  this.messages[5] = "4 poena";
                  clearInterval(this.waitForApproval6);
                } else {
                  if(!result.waitForApproval && !result.isTermValid) {
                    this.submittedAnswers += 1;
                    this.messages[5] = "0 poena";
                    clearInterval(this.waitForApproval6);
                  }
                }
              });
            }, 3000);
          } else {
            if(result.isTermValid) {
              this.submittedAnswers += 1;
              this.finalScore += 2;
              this.messages[5] = "2 poena";
            } else {
              this.submittedAnswers += 1;
              this.messages[5] = "0 poena";
            }
          }
        });
      }
    } else {
      this.submittedAnswers += 1;
      this.messages[5] = "0 poena";
    }

    if(this.plantAnswer != null) {
      if(this.plantAnswer[0] != this.letter) {
        this.messages[6] = "**** Rec ne pocinje na slovo " + this.letter + " ****";
        this.submittedAnswers += 1;
      } else {
        this.service.isTermValid("Biljka", this.plantAnswer).subscribe((result : TermResult) => {
          if(result.waitForApproval) {
            this.messages[6] = "Ceka se odgovor od supervisora...";
            this.waitForApproval7 = setInterval(() => {
              this.service.checkTermNewState("Biljka", this.plantAnswer).subscribe((result : TermResult) => {
                if(result.isTermValid) {
                  this.submittedAnswers += 1;
                  this.finalScore += 4;
                  this.messages[6] = "4 poena";
                  clearInterval(this.waitForApproval7);
                } else {
                  if(!result.waitForApproval && !result.isTermValid) {
                    this.submittedAnswers += 1;
                    this.messages[6] = "0 poena";
                    clearInterval(this.waitForApproval7);
                  }
                }
              });
            }, 3000);
          } else {
            if(result.isTermValid) {
              this.submittedAnswers += 1;
              this.finalScore += 2;
              this.messages[6] = "2 poena";
            } else {
              this.submittedAnswers += 1;
              this.messages[6] = "0 poena";
            }
          }
        });
      }
    } else {
      this.submittedAnswers += 1;
      this.messages[6] = "0 poena";
    }

    if(this.musicAnswer != null) {
      if(this.musicAnswer[0] != this.letter) {
        this.messages[7] = "**** Rec ne pocinje na slovo " + this.letter + " ****";
        this.submittedAnswers += 1;
      } else {
        this.service.isTermValid("Muzika", this.musicAnswer).subscribe((result : TermResult) => {
          if(result.waitForApproval) {
            this.messages[7] = "Ceka se odgovor od supervisora...";
            this.waitForApproval8 = setInterval(() => {
              this.service.checkTermNewState("Muzika", this.musicAnswer).subscribe((result : TermResult) => {
                if(result.isTermValid) {
                  this.submittedAnswers += 1;
                  this.finalScore += 4;
                  this.messages[7] = "4 poena";
                  clearInterval(this.waitForApproval8);
                } else {
                  if(!result.waitForApproval && !result.isTermValid) {
                    this.submittedAnswers += 1;
                    this.messages[7] = "0 poena";
                    clearInterval(this.waitForApproval8);
                  }
                }
              });
            }, 3000);
          } else {
            if(result.isTermValid) {
              this.submittedAnswers += 1;
              this.finalScore += 2;
              this.messages[7] = "2 poena";
            } else {
              this.submittedAnswers += 1;
              this.messages[7] = "0 poena";
            }
          }
        });
      }
    } else {
      this.submittedAnswers += 1;
      this.messages[7] = "0 poena";
    }
  }

  endGameButton() {
    this.service.updateGameResult(this.username, this.finalScore).subscribe((result) => { 
      if(result) {
        this.router.navigate(['/user']);
      } else {
        
      }
    });
  }
}
