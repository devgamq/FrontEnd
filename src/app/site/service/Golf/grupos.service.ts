import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, ResponseContentType  } from '@angular/http';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { GolfGrupos } from '../../domain/Golf/grupos';
// import { JugadoresGrupos } from '../../domain/Golf/grupos';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as urls from '../../domain/Shared/global';

import 'rxjs/Rx';

@Injectable()
export class GruposService {

    constructor(private http: Http) { }

    getGolfGrupos(jornadaId: number, categoriaId: number): Promise<GolfGrupos[]> {
        return this.http
            .get(`${urls.urlGolf}/api/Golf/GetCompetidoresGrupos?jornadaId=${jornadaId}&categoriaId=${categoriaId}`)
            .toPromise()
            .then((r: Response) =>
                r.json().data as GolfGrupos[]);
    }

    getGolfCompetidoresSinJornada(categoriaId: number, jornadaId: number, eventoId: number): Promise<string[]> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlGolf}/api/Golf/GetCompetidoresSinJornada?categoriaId=${categoriaId}&jornadaId=${jornadaId}&eventoId=${eventoId}`)
            .toPromise()
            .then((r: Response) => r.json() as string[]);
    }

    getGolfCompetidoresConJornada(grupoId: number): Promise<string[]> {
        return this.http
            .get(`${urls.urlGolf}/api/Golf/GetCompetidoresConJornada?grupoId=${grupoId}`)
            .toPromise()
            .then((r: Response) => r.json() as string[]);
    }

    getGolfJugadores(grupoId: number): Promise<any[]> {
        return this.http
            .get(`${urls.urlGolf}/api/Golf/GetGolfJugadores?grupoId=${grupoId}`)
            .toPromise()
            .then((r: Response) => r.json() as any[]);
    }

    setGolfGrupoCompetidores(data: any): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${urls.urlGolf}/api/Golf/SaveGolfGrupoCompetidores`, data, options);
    }

    setGolfGrupoCompetidoresEstado(data: any): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${urls.urlGolf}/api/Golf/UpdateGolfCompetidorEstado`, data, options);
    }

    deleteGrupo(grupoId: number): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http
            .delete(`${urls.urlGolf}/api/Golf/DeleteGolfGrupoCompetidores?grupoId=${grupoId}`, options);
    }
    GetDetalleGrupos(jornadaId: number, categoriaId: number, eventoId: number): Promise<any> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlReport}/api/Report/GetDetalleJornada?jornadaId=${jornadaId}&categoriaId=${categoriaId}&eventoId=${eventoId}`, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then((r: Response) => {
                return new Blob([r.blob()], { type: 'application/pdf' });
            });
    }
}
