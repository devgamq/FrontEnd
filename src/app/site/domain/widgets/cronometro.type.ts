export class Cronometro {
    Titulo: string;
    hora: number;
    minuto: number;
    segundo: number;
    horaTope: number;
    minutoTope: number;
    segundoTope: number;
    accion: number;
    dia: number;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
