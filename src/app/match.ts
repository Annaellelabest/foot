import { Arbitre } from "./arbitre";
import { Competition } from "./competition";
import { Equipe } from "./equipe";

export interface Match {
    id: number;
    competition: Competition;
    duration: string;
    winner: string;
    homeTeam: Equipe;
    awayTeam: Equipe;
    matchday: number;
    date: string;
    group: string;
    stage: string;
    status: string;
    cotes: {
        home: number;
        draw: number;
        away: number;
    }
    
    arbitres?: Array<Arbitre>;
}