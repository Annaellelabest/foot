import { Bracket } from "./bracket";
import { Equipe } from "./equipe";
import { Player } from "./player";

export interface Classement {
        class: string;
        type: string;
        group: string;
        stage: string;
        data: Array<Equipe | Player | Bracket>;
}
