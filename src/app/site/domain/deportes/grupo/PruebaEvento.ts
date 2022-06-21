import { Prueba } from 'app/site/domain/deportes/grupo/Prueba';
import { Evento } from 'app/site/domain/deportes/grupo/Evento';

export class PruebaEvento {

    PruebaEventoId: number;
    EventoId: number;
    PruebaId: number;
    ParametroRamaId: number;
    Color: string;
    ParticipanteMin: number;
    ParticipanteMax: number;
    EsIndividual: boolean;

    // componentes
    Prueba: Prueba;
    Evento: Evento;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
