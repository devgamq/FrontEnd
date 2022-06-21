import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class PodioService {

    constructor(private http: Http) { }

    GetJornadaConjunto(deporteId: number, fecha: any, eventoId: number): Promise<any> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlSite}/api/Site/GetResumenJornada?eventoId=${eventoId}&fecha=${fecha}&deporteId=${deporteId}`)
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }

    GetTablaPosicion(EventoId: number, deporteId: number, parametroRamaId: number, grupoid: number): Promise<any> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlSite}/api/Site/GetTablaPosicion?EventoId=${EventoId}&deporteId=${deporteId}&parametroRamaId=${parametroRamaId}&grupoid=${grupoid}`)
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }
    GetPodio(eventoId: number, deporteId: number, pruebaId: number, parametroRamaId: number): Promise<any> {
        if (deporteId > 1 && deporteId < 7) {
            pruebaId = 0;
        }
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlSite}/api/Site/GetPodio?eventoId=${eventoId}&deporteId=${deporteId}&pruebaId=${pruebaId}&parametroRamaId=${parametroRamaId}`)
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }

    GetParticipantes(eventoId: number): Promise<any> {
        return this.http
            .get(`${urls.urlSite}/api/Site/getCompetidorEvento?eventoId=${eventoId}&personaId=0&deporteId=0`)
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }
    GetParticipantesDeporte(eventoId: number, deporteId:number): Promise<any> {
        return this.http
            .get(`${urls.urlSite}/api/Site/getCompetidorEvento?eventoId=${eventoId}&personaId=0&deporteId=${deporteId}`)
            .toPromise()
            .then((r: Response) => r.json() as any)
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }



  
}
