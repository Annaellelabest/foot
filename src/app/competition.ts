import { Classement } from "./classement";

export interface Competition {
    class: string;

    id: number;
    name: string;
    code: string;
    logo: string;
    type: string;

    areaName: string;
    areaFlag: string;

    startDate?: string;
    endDate?: string;
    currMatchDay?: number;
    nbTeams?: number;

    classements?: Array<Classement>;
}
