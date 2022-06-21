export class Suceso {

    SucesoId: number;
    DeportePeriodoId: number;
    Tiempo: string;
    CompetidorId: number;
    PlanillaId: number;
    ParametroSucesoId: number;
    Parametro: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
