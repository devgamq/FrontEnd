export class Equipo {

    EquipoId: number;
    EquipoDescripcion?: string;
    DelegacionId: number;
    PruebaEventoId: number;

    // componentes
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
