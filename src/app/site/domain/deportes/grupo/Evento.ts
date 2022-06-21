export class Evento {

    EventoId: number;
    Nombre: string;
    Version: string;
    Ubicacion: string;
    Inicio: Date;
    Fin: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
