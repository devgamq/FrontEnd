export class Periodo {

    DeportePeriodoId: number;
    DeporteId: number;
    Periodo: string;
    Abreviatura: string;
    EventoId: number;
    Tiempo: string;
    Punto: number;
    TipoCronometro: number;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
