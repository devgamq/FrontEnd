export class Instalacion {

    InstalacionId: number;
    InstalacionDescripcion: string;
    Direccion: string;
    ParametroTipoInstalacionId: number;
    Codigo: string;
    Latitud: number;
    Longitud: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
