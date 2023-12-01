import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VariablesGlobales } from '../variablesGlobales';

@Component({
  selector: 'app-classement-equipe',
  templateUrl: './classement-equipe.component.html',
  styleUrls: ['./classement-equipe.component.css']
})
export class ClassementEquipeComponent implements OnInit {

  @Input() equipes: Array<any> = [];
  
  constructor(private router: Router, private Global: VariablesGlobales) { }

  ngOnInit(): void { }

  detailEquipe(id: string) {
    clearInterval(this.Global.intervalID)
    this.router.navigate(['/equipe', id])
  }

}
