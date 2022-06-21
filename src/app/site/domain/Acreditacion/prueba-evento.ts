export class PruebaEvento {
    PruebaEventoId: number;
    EventoId: number;
    PruebaId: number;
    ParametroRamaId: number;
    Color: string;
    ParticipanteMin: number;
    ParticipanteMax: number;
    EsIndividual: boolean;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
