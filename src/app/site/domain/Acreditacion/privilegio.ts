export class Privilegio {
    PrivilegioId: number;
    PrivilegioDescripcion: number;
    Codigo: string;
    ParametroTipoPrivilegioId: number;
    ParametroDescripcion: string;
    Posicion: number;
    Orden: number;
    ParametroTipoMostrarId: number;
    EventoId: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
