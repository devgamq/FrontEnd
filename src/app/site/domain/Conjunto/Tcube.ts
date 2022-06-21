export class Tcube {

    Id: number;
    mesa: number;
    fecha: string;
    tkt: number;
    

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
