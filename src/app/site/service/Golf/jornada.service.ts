import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { GolfJornada } from '../../domain/Golf/jornada';
import { HoyoPar } from '../../domain/Golf/hoyoPar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as urls from '../../domain/Shared/global';

import 'rxjs/Rx';
@Injectable()
export class JornadaService {
  constructor(private http: Http) { }

  getJornadasList(eventoId: number): Promise<GolfJornada[]> {
    return this.http
      .get(
        `${urls.urlGolf}/api/Golf/GetGolfJornadas?eventoDeportivoId=${eventoId}`
      )
      .toPromise()
      .then((r: Response) => r.json().data as GolfJornada[]);
  }
  getEquiposJornada(eventoId: number, PruebaEventoId: number, par: number): Promise<any[]> {
    return this.http
      .get(
        `${urls.urlGolf}/api/Golf/GetEquiposJornada?EventoId=${eventoId}&PruebaEventoId=${PruebaEventoId}&par=${par}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }

  getJornada(jornadaId: number): Observable<GolfJornada> {
    return this.http
      .get(`${urls.urlGolf}/api/Golf/GetGolfJornada?jornadaId=${jornadaId}`)
      .map((r: Response) => r.json().data as GolfJornada);
  }
  getJornadasID(eventoId: number): Promise<GolfJornada[]> {
    return this.http
      .get(
        `${urls.urlGolf}/api/Golf/GetGolfNroJornadas?EventoId=${eventoId}`
      )
      .toPromise()
      .then((r: Response) => r.json().data as GolfJornada[]);
  }

  setJornada(data: FormGroup): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlGolf}/api/Golf/SaveGolfJornada`,
      data.value,
      options
    );
  }

  setPush(data: FormGroup): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlSite}/api/Site/SendPush`,
      data.value,
      options
    );
  }

  deleteJornada(jornadaId: number): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(
      `${urls.urlGolf}/api/Golf/DeleteGolfJornada?jornadaId=${jornadaId}`,
      options
    );

  }

  getClasificatoriaList(
    jornadaId: number,
    categoriaId: number
  ): Promise<string[]> {
    return this.http
      .get(
        `${
        urls.urlGolf
        }/api/Golf/GetGolfLista?jornadaId=${jornadaId}&categoriaId=${categoriaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as string[]);
  }

  getClasificatoriaListSHCP(
    jornadaId: number,
    categoriaId: number
  ): Promise<string[]> {
    return this.http
      .get(
        `${
        urls.urlGolf
        }/api/Golf/GetGolfListaSHCP?jornadaId=${jornadaId}&categoriaId=${categoriaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as string[]);
  }

  getHoyoPar(hoyoId: number): Promise<HoyoPar[]> {
    return this.http
      .get(`${urls.urlGolf}/api/Golf/GetGolfHoyoPar?tipoHoyoId=${hoyoId}`)
      .toPromise()
      .then((r: Response) => r.json() as HoyoPar[]);
  }
  getEventoDeportivo(eventoId: number): Promise<string[]> {
    return this.http
      .get(`${urls.urlGolf}/api/Golf/GetEventoName?eventoid=${eventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as string[]);
  }
  getGrupoList(
    JornadaId: number,
    CategoriaId: number,
    Fecha: any
  ): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlGolf
        }/api/Golf/GetGrupoPersonas?JornadaId=${JornadaId}&CategoriaId=${CategoriaId}&Fecha=${Fecha}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }
}
