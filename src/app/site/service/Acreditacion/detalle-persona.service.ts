import { Injectable } from '@angular/core';
import { DetallePersona } from '../../domain/Acreditacion/detallePersona';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import * as urls from '../../domain/Shared/global';

@Injectable()
export class DetallePersonaService {

  constructor(private http: Http) { }

  getDetalleAcreditacionPersona(personaId: number): Promise<DetallePersona[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetAcreditacionDetallePersona?personaId=${personaId}`)
      .toPromise()
      .then((r: Response) => r.json() as DetallePersona[])
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
  getDetalleInscripcionEnvento(eventoId: number): Promise<DetallePersona[]> {
    console.log('Ya esta',eventoId)
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetInscripcionEvento?eventoId=${eventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as DetallePersona[]);
  }

  getDetalleInscripcionEnventoDelegacion(eventoId: number, delegacionId: number): Promise<DetallePersona[]> {
    console.log('Ya estamos',eventoId,delegacionId)
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetInscripcionEnventoDelegacion?eventoId=${eventoId}&delegacionId=${delegacionId}`)
      .toPromise()
      .then((r: Response) => r.json() as DetallePersona[]);
  }

  getFoto(personaId: number,Sexo :string): Promise<string> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetFotoPersona?personaId=${personaId}&sex=${Sexo}`)
      .toPromise()
      .then((r: Response) => r.json() as string)
      .catch(this.handleError);
  }
}
