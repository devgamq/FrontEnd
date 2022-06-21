import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers} from '@angular/http';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Persona } from '../../domain/Shared/persona';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';


@Injectable()
export class DeportistaService {

  constructor(private http: Http) { }

  getDeportistas(eventoId: number, disciplinaId: number): Promise<Persona[]> {

    return this.http
      .get(`${urls.urlCommon}/api/Common/GetDeportistasFiltro?eventoId=${eventoId}&disciplinaId=${disciplinaId}`)
      .toPromise()
      .then((r: Response) => r.json() as Persona[]);
  }

  getDeportista(personaId: number): Promise<string[]> {
    return this.http
      .get(`${urls.urlGolf}/api/Golf/GetGolfCompetidorByPersonaId?personaId=${personaId}`)
      .toPromise()
      .then((r: Response) => r.json() as string[]);
  }

  setDeportista(data: FormGroup): Observable<Response> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(`${urls.urlCommon}/api/Common/SaveCompetidor`, data.value, options);
  }

  getResultados(personaId: number, eventoId: number): Promise<string[]> {
    return this.http
      .get(`${urls.urlGolf}/api/Golf/GetResultadosCompetidor?personaId=${personaId}&eventoId=${eventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as string[]);
  }
}
