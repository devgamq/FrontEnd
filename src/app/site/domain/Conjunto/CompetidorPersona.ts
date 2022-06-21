import { Persona } from '../Shared/persona';
import { ParametrosPersona } from './parametrospersona';
export class CompetidorPersona {

    PlanillaPersonaId: number;
    PlanillaId: number;
    PersonaId: number;
    CompetidorId: number;
    NumeroCamiseta: number;
    Posicion: string;
    ParametroRolId: number;
    Persona: Persona;
    Parametros: ParametrosPersona;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
