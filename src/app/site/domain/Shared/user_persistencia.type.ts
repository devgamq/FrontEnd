export class User {
    UsuarioId: number;
    Usuario: string;
    OficinaId: string;
    IsActivo: boolean;
    PersonaId: number;
    FechaRegistro: Date;
    Password: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
