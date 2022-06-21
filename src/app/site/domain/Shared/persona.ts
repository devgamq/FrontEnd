import { Competidor } from 'app/site/domain/Golf/competidor';
import { InscripcionEvento } from 'app/site/domain/Acreditacion/Inscripcion-evento';

export class Persona {
    PersonaId = 0;

    Nombre = '';
    Paterno = '';
    Materno = '';
    CI = '';
    Extension = '';
    FechaNacimiento: Date;
    Sexo = '';
    Titulo: string;
    Rude: string;
    FechaRegistro: Date;
    Competdor: Competidor;
    Image: string;
    Usuario: string;
    Club: string;
    photo: string;
    /**
     * Adicionales para el Modelo Persona de Generic
     */
    Nombres: string;
    DocumentoIdentidad = '';
    ParametroTipoSangreId: number;
    InscripcionEvento: InscripcionEvento;
    NombreCompleto = '';
    Celular : string;
    NroCamiseta: number;
    Fbf: boolean;
    Adf: boolean;
    constructor(values: Object = {}) {
        Object.assign(this, values);

        //    this.InscripcionEvento= new InscripcionEvento() ;
    }

}
