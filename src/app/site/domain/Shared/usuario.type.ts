import { Menu } from './menu.type';


export class Usuario {
    UsuarioId: number;
    Usuario: string;
    OficinaId: string;
    IsActivo: boolean;
    PersonaId: number;
    FechaRegistro: Date;
    TOC: Menu[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
