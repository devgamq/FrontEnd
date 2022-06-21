export class Punto {

    Color: any;
    Estado: any;
    Nro: number;
    Puntaje: number;
    PuntajeMostrar: number;
    PuntoId: number;


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
