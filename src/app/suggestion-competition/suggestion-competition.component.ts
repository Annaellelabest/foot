import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Competition } from '../competition';
import { Equipe } from '../equipe';
import { VariablesGlobales } from '../variablesGlobales';

@Component({
  selector: 'app-suggestion-competition',
  templateUrl: './suggestion-competition.component.html',
  styleUrls: ['./suggestion-competition.component.css']
})
export class SuggestionCompetitionComponent implements OnInit {

  @Input() suggestion!: Competition | Equipe;

  constructor(private router: Router, private Global: VariablesGlobales) { }

  ngOnInit(): void { }

  detailSuggestion() {
    clearInterval(this.Global.intervalID)
    if (this.suggestion.class == 'Competition') {
      this.router.navigate(['/competition', this.suggestion.code])
    } else if (this.suggestion.class == 'Equipe') {
      this.router.navigate(['/equipe', this.suggestion.code])
    }
  }

}
