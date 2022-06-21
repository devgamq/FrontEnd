import { Injectable } from '@angular/core';
import { Deporte } from '../../domain/Acreditacion/deporte';
import { ParametrosPersona } from '../../domain/Conjunto/parametrospersona';

import { Prueba } from '../../domain/Acreditacion/prueba';
import { Tipo } from '../../domain/Acreditacion/tipo';
import { Sexo } from '../../domain/Acreditacion/sexo';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import * as urls from '../../domain/Shared/global';

@Injectable()
export class DeporteService {
  constructor(private http: Http) {}

  getDeportes(eventoId: number): Promise<Deporte[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetDeportes?eventoId=${eventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as Deporte[]);
  }



  getEstados(codigo: number): Promise<ParametrosPersona[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetParametros?Codigo=${codigo}`)
      .toPromise()
      .then((r: Response) => r.json() as ParametrosPersona[]);
  }



  getTipos(eventoId: number, deporteId: number): Promise<Tipo[]> {
    return this.http
      .get(
        `${urls.urlGeneric}/api/Generic/GetTipoDeportes?eventoId=${eventoId}&deporteId=${deporteId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Tipo[]);
  }

  getSucesosDeporte(deporteId: number): Promise<any[]> {
    return this.http
      .get(
        `${urls.urlConjunto}/api/Set/GetParametroSuceso?deporteId=${deporteId}&control=1&visor=0`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }

  getPruebas(
    eventoId: number,
    deporteId: number,
    esIndividual: number
  ): Promise<Prueba[]> {
    return this.http
      .get(
        `${urls.urlGeneric}/api/Generic/GetPruebas?eventoId=${eventoId}&deporteId=${deporteId}&esIndividual=${esIndividual}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Prueba[]);
  }
  getRamas(
    eventoId: number,
    deporteId: number,
    esIndividual: number,
    pruebaId: number
  ): Promise<Sexo[]> {
    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${urls.urlGeneric}/api/Generic/GetRamaPrueba?eventoId=${eventoId}&deporteId=${deporteId}&esIndividual=${esIndividual}&pruebaId=${pruebaId}`
        )
        .toPromise()
        .then((r: Response) => r.json() as Sexo[])
    );
  }
  getRamaFases(
    eventoId: number,
    pruebaId: number,
    parametroRamaId: number
  ): Promise<any[]> {
    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${urls.urlGeneric}/api/Generic/GetPruebaEventoIndv?eventoId=${eventoId}&pruebaId=${pruebaId}&parametroRamaId=${parametroRamaId}`
        )
        .toPromise()
        .then((r: Response) => r.json())
    );
  }
  getEscenarios(eventoId: number, tipo: number): Promise<any[]> {
    return this.http
      .get(`${urls.urlSite}/api/Site/GetInstalaciones?eventoId=${eventoId}&tipo=${tipo}`)
      .toPromise()
      .then((r: Response) => {
        return r.json() as any[];
      });
  }
}
