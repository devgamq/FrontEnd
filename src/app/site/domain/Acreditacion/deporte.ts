export class Deporte {
    DeporteId: number;
    DeporteDescripcion: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
