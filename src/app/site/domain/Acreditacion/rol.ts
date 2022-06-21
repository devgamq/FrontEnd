export class Rol {
  RolId = 0;
  RolDescripcion: string;
  Codigo: string;
  GrupoId: number;
  EsCompetidor: boolean;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
