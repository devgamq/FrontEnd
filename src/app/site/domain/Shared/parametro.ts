export class Parametro {
    ParametroId: number;
    Codigo: number;
    Descripcion: string;
    Abreviatura: string;
    Observacion: string;
    ParametroTabla: string;
    NivelVisivilidad: number;

    /*Parametros de Generic*/
    ParametroDescripcion: string;
    Detalle: string;
    Tabla: string;
    Visible: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
