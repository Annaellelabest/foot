import { Equipe } from "./equipe";
import { Scores } from "./scores";

export interface Bracket {
    team1: Equipe;
    team2?: Equipe;

    scores?: Scores[][];
    duration: string[];
    status: string[];

    winner?: Equipe;
}
