export class Encuentro {

    public Hora: string;
    public EquipoA?: string;
    public EquipoB?: string;
    public Escenario?: string;
    public Estado?: string;
    public Resultado?: string;
    public Puntuacion?: string;
    public EventoId: number;
    public CompetidorAId: number;
    public CompetidorBId: number;
    public EquipoIdA?: number;
    public EquipoIdB?: number;
    public Planilla: number;
    public CronogramaId: number;
    public HoraInicio: string;
    public HoraFin: string;
    public Genero: string;
    public PlanillaEstado: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
