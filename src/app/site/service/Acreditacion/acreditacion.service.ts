import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import * as urls from '../../domain/Shared/global';

@Injectable()
export class AcreditacionService {

    constructor(private http: Http) { }

    getAcreditacionCredencial(personaId: number, eventoId: number): Promise<any> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlReport}/api/Report/getAcreditacionCredencial?personaId=${personaId}&eventoId=${eventoId}`, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then((r: Response) => {
                return new Blob([r.blob()], { type: 'application/pdf' });
            });
    }

    getAcreditacionInscritos(eventoId: number, delegacionId: number, delegacion: string): Promise<any> {
        return this.http
            // tslint:disable-next-line:max-line-length
            .get(`${urls.urlReport}/api/Report/GetInscritosEvento?eventoId=${eventoId}&delegacionId=${delegacionId}&delegacion=${delegacion}`, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then((r: Response) => {
                return new Blob([r.blob()], { type: 'application/pdf' });
            });
    }
}
