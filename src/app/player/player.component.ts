import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { DataService } from '../data.service';
import { Match } from '../match';
import { Player } from '../player';
import { VariablesGlobales } from '../variablesGlobales';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private dataService: DataService, private router: Router, private Global: VariablesGlobales) { }

  player!: Player;
  matches: Array<Match> = [];

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      map((params: ParamMap) => params.get('id') ?? ''),
      switchMap((id: string) => forkJoin({
        player: this.dataService.getPlayerFrom(id),
        matches: this.dataService.getMatchesFromPlayer(id)
      }))
    ).subscribe({
      next: ({ player, matches }) => { this.player = player, this.matches = matches },
      error: () => this.router.navigate(['/home'])
    })
    this.Global.intervalID = setInterval(() => this.dataService.getMatchesFromPlayer(this.player.id.toString()).subscribe((matches: Match[]) => this.matches = matches), 30000)
  }

  detailCompetition(id: string) {
    clearInterval(this.Global.intervalID)
    this.router.navigate(['/competition', id])
  }

  detailEquipe(id: number) {
    clearInterval(this.Global.intervalID)
    this.router.navigate(['/equipe', id])
  }

}
