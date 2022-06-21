export class Marcador {

    competidorIdA: number;
    competidorIdB: number;
    planillaId: number;
    deporteId: number;
    control: number;
    visor: number;
    EquipoA: string;
    EquipoB: string;
    tiempo: Number;
    GolesA: number;
    GolesB: number;
    tiroEsquinaA: number;
    tiroEsquinaB: number;
    tiroPorteriaA: number;
    tiroPorteriaB: number;
    tapadaA: number;
    tapadaB: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
