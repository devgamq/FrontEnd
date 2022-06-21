export class GolfCompetidor {
    PersonaId: number;
    DisciplinaId: number;
    EventoDeportivoId: number;
    CategoriaId: number;
    Handicap: number;
    Club: string;

    constructor(values: Object= {}) {
        Object.assign(this, values);
    }
}
