import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import * as urls from '../../domain/Shared/global';

@Injectable()
export class GolfService {

    constructor(private http: Http) { }

    getRptListadoGolf(eventoId: number, jornadaId: number, categoriaId: number, jornada: string, categoria: string): Promise<any> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlReport}/api/Report/getRptListadoGolf?eventoId=${eventoId}&jornadaId=${jornadaId}&categoriaId=${categoriaId}&jornada=${jornada}&categoria=${categoria}`, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then((r: Response) => {
                return new Blob([r.blob()], { type: 'application/pdf' });
            });
    }

    GetResultadosFinales(categoriaId: number, eventoId: number, categoria: string): Promise<any> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlReport}/api/Report/GetResultadosFinalesTorneo?categoria=${categoriaId}&eventoId=${eventoId}&categoriaName=${categoria}`, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then((r: Response) => {
                return new Blob([r.blob()], { type: 'application/pdf' });
            });
    }

    GetDetallePersonaCompetidor(personaId: number, eventoId: number, categoria: string): Promise<any> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlReport}/api/Report/GetDetallePersonaCompetidor?personaId=${personaId}&eventoId=${eventoId}&categoriaName=${categoria}`, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then((r: Response) => {
                return new Blob([r.blob()], { type: 'application/pdf' });
            });
    }
}
