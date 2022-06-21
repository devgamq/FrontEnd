export class GolfGrupos {
  GrupoId: number;
  Descripcion: string;

  // GolfCompetidorJornada
  CompetidorId: string;
  JornadaId: number;
  UsuarioId: number;
  Posicion: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
