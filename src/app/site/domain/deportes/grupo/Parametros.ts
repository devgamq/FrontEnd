export class Parametros {

    ParametroId: number;
    Codigo: number;
    ParametroDescripcion: string;
    Abreviatura: string;
    Detalle: string;
    Tabla: string;
    Visible: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
