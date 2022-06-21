export class Atletismo {

    CompetidorId: number;
    PruebaEventoId: number;
    PruebaEventoIdCalcular: number;
    Marca: number;
    Tiempo: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
