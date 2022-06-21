export class Sexo {
  ParametroRamaId: number;
  Nombre: string;
  PruebaEventoId: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
