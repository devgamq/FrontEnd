export class Inscrito {

            PersonaId: number;
            Nombres: string;
            Paterno: string;
            Materno: string;
            FechaNacimiento: string;
            Sexo:   string;
            DocumentoIdentidad: string;
            ParametroTipoSangreID: number;
            EventoId: number;
            DelegacionId: number;
            RepresetacionId: number;
            RolId: number;
            Grado: string;
            Talla:string;
            Peso: number;
            Estatura: number;
            Edad:number;
            Codigo: string;
            DeporteId: number;
            PruebaId:number;
            ParametroRamaId: number;
            EsIndividual: boolean;
            EquipoId:number;
            Posicion: string;
            MarcaTiempoIncial:string;
            FotoUrl:string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
