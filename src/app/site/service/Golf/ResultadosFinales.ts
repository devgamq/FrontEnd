import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { GolfTarjeta } from '../../domain/Golf/tarjeta';

@Injectable()
export class ResultadosServices {

    constructor(private http: Http) { }

    getGolfTotalesTorneo(eventoId: number, categoriaId: number): Promise<string[]> {
        return this.http
            .get(`${urls.urlGolf}/api/Golf/GetGolfTotalesTorneo?eventoId=${eventoId}&categoriaId=${categoriaId}`)
            .toPromise()
            .then((r: Response) => r.json() as string[]);
    }
}
