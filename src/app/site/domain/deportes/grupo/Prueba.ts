export class Prueba {

    PruebaId: number;
    DeporteId: number;
    PruebaDescripcion: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
