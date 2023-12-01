import { Competition } from "./competition";
import { DatasEquipe } from "./datas-equipe";
import { Player } from "./player";
import { Scores } from "./scores";

export interface Equipe {
    class: string;

    code: number;
    name: string;
    shortName: string;
    logo: string;

    areaName: string;
    areaFlag: string;

    coach?: Player;
    players?: Array<Player>;
    competitions?: Array<Competition>;

    score?: Scores;

    datas?: DatasEquipe;
}
