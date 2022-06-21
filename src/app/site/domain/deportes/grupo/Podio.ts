export class Podio {

    PruebaEventoId: number;
    Fecha?: Date;
    HoraProgramada: string;
    Deporte: string;
    Prueba: string;
    RamaDeporte: string;
    Equipo: string;
    Delegacion: string;
    Medalla: string;
    Representacion: string;
    ParametroMedallaId: number;

    // componentes
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
