import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class VariablesGlobales {
    intervalID: NodeJS.Timer | undefined;
    token: string = 'a1ebb8a12a4a4d10b82658f38ce1edf1';
}