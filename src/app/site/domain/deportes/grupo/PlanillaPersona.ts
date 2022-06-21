import { Persona } from 'app/site/domain/shared/Persona';
import { Parametros } from 'app/site/domain/deportes/grupo/Parametros';

export class PlanillaPersona {

    PlanillaPersonaId: number;
    PlanillaId: number;
    PersonaId: number;
    CompetidorId: number;
    NumeroCamiseta: number;
    Posicion: string;
    ParametroRolId: number;
    Capitan: boolean;

    // Componentes
    Persona?: Persona;
    Parametros?: Parametros;
    FotoUrl: any;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
