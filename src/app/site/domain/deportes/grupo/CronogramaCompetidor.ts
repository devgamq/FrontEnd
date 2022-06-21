import { Competidor } from 'app/site/domain/shared/Competidor';
export class CronogramaCompetidor {

    CronogramaId: number;
    CompetidorId: number;
    Posicion: number;
    Puntaje: number;
    Marca: number;
    Tiempo: string;
    EsGanador: boolean;
    ParametroMedallaId: number;

    // componentes
    Competidor: Competidor;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
