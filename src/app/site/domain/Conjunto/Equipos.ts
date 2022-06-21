
export class Equipos {
    
        EquipoId: number;
        Equipo: string;
        DelegacionId: number;
        PruebaEventoId: number;
        Nombre:string;
      
            constructor(values: Object = {}) {
                Object.assign(this, values);
            }
        
        }