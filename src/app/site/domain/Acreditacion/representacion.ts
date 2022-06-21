export class Representacion {
    RepresentacionId: number;
    DelegacionId: number;
    Representacion: string;
    Codigo: string;
    Distrito: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
