export class Jugador {

    Nombre: string;
    Apellido: string;
    Numero: number;
    Titular: number;
    Posicion: string;
    PersonaId: number;
    PlanillaPersonaId: number;
    Capitan: boolean;
        constructor(values: Object = {}) {
            Object.assign(this, values);
        }
    
    }