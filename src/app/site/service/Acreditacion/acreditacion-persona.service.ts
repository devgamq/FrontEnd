import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as urls from '../../domain/Shared/global';
import {Persona} from 'app/site/domain/shared/persona';

@Injectable()
export class AcreditacionPersonaService {

  constructor(private http: Http) { }

  setAcrePersonaInscrita(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(`${urls.urlGeneric}/api/Generic/SaveAcreditacionPersonaInscrita2`, data, options);
  }

  setAcrePersonaInscritaFrog(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(`${urls.urlGeneric}/api/Generic/SaveAcreditacionPersonaInscritaFrog`, data, options);
  }

  getPesonaByCI(search: string): Promise<string[]> {
      // tslint:disable-next-line:no-debugger
 
        return this.http
            .get(`${urls.urlGeneric}/api/Generic/SearchPersona?search=${search}`)
            .toPromise()
            .then((r: Response) =>
                r.json() as string[]);
    }
    getSearchPersona(query: string): Promise<Persona[]> {
           return this.http
        .get(`${urls.urlGeneric}/api/Generic/SearchPersona?search=${query}`)
      .toPromise()
      .then((r: Response) => r.json() as Persona[])
      .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
      return Promise.reject(error.message || error);
  }
}
