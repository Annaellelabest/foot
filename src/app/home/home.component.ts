import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Match } from '../match';
import { Router } from '@angular/router';
import { VariablesGlobales } from '../variablesGlobales';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  matches: Array<Match[]> = [];
  currChampionnat: string = '';
  today: Date = new Date();
  currDay: Date = new Date();
  jours: Array<string> = new Array('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi')

  constructor(private dataService: DataService, private router: Router, private Global: VariablesGlobales) { }

  ngOnInit(): void {
    this.getMatchesToday()
    this.Global.intervalID = setInterval(() => this.getMatchesToday(), 30000)
  }

  getMatchesToday() {
    this.dataService.getMatchesFromDate(this.getCurrDate(this.getDateAt()), this.getCurrDate(this.getDateAt(1))).subscribe(
      (matches: Match[]) => this.matches = this.setChampionnats(matches).map((championnat: string) => matches.filter(match => match.competition.name === championnat))
    )
  }

  setChampionnats = (matches: Match[]) => [...new Set(matches.map((match: Match) => match.competition.name))].sort((a: string, b: string) => b.localeCompare(a))

  setCurrentChampionnat(championnat: string) {
    this.currChampionnat = championnat
  }

  changeMatchDay(offset: number) {
    this.currDay = this.getDateAt(offset)
    this.getMatchesToday()
  }


  getDateAt(offset?: number): Date {
    return new Date(this.currDay.getTime() + (offset ?? 0) * 24 * 60 * 60 * 1000)
  }

  getCurrDate(date: Date): string {
    let year = date.getFullYear()
    let month = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
    return year + '-' + month + '-' + day
  }

  detailCompetition(id: string) {
    clearInterval(this.Global.intervalID)
    this.router.navigate(['/competition', id])
  }

}
