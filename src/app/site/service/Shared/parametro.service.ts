import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { SelectItem } from 'primeng/primeng';
import { Parametro } from 'app/site/domain/shared/parametro';

@Injectable()
export class ParametroService {

    constructor(private http: Http) { }

    getParametroforCodigo(codigoId: number): Promise<SelectItem[]> {
        return this.http.get(`${urls.urlGeneric}/api/Generic/GetParametros?codigo=${codigoId}`).toPromise().then(
            (r: Response) => r.json().map(item => {
                return { label: item.ParametroDescripcion, value: item.ParametroId };
            }
            )
        );
    }
}
