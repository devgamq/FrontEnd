import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { SelectItem } from 'primeng/primeng';

@Injectable()
export class EcuestreService {
    constructor(private http: Http) { }

    GetCompetidoresEcuestre(cronogramaId: number, LeccionId: number): Promise<any[]> {
        return this.http
            .get(
                `${
                urls.urlConjunto
                }/api/Set/GetCompetidoresEcuestre?cronogramaId=${cronogramaId}&LeccionId=${LeccionId}`
            )
            .toPromise()
            .then((r: Response) => r.json() as any[]);
    }

    saveCompetidor(data: any): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${urls.urlConjunto}/api/Set/saveCompetidor`,
            data,
            options
        );
    }
    deleteCompetidor(data: any): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${urls.urlConjunto}/api/Set/deleteCompetidor?LeccionCompetidorId=${data}`,
            data,
            options
        );
    }
    getLecciones(EventoId: number): Promise<SelectItem[]> {
        return this.http
            .get(
                `${
                urls.urlConjunto
                }/api/Set/fGetLecciones?EventoId=${EventoId}`
            )
            .toPromise()
            .then((r: Response) => r.json().map(item => {
                return { label: item.Leccion, value: item.LeccionId };
            }));
    }
}
