export class GolfCategoria {
  CategoriaId: number;
  Descripcion: string;
  EventoDeportivoId: number;
  Porcentaje: number;
  PruebaEventoId: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
