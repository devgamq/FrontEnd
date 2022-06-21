export class Planilla {

    PlanillaId: number;
    CronogramaId: number;
    Fecha: Date;
    HoraInicio: string;
    HoraFin: string;
    SistemaEquipoA: string;
    SistemaEquipoB: string;
    Estado: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
