export class Competidor {
    Equipo: string;
    CompetidorId: number;
    EquipoId: number;
    PruebaEventoId: number;
    PlanillaId: number;
    EquipoSigla: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
