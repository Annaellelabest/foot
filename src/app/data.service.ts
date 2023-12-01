import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Arbitre } from './arbitre';
import { Classement } from './classement';
import { Competition } from './competition';
import { DatasEquipe } from './datas-equipe';
import { Equipe } from './equipe';
import { Match } from './match';
import { Player } from './player';
import { Scores } from './scores';
import { VariablesGlobales } from './variablesGlobales';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  requestOptions = { headers: new HttpHeaders({ 'X-Auth-Token': this.Global.token }) }

  BaseUrl = 'https://api.football-data.org/v4/'

  area: Array<{ name: string, flag: string }> = []
  flag: Array<string> = []

  //Import les données du json avec les drapeaux pour chaques pays
  constructor(private httpClient: HttpClient, private Global: VariablesGlobales) {
    fetch('../assets/area.json')
      .then((r) => r.json())
      .then((data) => {
        data.forEach((elem: any) => {
          elem.ids.forEach((id: number) => this.area[id] = { name: elem.name, flag: elem.flag })
        });
      })
    fetch('../assets/flag.json').then((r) => r.json()).then((data) => this.flag = data)
  }

  //liste des requetes à l'API

  getMatchesFromDate(dateFrom: string, dateTo: string): Observable<Match[]> {
    return this.httpClient.get(this.BaseUrl + 'matches?dateFrom=' + dateFrom + '&dateTo=' + dateTo, this.requestOptions).pipe(
      map((data: any) => this.obj2ArrayMatchs(data))
    );
  }

  getMatchesFrom(code: string): Observable<Match[]> {
    return this.httpClient.get(this.BaseUrl + 'competitions/' + code + '/matches', this.requestOptions).pipe(
      map((data: any) => this.obj2ArrayMatchs(data))
    );
  }

  getAllCompetitions(): Observable<Competition[]> {
    return this.httpClient.get(this.BaseUrl + 'competitions', this.requestOptions).pipe(
      map((data: any) => this.obj2ArrayCompetitions(data))
    );
  }

  getCompetitionFrom(code: string): Observable<Competition> {
    return this.httpClient.get(this.BaseUrl + 'competitions/' + code + '/standings', this.requestOptions).pipe(
      map((data: any) => this.obj2Competition(data))
    );
  }

  getAllTeams(): Observable<Equipe[]> {
    return this.httpClient.get(this.BaseUrl + 'teams?limit=500', this.requestOptions).pipe(
      map((data: any) => this.obj2ArrayTeams(data))
    );
  }

  getEquipeFrom(code: string): Observable<Equipe> {
    return this.httpClient.get(this.BaseUrl + 'teams/' + code, this.requestOptions).pipe(
      map((data: any) => this.obj2Equipe(data))
    );
  }

  getPlayerFrom(code: string): Observable<Player> {
    return this.httpClient.get(this.BaseUrl + 'persons/' + code, this.requestOptions).pipe(
      map((data: any) => this.obj2Player(data))
    );
  }

  getMatchesFromEquipe(code: string): Observable<Match[]> {
    return this.httpClient.get(this.BaseUrl + 'teams/' + code + '/matches', this.requestOptions).pipe(
      map((data: any) => this.obj2ArrayMatchs(data))
    );
  }

  getMatchesFromPlayer(code: string): Observable<Match[]> {
    return this.httpClient.get(this.BaseUrl + 'persons/' + code + '/matches?limit=100', this.requestOptions).pipe(
      map((data: any) => this.obj2ArrayMatchs(data))
    );
  }

  getScorerFrom(code: string): Observable<Classement> {
    return this.httpClient.get(this.BaseUrl + 'competitions/' + code + '/scorers', this.requestOptions).pipe(
      map((data: any) => ({ class: 'Player', type: 'TOTAL', group: 'TOTAL', stage: 'SCORERS', data: this.obj2ArrayScorers(data) }))
    );
  }

  getContains(search: string, values: Array<Competition | Equipe>): Array<Competition | Equipe> {
    return values.filter((el: Competition | Equipe) => el && el.name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0 || ((el.class == 'Competition') ? (el.areaName.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0) : false))
  }

  protected obj2ArrayScorers(obj: any): Player[] { return obj['scorers'].map((el: any) => this.setPlayer(el.player, el, el.team)) }

  protected obj2ArrayTeams(obj: any): Equipe[] { return obj['teams'].map((el: any) => this.setTeam(el)) }

  protected obj2ArrayCompetitions(obj: any): Competition[] { return obj['competitions'].map((el: any) => this.setCompetition(el, el.area)) }

  protected obj2Competition(obj: any): Competition { return this.setCompetition(obj.competition, obj.area, obj.season, obj.standings.map((el: any) => this.setClassement(el, obj.area))) }

  protected obj2Equipe(obj: any): Equipe { return this.setTeam(obj, obj.area) }

  protected obj2Player(obj: any): Player { return this.setPlayer(obj, undefined, obj.currentTeam) }

  protected obj2ArrayMatchs(obj: any): Match[] { return obj['matches'].map((el: any) => this.setMatch(el)) }

  protected setTeam(team: any, area?: any, scores?: Scores, datas?: DatasEquipe): Equipe {
    let equipe: Equipe = {
      class: 'Equipe',
      code: team.id,
      name: team.name,
      shortName: team.shortName,
      logo: team.crest,
      areaName: (this.area[team.id]) ? this.area[team.id].name : (area && area.name) ? area.name : '',
      areaFlag: (this.area[team.id]) ? this.area[team.id].flag : (area && area.flag) ? area.flag : '',
      coach: team.coach ? this.setPlayer(team.coach) : undefined,
      players: team.squad?.map((player: any) => this.setPlayer(player)),
      competitions: team.runningCompetitions?.map((competition: any) => this.setCompetition(competition)),
      score: scores,
      datas: datas
    }
    if (equipe.coach) equipe.coach.position = "Coach";
    return equipe;
  }

  protected setCompetition(competition: any, area?: any, season?: any, classements?: Classement[]): Competition {
    return {
      class: 'Competition',
      id: competition.id,
      name: competition.name,
      code: competition.code,
      logo: competition.emblem?.endsWith('SAM.svg') ? area?.flag : competition.emblem?.endsWith('EUR.svg') ? "https://www.flashscore.com/res/image/data/2i69RRV1-zJXmWPjA.png" : competition.emblem,
      type: competition.type,
      areaName: area?.name ?? "World",
      areaFlag: area?.flag?.endsWith('CLI.svg') ? "https://www.flashscore.com/res/_fs/build/world.b7d16db.png" : area?.flag ?? "https://www.flashscore.com/res/_fs/build/world.b7d16db.png",
      startDate: (season) ? season.startDate : undefined,
      endDate: (season) ? season.endDate : undefined,
      currMatchDay: (season) ? (competition.type == 'LEAGUE') ? season.currentMatchday : undefined : undefined,
      nbTeams: (classements) ? classements![0].data!.length : undefined,
      classements: classements,
    }
  }

  protected setPlayer(player: any, el?: any, team?: any): Player {
    return {
      id: player.id,
      name: player.name,
      nationality: player.nationality,
      flag: this.flag[player.nationality],
      position: player.position,
      number: player.shirtNumber,
      age: player.dateOfBirth ? Math.floor(((new Date()).getTime() - (new Date(player.dateOfBirth)).getTime()) / (1000 * 3600 * 24 * 365.25)) : undefined,
      team: team ? this.setTeam(team) : undefined,
      goals: el ? el.goals : undefined,
      assists: el ? el.assists : undefined,
      penalties: el ? el.penalties : undefined,
    }
  }
  protected setArbitre(el: any): Arbitre {
    return {
      id: el.id,
      name: el.name,
      nationality: el.nationality,
    }
  }

  protected setClassement(el: any, area: any): Classement {
    return {
      class: 'Equipe',
      type: el.type,
      group: el.group,
      stage: el.stage,
      data: el.table.map((el: any) => this.setTeam(el.team, area, undefined, {
        position: el.position,
        playedGames: el.playedGames,
        form: (typeof el.form === 'string') ? el.form.split(',') : [''],
        won: el.won,
        draw: el.draw,
        lost: el.lost,
        points: el.points,
        goalsFor: el.goalsFor,
        goalsAgainst: el.goalsAgainst,
        goalDifference: el.goalDifference,
      }))
    }
  }

  protected setMatch(el: any): Match {
    return {
      id: el.id,
      competition: this.setCompetition(el.competition, el.area),
      duration: el.score.duration,
      winner: el.score.winner,
      homeTeam: this.setTeam(el.homeTeam, el.area, {
        halfTime: el.score.halfTime.home ?? 0,
        regularTime: el.score.fullTime.home - ((el.score.extraTime) ? el.score.extraTime.home : 0) - ((el.score.penalties) ? el.score.penalties.home : 0),
        fullTime: el.score.fullTime.home - ((el.score.penalties) ? el.score.penalties.home : 0),
        penalties: (el.score.penalties) ? el.score.penalties.home : 0
      }),
      awayTeam: this.setTeam(el.awayTeam, el.area, {
        halfTime: el.score.halfTime.away ?? 0,
        regularTime: el.score.fullTime.away - ((el.score.extraTime) ? el.score.extraTime.away : 0) - ((el.score.penalties) ? el.score.penalties.away : 0),
        fullTime: el.score.fullTime.away - ((el.score.penalties) ? el.score.penalties.away : 0),
        penalties: (el.score.penalties) ? el.score.penalties.away : 0
      }),
      matchday: (['ROUND_1', 'LAST_64'].includes(el.stage)) ? 1 :
        (['ROUND_2', 'LAST_32'].includes(el.stage)) ? 2 :
          (['ROUND_3', 'LAST_16'].includes(el.stage)) ? 3 :
            (['ROUND_4', 'QUALIFICATION_ROUND_1', 'QUARTER_FINALS'].includes(el.stage)) ? 4 :
              (['ROUND_5', 'QUALIFICATION_ROUND_2', 'SEMI_FINALS'].includes(el.stage)) ? 5 :
                (['ROUND_6', 'QUALIFICATION_ROUND_3', 'BRONZE', 'THIRD_PLACE', 'FINAL'].includes(el.stage)) ? 6 :
                  (['PLAYOFF_ROUND'].includes(el.stage)) ? 7 :
                    el.matchday,
      date: el.utcDate,
      group: el.group,
      stage: (['ROUND_1', 'ROUND_2', 'ROUND_3', 'ROUND_4', 'ROUND_5', 'ROUND_6'].includes(el.stage)) ? 'GROUP_STAGE' :
        (['QUALIFICATION_ROUND_1', 'QUALIFICATION_ROUND_2', 'QUALIFICATION_ROUND_3', 'PLAYOFF_ROUND'].includes(el.stage)) ? 'QUALIFICATION' :
          (['FINAL', 'BRONZE', 'THIRD_PLACE', 'SEMI_FINALS', 'QUARTER_FINALS', 'LAST_16', 'LAST_32', 'LAST_64'].includes(el.stage)) ? 'FINAL_PHASE' :
            el.stage,
      status: el.status,
      arbitres: el.referees.map((el: any) => this.setArbitre(el)),
      cotes: {
        home: el.odds?.homeWin,
        draw: el.odds?.draw,
        away: el.odds?.awayWin
      }
    }
  }

}