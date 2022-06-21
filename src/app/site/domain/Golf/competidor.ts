import { GolfCompetidor } from 'app/site/domain/Golf/golfCompetidor';

export class Competidor {
    CompetidorId: number;
    EquipoId: number;
    PersonaId: number;
    DisciplinaId: number;
    Categoria: string;
    EventoDeportivoId: number;
    GCompetidor: GolfCompetidor;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
