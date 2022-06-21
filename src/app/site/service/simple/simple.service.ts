import { Injectable } from '@angular/core';
import * as urls from '../../domain/Shared/global';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Persona } from '../../domain/shared/Persona';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class SimpleService {
  constructor(private http: Http) { }

  busquedaCompetidorSimple(
    search: string,
    cronogramaId: number
  ): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlSingle
        }/api/Single/BusquedaCompetidor?search=${search}&cronogramaId=${cronogramaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }



  busquedaCompetidorEquipo(
    search: string,
    cronogramaId: number,
    parametroTipoId: number
  ): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlGeneric
        }/api/Generic/GetEquipoConjunto?cronogramaId=${cronogramaId}&parametroTipoId=${parametroTipoId}&buscar=${search}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }
  /*nuevo*/
  GetFasesConjunto(
    eventoId: number,
    deporteId: number,
    parametroRamaId: number,
    parametroTipoId: number
  ): Promise<any[]> {
    return this.http
      .get(
        // tslint:disable-next-line:max-line-length
        `${
        urls.urlGeneric
        // tslint:disable-next-line:max-line-length
        }/api/Generic/GetFases?eventoId=${eventoId}&deporteId=${deporteId}&parametroRamaId=${parametroRamaId}&parametroTipoId=${parametroTipoId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }
  GetCronogramaConjunto(
    eventoId: number,
    deporteId: number,
    parametroRamaId: number,
    parametroTipoId: number,
    parametroFaseId: number,
    pruebaId: number
  ): Promise<any[]> {
    console.log(
      `${
      urls.urlGeneric
      //// tslint:disable-next-line:max-line-length
      }/api/Generic/GetCronogramaFases?eventoId=${eventoId}&pruebaId=${pruebaId}&deporteId=${deporteId}&parametroRamaId=${parametroRamaId}&parametroTipoId=${parametroTipoId}&parametroFaseId=${parametroFaseId}`
    );
    return this.http
      .get(
        `${
        urls.urlGeneric
        // tslint:disable-next-line:max-line-length
        }/api/Generic/GetCronogramaFases?eventoId=${eventoId}&pruebaId=${pruebaId}&deporteId=${deporteId}&parametroRamaId=${parametroRamaId}&parametroTipoId=${parametroTipoId}&parametroFaseId=${parametroFaseId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }
  /**/
  GetPlanillaAtletismo(): Promise<any> {
    return this.http
      .get(
        `${urls.urlSingle}/api/single/GetPlanillaAtletismo?pruebaEventoId=34`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  SavePlanilla(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlSingle}/api/single/SavePlanilla`,
      data,
      options
    );
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  SaveMedallero(
    cronogramaId: number,
    competidorId: number,
    posicion: number,
    ParametroMedallaId: number,
    sembrado: string,
    tiempo: number,
    marca: number,
    esGanador: number,
    esRecord: boolean
  ) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    // tslint:disable-next-line:max-line-length
    return this.http.post(
      `${
      urls.urlSingle
      // tslint:disable-next-line:max-line-length
      }/api/Single/UpdateCronogramaCompetidor?cronogramaId=${cronogramaId}&competidorId=${competidorId}&posicion=${posicion}&ParametroMedallaId=${ParametroMedallaId}&sembrado=${sembrado}&tiempo=${tiempo}&marca=${marca}&esGanador=${esGanador}&esRecord=${esRecord}`,
      options
    );
  }


  getListaGanadores(cronogramaId: number): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlSingle
        }/api/Single/GetCompetidorPrueba?cronogramaId=${cronogramaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }
  guardarGanador(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlGeneric}/api/Generic/SaveCronogramaCompetidor`,
      data,
      options
    );
  }

  eliminarGanador(
    cronogramaId: number,
    competidorId: number
  ): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    // tslint:disable-next-line:max-line-length
    return this.http.delete(
      `${
      urls.urlGeneric
      }/api/Generic/DeleteCronogramaCompetidor?cronogramaId=${cronogramaId}&competidorId=${competidorId}`,
      options
    );
  }


  UpdateEstadoCronograma(
    cronogramaId: number,
    estadoId: number
  ): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    // tslint:disable-next-line:max-line-length
    return this.http.post(
      `${
      urls.urlGeneric
      }/api/Generic/UpdateCronogramaEstado?cronogramaId=${cronogramaId}&estadoId=${estadoId}`,
      options
    );
  }

  UpdateEstado(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlSingle}/api/Single/UpdateEstado`,
      data,
      options
    );
  }

  GetParticipantes(
    eventoId: number,
    deporteId: number,
    delegacionId: number
  ): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlSite
        }/api/Site/getCompetidorEvento?EventoId=${eventoId}&personaId=0&deporteId=${deporteId}&delegacionId=${delegacionId}&search=`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }

  GetDelegaciones(eventoId: number): Promise<any> {
    return this.http
      .get(`${urls.urlSite}/api/Site/GetDelegaciones?eventoId=${eventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }


  GetCompetidor(cronogramaId: number, posicion: number): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlSingle
        }/api/Single/GetCompetidor?cronogramaId=${cronogramaId}&posicion=${posicion}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
}
