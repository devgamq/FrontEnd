import { Persona } from 'app/site/domain/shared/persona';
import { PruebaEvento } from 'app/site/domain/deportes/grupo/PruebaEvento';
import { Equipo } from 'app/site/domain/deportes/grupo/Equipo';

export class Competidor {
    CompetidorId: number;
    EquipoId: number;
    PersonaId: number;
    PruebaEventoId: number;
    Activo: boolean;
    MarcaTiempoInicial: string;
    Posicion: string;


    // componentes
    Persona?: Persona;
    PruebaEvento?: PruebaEvento;
    Equipo?: Equipo;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
