import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { UnresolvedTerm } from '../unsersoved-term/unsersoved-term.module';
import { AnagramModule } from '../anagram/anagram.module';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent implements OnInit {

  private successMessage : string;
  private failMessage : string;

  private anagramQuestion : string;
  private anagramAnswer : string;

  private anagramFile : string;

  private unresolvedTermsBool : boolean;
  private unsersolvedTerms : Array<UnresolvedTerm>;

  private unresolvedTermsMessage : string;

  geographyData: 
  {
     Geografija : 
     [ 
       { 
         slovo : String, odgovori : 
          [ 
            { 
              kategorija : String, termin : String 
            } 
          ] 
      } 
    ] 
  }

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
  }

  insertNewAnagram() {
    this.unsersolvedTerms = null;
    this.unresolvedTermsBool = false;
    this.unresolvedTermsMessage = null;

    if(this.anagramQuestion == null && this.anagramFile == null) {
      this.failMessage = "**** Nije uneto anagram-pitanje! ****";
      return;
    }

    if(this.anagramAnswer == null && this.anagramFile == null) {
      this.failMessage = "**** Nije unet anagram-odgovor! ****";
      return;
    }

    if(this.anagramFile != null && (this.anagramAnswer != null ||  this.anagramQuestion != null)) {
      this.failMessage = "**** Birajte samo jedan tip unosa! ****";
      return;
    }

    if(this.anagramFile != null) {
      this.service.insertNewAnagram(this.anagramFile, "").subscribe((responseStatus)=> {
        if(responseStatus){
            this.failMessage = null;
            this.successMessage = "**** Anagrami su uneti! ****";
          }
          else {
            this.failMessage = "**** Doslo je do greske u sistemu! :( ****";
            this.successMessage = null;
          }
  
          this.anagramAnswer = null;
          this.anagramQuestion = null;
          this.anagramFile = null;
      });
    } else {
      this.service.insertNewAnagram(this.anagramQuestion, this.anagramAnswer).subscribe((responseStatus)=> {
        if(responseStatus){
            this.failMessage = null;
            this.successMessage = "**** Anagram je unet! ****";
          }
          else {
            this.failMessage = "**** Doslo je do greske u sistemu! :( ****";
            this.successMessage = null;
          }
  
          this.anagramAnswer = null;
          this.anagramQuestion = null;
          this.anagramFile = null;
      });
    }
  }

  onFileChanged(event): void{
    var file : File = event.target.files[0];
    var myReader : FileReader = new FileReader();
    
    myReader.onloadend = (e) => {
      this.anagramFile = myReader.result.toString();
    }

    myReader.readAsText(file);
  }

  insertNewGeoTerms() : void {
    for(let i = 0; i < this.geographyData.Geografija.length; i++) {
      for(let j = 0; j < this.geographyData.Geografija[i].odgovori.length; j++) {
        let terms : Array<String> = this.geographyData.Geografija[i].odgovori[j].termin.split(',');
        for(let k = 0; k < terms.length; k++) {
          this.service.insertNewGeo(this.geographyData.Geografija[i].odgovori[j].kategorija, terms[k]).subscribe((responseStatus) => {
            if(responseStatus) {
              this.failMessage = null;
              this.successMessage = "**** Termini su uneti! ****";
            } else {
              this.failMessage = "**** Doslo je do greske! :( ****";
              this.successMessage = null;
            }
          });
        }
      }
    }
  }

  onFileChangedGeo(event): void{
    var file : File = event.target.files[0];
    var myReader : FileReader = new FileReader();
    
    myReader.onloadend = (e) => {
      this.geographyData = JSON.parse(myReader.result.toString());
    }

    myReader.readAsText(file);
  }

  resolveTerms() {
    this.unresolvedTermsMessage = null;
    this.unresolvedTermsBool = true;
    this.service.getAllUnresolvedTerms().subscribe((listOfUnsresolvedTerms : Array<UnresolvedTerm>)=> {
      if(listOfUnsresolvedTerms) {
          this.unsersolvedTerms = listOfUnsresolvedTerms;
        }
        else {
          this.unsersolvedTerms = null;
          this.unresolvedTermsMessage = "**** Nema nerazresenih termina! ****";
        }
    });
  }

  acceptSymbol(term) {
    this.unresolvedTermsMessage = null;
    this.service.acceptTerm(term.name).subscribe((responseStatus)=> {
      if(responseStatus) {
        this.unresolvedTermsMessage = "**** Prihvacen termin " + term.name + " ****";
      }
      else {
        this.unresolvedTermsMessage = "**** Doslo je do greske prilikom brisanja! ****";
      }
    });
  }

  declineSymbol(term) {
    this.unresolvedTermsMessage = null;
    this.service.declineTerm(term.name).subscribe((responseStatus)=> {
      if(responseStatus){
        this.unresolvedTermsMessage = "**** Odbijen termin " + term.name + " ****";
      }
      else {
        this.unresolvedTermsMessage = "**** Doslo je do greske prilikom brisanja! ****";
      }
    });
  }
}
