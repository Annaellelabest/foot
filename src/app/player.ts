import { Equipe } from "./equipe";

export interface Player {
    id: number;
    name: string;
    nationality: string;
    flag: string;
    position: string;
    number: number;
    age?: number;

    team?: Equipe;

    goals?: number;
    assists?: number;
    penalties?: number;
}
