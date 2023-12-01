import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { DataService } from '../data.service';
import { Equipe } from '../equipe';
import { Match } from '../match';
import { VariablesGlobales } from '../variablesGlobales';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent implements OnInit {

  equipe!: Equipe;
  pastMatches: Array<Match> = [];
  upcomingMatches: Array<Match> = [];
  positions: Array<string> = ["Goalkeeper", "Defence", "Midfield", "Offence", "Coach"];

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private router: Router, private Global: VariablesGlobales) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap) => params.get('id') ?? ''),
      switchMap((id: string) => forkJoin({
        equipe: this.dataService.getEquipeFrom(id),
        matches: this.dataService.getMatchesFromEquipe(id)
      }))
    ).subscribe({
      next: ({ equipe, matches }) => {
        this.equipe = equipe
        this.pastMatches = matches.filter((match: Match) => match.status === "FINISHED").reverse()
        this.upcomingMatches = matches.filter((match: Match) => match.status !== "FINISHED")
      },
      error: () => this.router.navigate(['/home'])
    })
    this.Global.intervalID = setInterval(() => this.dataService.getMatchesFromEquipe(this.equipe.code.toString()).subscribe((matches: Match[]) => {
      this.pastMatches = matches.filter((match: Match) => match.status === "FINISHED").reverse()
      this.upcomingMatches = matches.filter((match: Match) => match.status !== "FINISHED")
    }), 30000)
  }

  detailCompetition(id: string) {
    clearInterval(this.Global.intervalID)
    this.router.navigate(['/competition', id])
  }

  detailPlayer(id: number) {
    clearInterval(this.Global.intervalID)
    this.router.navigate(['/player', id])
  }

}
