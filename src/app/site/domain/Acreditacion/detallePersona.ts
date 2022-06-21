export class DetallePersona {
  PersonaId: number;
  DocIdentidad: string;
  Paterno: string;
  Materno: string;
  Nombres: string;
  FechaNacimiento: Date;
  Sexo: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
