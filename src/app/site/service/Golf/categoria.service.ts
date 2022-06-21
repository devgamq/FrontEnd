import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { GolfCategoria } from '../../domain/Golf/categoria';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';

@Injectable()
export class CategoriaService {

    constructor(private http: Http) { }

    getCategoriasList(eventoId: number): Promise <GolfCategoria[]> {
        return this.http
            .get(`${urls.urlGolf}/api/Golf/GetGolfCategorias?eventoId=${eventoId}`)
            .toPromise()
            .then((r: Response) => r.json().data as GolfCategoria[]);

    }
    getCategoria(categoriaId: number): Promise<GolfCategoria> {
        return this.http
            .get(`${urls.urlGolf}/api/Golf/GetGolCategoria?categoriaId=${categoriaId}`)
            .toPromise()
            .then((r: Response) => r.json() as GolfCategoria);
    }

    setCategoria(data: FormGroup): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${urls.urlGolf}/api/Golf/SaveGolfCategoria`, data.value, options);
    }

    deleteCategoria(categoriaId: number): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http
            .delete(`${urls.urlGolf}/api/Golf/DeleteGolfCategoria?categoriaId=${categoriaId}`, options);
    }
}
