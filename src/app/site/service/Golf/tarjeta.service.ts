import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { Parametro } from '../../domain/Shared/Parametro';
import { GolfTarjeta } from '../../domain/Golf/tarjeta';

@Injectable()
export class TarjetaService {

    constructor(private http: Http) { }

    getTarjeta(competidorJornadaId1: number,
        competidorJornadaId2: number,
        competidorJornadaId3: number,
        competidorJornadaId4: number): Observable<any[]> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlGolf}/api/Golf/GetGolfTarijeta?competidorJornadaId1=${competidorJornadaId1}&competidorJornadaId2=${competidorJornadaId2}&competidorJornadaId3=${competidorJornadaId3}&competidorJornadaId4=${competidorJornadaId4}`)
            .map((r: Response) => r.json() as any[]);
    }

    getTotales(grupoId: number): Observable<any[]> {
        return this.http
            .get(`${urls.urlGolf}/api/Golf/GetGolfTotales?grupoId=${grupoId}`)
            .map((r: Response) => r.json() as any[]);
    }
    getTipoTiros(): Promise<Parametro[]> {
        return this.http
            .get(`${urls.urlGolf}/api/Golf/GetTipoTirosGolf`)
            .toPromise()
            .then((r: Response) => r.json() as Parametro[]);

    }

    setJugada(data: GolfTarjeta): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${urls.urlGolf}/api/Golf/InsertGolfJugada`, data, options);
    }

    setTerminarJuego(competidorJornadaId: number): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        // tslint:disable-next-line:max-line-length
        return this.http.post(`${urls.urlGolf}/api/Golf/CambiarEstadoGolfCompetidorJornada?competidorJornadaId=${competidorJornadaId}`, options);
    }

    setResetearTarjeta(competidorJornadaId: number): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.delete(`${urls.urlGolf}/api/Golf/DeleteGolfPuntaje?competidorJornadaId=${competidorJornadaId}`, options);
    }
}
