import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class MedalleroService {
  constructor(private http: Http) { }
  GetIndividualeMarcas(
    prueba: number,
    rama: number,
    deporteId: number,
    eventoId: number
  ): Promise<any> {
    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${urls.urlSite}/api/Site/GetCompetidorDeportes?eventoId=${eventoId}&pruebaId=${prueba}&deporteId=${deporteId}&parametroRamaId=${rama}`
        )
        .toPromise()
        .then((r: Response) => r.json() as any)
        .catch(this.handleError)
    );
  }

  GetMedalleroGeneral(EventoId: number): Promise<any> {
    return this.http
      .get(`${urls.urlSite}/api/Site/GetMedalleroGeneral?EventoId=${EventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  GetMedalleroDeporte(EventoId: number, DeporteId: number): Promise<any> {
    return this.http
      .get(
        `${urls.urlSite}/api/Site/GetMedalleroDeporte?EventoId=${EventoId}&DeporteId=${DeporteId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  GetMedalleroDelegacion(EventoId: number, delegacionId: number): Promise<any> {
    return this.http
      .get(
        `${urls.urlSite}/api/Site/GetMedalleroDelegacion?EventoId=${EventoId}&delegacionId=${delegacionId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  GetClima(q: string): Promise<any> {
    return this.http
      .get(
        `http://api.openweathermap.org/data/2.5/weather?q=${q === undefined ? 'cochabamba' : q}&appid=8b9deb3240f13d036b76f50f41044b9e`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }



  GetResultadoEncuentro(cronogramaId: number): Promise<any> {
    return this.http
      .get(
        `${urls.urlSite}/api/Site/GetResultadoEncuentro?cronogramaId=${cronogramaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
