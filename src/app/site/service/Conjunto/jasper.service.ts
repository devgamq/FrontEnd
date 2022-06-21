import { Injectable } from '@angular/core';
import { PlanillaPersona } from '../../domain/deportes/grupo/PlanillaPersona';
import { Planilla } from '../../domain/deportes/grupo/Planilla';
import { Suceso } from '../../domain/deportes/grupo/Suceso';
import { Evento } from '../../domain/deportes/grupo/Evento';
import { Persona } from '../../domain/shared/Persona';
import { Http, Response, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Parametro } from '../../domain/Conjunto/parametros';
import { Periodo } from '../../domain/Conjunto/periodo';
import { Observable } from 'rxjs/Observable';
import { Cronograma } from '../../domain/deportes/grupo/cronograma';
import { CompetidorPersona } from '../../domain/Conjunto/CompetidorPersona';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { SelectItem } from 'primeng/primeng';

@Injectable()
export class JasperService {
    opt: any;
  constructor(private http: Http) {
      this.opt = {responseType: ResponseContentType.Blob};
   }

    getMedalleroGeneral(eventoId: number): Promise<any> {
        return this.http
            .get(`${urls.urlJasper}/api/Jasper/getMedalleroGeneral?eventoId=${eventoId}`, this.opt)
            .toPromise()
            .then((r: Response) => {
            return new Blob([r.blob()], { type: 'application/pdf' });
        });
    }

    getMedalleroEvento(eventoId: number,fecha:string): Promise<any> {
        console.log(`${urls.urlJasper}/api/Jasper/getMedallasEvento?eventoId=${eventoId}&fecha=${fecha}`);
        return this.http
            .get(`${urls.urlJasper}/api/Jasper/getMedallasEvento?eventoId=${eventoId}&fecha=${fecha}`, this.opt)
            .toPromise()
            .then((r: Response) => {
            return new Blob([r.blob()], { type: 'application/pdf' });
        });
    }

    getMedalleroDeporte(eventoId: number, deporteId: number): Promise<any> {
        return this.http
            .get(`${urls.urlJasper}/api/Jasper/getMedalleroDeporte?eventoId=${eventoId}&deporteId=${deporteId}`, this.opt)
            .toPromise()
            .then((r: Response) => {
            return new Blob([r.blob()], { type: 'application/pdf' });
        });
    }

    getDatosNelson(eventoId: number,cronogramaId:number, deporteId: number, pruebaId: number, parametroRamaId:number): Promise<any> {
        return this.http
            .get(`${urls.urlJasper}/api/Jasper/getPodiosReporte?eventoId=${eventoId}&cronogramaId=${cronogramaId}&deporteId=${deporteId}&pruebaId=${pruebaId}&parametroRamaId=${parametroRamaId}`, this.opt)
            .toPromise()
            .then((r: Response) => {
            return new Blob([r.blob()], { type: 'application/pdf' });
        });
    }

    getProgramacion(eventoId: number, deporteId: number, fecha: string): Promise<any> {

        console.log(`${urls.urlJasper}/api/Jasper/getProgramacion?eventoId=${eventoId}&deporteId=${deporteId}&fecha=${fecha}`);

    return this.http
        .get(`${urls.urlJasper}/api/Jasper/getProgramacion?eventoId=${eventoId}&deporteId=${deporteId}&fecha=${fecha}`, this.opt)
        .toPromise()
        .then((r: Response) => {
            return new Blob([r.blob()], { type: 'application/pdf' });
        });
    }

    getIndividuales(eventoId: number,cronogramaId:number, deporteId: number, pruebaId: number, parametroRamaId:number): Promise<any> {
        return this.http
            .get(`${urls.urlJasper}/api/Jasper/getIndividuales?eventoId=${eventoId}&cronogramaId=${cronogramaId}&deporteId=${deporteId}&pruebaId=${pruebaId}&parametroRamaId=${parametroRamaId}`, this.opt)
            .toPromise()
            .then((r: Response) => {
            return new Blob([r.blob()], { type: 'application/pdf' });
        });
    }

    getResumenPartido(eventoId: number, deporteId: number, cronogramaId: number): Promise<any> {
    return this.http
        .get(`${urls.urlJasper}/api/Jasper/getResumenPartido?eventoId=${eventoId}&deporteId=${deporteId}&cronogramaId=${cronogramaId}`, this.opt)
        .toPromise()
        .then((r: Response) => {
            return new Blob([r.blob()], { type: 'application/pdf' });
        });
    }

    getTablaPosicion(eventoId: number, deporteId: number): Promise<any> {
    return this.http
        .get(`${urls.urlJasper}/api/Jasper/getTablaPosicion?eventoId=${eventoId}&deporteId=${deporteId}`, this.opt)
        .toPromise()
        .then((r: Response) => {
            return new Blob([r.blob()], { type: 'application/pdf' });
        });
    }

    getPdfParametroSuceso(eventoId:number,deporteId:number,pruebaId:number,parametroRamaId:number,parametroSucesoId:number): Promise<any> {    
    return this.http
        .get(`${urls.urlJasper}/api/Jasper/getControlParametro?eventoId=${eventoId}&deporteId=${deporteId}&pruebaId=${pruebaId}&parametroRamaId=${parametroRamaId}&parametroSucesoId=${parametroSucesoId}`, this.opt)
        .toPromise()
        .then((r: Response) => {
            return new Blob([r.blob()], { type: 'application/pdf' });
        });
    }

    getMiniAtletismo(eventoId: number): Promise<any> {
        return this.http
            .get(`${urls.urlJasper}/api/Jasper/getMiniAtletismo?eventoId=${eventoId}`, this.opt)
            .toPromise()
            .then((r: Response) => {
              return new Blob([r.blob()], { type: 'application/pdf' });
          });
    }

}
