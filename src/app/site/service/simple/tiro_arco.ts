import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { SelectItem } from 'primeng/primeng';

@Injectable()
export class TiroArcoService {
    constructor(private http: Http) { }

    GetPlanilla(cronogramaId: number): Promise<any> {
        return this.http
            .get(
                `${urls.urlSingle}/api/single/GetPlanilla?cronogramaId=${cronogramaId}`
            )
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }
    GetPersonal(cronogramaId: number, CompetidorId: number): Promise<any> {
        return this.http
            .get(
                `${urls.urlSingle}/api/single/GetPersonas?cronogramaId=${cronogramaId}&CompetidorId=${CompetidorId}`
            )
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }
    savePlanilla(data: any): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${urls.urlSingle}/api/single/savePlanilla_AT`,
            data,
            options
        );
    }
    CheckPeriodos(data: any): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${urls.urlSingle}/api/single/CheckPeriodos`,
            data,
            options
        );
    }
    savePuntos(data: any): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${urls.urlSingle}/api/single/savePuntos`,
            data,
            options
        );
    }
    GetPuntosPlanilla(PlanillaId: number, CompetidorId: number, PeriodoId: number): Promise<any> {
        return this.http
            .get(
                `${urls.urlSingle}/api/single/GetPuntosPlanilla?PlanillaId=${PlanillaId}&CompetidorId=${CompetidorId}&PeriodoId=${PeriodoId}`
            )
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }

    GetPuntajeTiros(PeriodoId: number, PlanillaId: number, CompetidorId: number): Promise<any> {
        return this.http
            .get(
                `${urls.urlSingle}/api/single/GetPuntajeTiros?PeriodoId=${PeriodoId}&PlanillaId=${PlanillaId}&CompetidorId=${CompetidorId}`
            )
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }
    cerrarPeriodo(data: any): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${urls.urlSingle}/api/single/cerrarPeriodo`,
            data,
            options
        );
    }
    EliminarPunto(data: any): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${urls.urlSingle}/api/single/EliminarPunto`,
            data,
            options
        );
    }
    GetPuntosSet(PlanillaId: number, PeriodoId: number): Promise<any> {
        return this.http
            .get(
                `${urls.urlSingle}/api/single/GetPuntosPlanilla?PlanillaId=${PlanillaId}&PeriodoId=${PeriodoId}`
            )
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
