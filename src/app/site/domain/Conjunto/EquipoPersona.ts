export class EquipoPersona {
  EquipoId: number;
  PersonaId: number;
  NroCamiseta: number;
  Nombre: string;
  Posicion: string;
  Delegacion: string;
  Representacion: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
