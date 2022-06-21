export class Jugador {
    Orden: number;
    Nombre: string;
    Id: number;
    Numero: number;
    Titular: number;
    Posicion: string;
    isInscripcion: boolean;
    PersonaId: number;
    PlanillaPersonaId: number;
    Capitan: boolean;


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
