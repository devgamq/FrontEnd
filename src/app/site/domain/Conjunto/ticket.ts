export class Ticket {

    Id: number;
    tkt: number;
    fecha: string;
    hora: string;
    estado: boolean;
    mesa: number;
    tiempo: string;
    servicio: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
