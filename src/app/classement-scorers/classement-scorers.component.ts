import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VariablesGlobales } from '../variablesGlobales';

@Component({
  selector: 'app-classement-scorers',
  templateUrl: './classement-scorers.component.html',
  styleUrls: ['./classement-scorers.component.css']
})
export class ClassementScorersComponent implements OnInit {

  @Input() players: Array<any> = [];

  constructor(private router: Router, private Global: VariablesGlobales) { }

  ngOnInit(): void { }

  detailEquipe(id: string) {
    clearInterval(this.Global.intervalID)
    this.router.navigate(['/equipe', id])
  }

  detailPlayer(id: number) {
    clearInterval(this.Global.intervalID)
    this.router.navigate(['/player', id])
  }
  
}
