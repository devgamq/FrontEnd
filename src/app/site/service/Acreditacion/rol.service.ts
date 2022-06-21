import { Injectable } from '@angular/core';
import { Rol } from '../../domain/Acreditacion/rol';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import * as urls from '../../domain/Shared/global';

@Injectable()
export class RolService {

  constructor(private http: Http) { }

  getRoles(): Promise<Rol[]> {
    return this.http
      .get(`${urls.urlCommon}/api/Common/GetRoles`)
      .toPromise()
      .then((r: Response) => r.json() as Rol[]);
  }

  getRol(grupoId: number): Promise<Rol[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetRolGrupo?grupoId=${grupoId}`)
      .toPromise()
      .then((r: Response) => r.json() as Rol[]);

  }
}
