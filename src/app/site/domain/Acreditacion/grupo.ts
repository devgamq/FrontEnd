export class Grupo {
  GrupoId = 0;
  GrupoDescripcion: string;
  Color: string;
  EventoId: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
