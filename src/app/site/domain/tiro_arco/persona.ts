export class Persona {

    Color: any;
    Nombre: any;
    PersonaId: number;


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
