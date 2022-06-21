import { Injectable } from '@angular/core';
import { Delegacion } from '../../domain/Acreditacion/delegacion';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import * as urls from '../../domain/Shared/global';


@Injectable()
export class DelegacionService {

  constructor(private http: Http) { }

  getDelegaciones(eventoId: number): Promise<Delegacion[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetDelegaciones?eventoId=${eventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as Delegacion[]);
  }
}

