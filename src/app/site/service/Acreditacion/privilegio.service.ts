import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import * as urls from '../../domain/Shared/global';
import { Privilegio } from 'app/site/domain/Acreditacion/privilegio';

@Injectable()
export class PrivilegioService {

    constructor(private http: Http) { }

    getPrivilegiosRol(eventoId, rolId): Promise<Privilegio[]> {
        return this.http.get(`${urls.urlGeneric}/api/Generic/GetPrivilegiosRol?eventoId=${eventoId}&rolId=${rolId}`)
            .toPromise().then((r: Response) => r.json() as Privilegio[]);
    }
}
