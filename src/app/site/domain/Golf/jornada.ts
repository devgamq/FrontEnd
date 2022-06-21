export class GolfJornada {
    JornadaId: number;
    Fecha: Date;
    EventoDeportivoId: number;
    Descripcion: string;
    NombreCorto: string;
    FechaRegistro: Date;
    UsuarioId: number;

    constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
