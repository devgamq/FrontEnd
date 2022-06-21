import { Deporte } from 'app/site/domain/Acreditacion/Deporte';
import { PruebaEvento } from 'app/site/domain/Acreditacion/prueba-evento';
import { Competidor } from 'app/site/domain/Shared/competidor';


export class InscripcionEvento {
    PersonaId: number;
    EventoId: number;
    DelegacionId: number;
    RepresentacionId: number;
    RolId: number;
    Grado: string;
    Talla: string;
    Peso: number;
    Estatura: number;
    Edad: number;
    Codigo: string;
    DeporteId: number;
    PruebaId: number;
    ParametroRamaId: number;

    Deporte: Deporte;
    PruebaEvento: PruebaEvento;
    Competidor: Competidor;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
