import { Competidor } from 'app/site/domain/Golf/competidor';

export class Deportista {
    PersonaId: number;
    Nombres: string;
    Nombre: string;
    Paterno: string;
    Materno: string;
    CI: string;
    Extension: string;
    FechaNacimiento: Date;
    Sexo: string;
    Titulo: string;
    Rude: string;
    FechaRegistro: Date;
    Competdor: Competidor;
    Image: string;
    Usuario: string;
    Club: string;

    constructor(values: Object= {}) {
        Object.assign(this, values);
    }
}
