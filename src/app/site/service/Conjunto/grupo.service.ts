import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
@Injectable()
export class GrupoService {

  constructor(private http: Http) { }
  RegistroGrupo(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlGeneric}/api/Generic/SaveCronograma`,
      data,
      options
    );
  }
  GetGruposPruebasEvento(
    PruebaEventoId: number
  ): Promise<any> {
    return this.http
      .get(
        `${
          urls.urlConjunto
        }/api/Set/getGruposPruebasEvento?PruebaEventoId=${PruebaEventoId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  SaveGrupo(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/SaveGrupo`,
      data,
      options
    );
  }
  UpdateGrupo(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/UpdateGrupo`,
      data,
      options
    );
  }
  DeleteGrupo(GrupoId: number): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(
      `${
        urls.urlConjunto
      }/api/Set/DeleteGrupo?GrupoId=${GrupoId}`,
      options
    );
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
