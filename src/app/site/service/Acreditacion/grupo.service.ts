import { Injectable } from '@angular/core';
import { Grupo } from '../../domain/Acreditacion/grupo';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import * as urls from '../../domain/Shared/global';

@Injectable()
export class GrupoService {

  constructor(private http: Http) { }

  getGrupos(eventoId): Promise<Grupo[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetGrupos?eventoId=${eventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as Grupo[]);
  }
}
