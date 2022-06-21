import { SucesoPersona } from '../../domain/Conjunto/SucesoPersona';

export class Marcador {

    DeportePeriodoId: number;
    Tiempo: string;
    TiempoCapturado: string;
    CompetidorId: number;
    PlanillaId: number;

    ParametroSucesoId: number;
    NombreParametro: string;
    NombreEquipo: string;
    RegistraPersona: number;
    marcador: number;

    SucesoPersona: SucesoPersona;
    SucesoPersonas: any[];
    posicion_grid: number;
    Valor: number;
    /*
        Orden: number;
        PlanillaPersonaId:number;*/

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
