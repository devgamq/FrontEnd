export class Delegacion {
   DelegacionId: number;
   Nombre: string;
   NombreCorto: string;
   EventoId: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
