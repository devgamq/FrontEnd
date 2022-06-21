import { PruebaEvento } from 'app/site/domain/deportes/grupo/PruebaEvento';
import { Instalacion } from 'app/site/domain/deportes/grupo/Instalacion';
import { Evento } from 'app/site/domain/deportes/grupo/Evento';
import { CronogramaCompetidor } from 'app/site/domain/deportes/grupo/CronogramaCompetidor';

export class Cronograma {

    CronogramaId: number;
    Fecha: Date;
    HoraProgramada: string;
    HoraInicio: string;
    HoraFin: string;
    PruebaEventoId: number;
    InstalacionId: number;
    ParametroFaseId: number;
    ParametroTipoId: number;
    Concluido: boolean;
    EventoId: number;
    Estado: string;

    // Componentes
    PruebaEvento?: PruebaEvento;
    Instalacion?: Instalacion;
    Evento?: Evento;

    CronogramaCompetidor: CronogramaCompetidor[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
