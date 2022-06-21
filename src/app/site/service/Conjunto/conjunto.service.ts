import { Injectable } from '@angular/core';
import { PlanillaPersona } from '../../domain/deportes/grupo/PlanillaPersona';
import { Planilla } from '../../domain/deportes/grupo/Planilla';
import { Suceso } from '../../domain/deportes/grupo/Suceso';
import { Evento } from '../../domain/deportes/grupo/Evento';
import { Persona } from '../../domain/shared/Persona';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Parametro } from '../../domain/Conjunto/parametros';
import { Periodo } from '../../domain/Conjunto/periodo';
import { Equipos } from '../../domain/conjunto/Equipos';
import { EquipoPersona } from '../../domain/conjunto/EquipoPersona';
import { Observable } from 'rxjs/Observable';
import { Cronograma } from '../../domain/deportes/grupo/cronograma';
import { CompetidorPersona } from '../../domain/Conjunto/CompetidorPersona';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { SelectItem } from 'primeng/primeng';

@Injectable()
export class ConjuntoService {
  constructor(private http: Http) { }

  getParametrosConjunto(
    compedirId: number,
    planillaId: number,
    deporteId: number,
    deportePeriodoId: number
    // equipoId: number
  ): Promise<Parametro[]> {
    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${
          urls.urlConjunto
          // tslint:disable-next-line:max-line-length
          }/api/Set/GetSucesoPartido?competidorId=${compedirId}&planillaId=${planillaId}&deporteId=${deporteId}&deportePeriodoId=${deportePeriodoId}`
        )
        .toPromise()
        .then((r: Response) => r.json() as Parametro[])
    );
  }

  guardarSucesoParametro(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/SaveSuceso`,
      data,
      options
    );
  }
  InsSucesosAdicion(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/InsSucesosAdicion`,
      data,
      options
    );
  }

  getPeriodoPartido(eventoId: number, deporteId: number): Promise<Periodo[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetDeportePeriodo?eventoId=${eventoId}&deporteId=${deporteId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Periodo[]);
  }
  getDelegacion(CompetidorId: number): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/getDelegacionId?CompetidorId=${CompetidorId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Periodo[]);
  }
  getNombrePersona(PersonaId: number): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/getNombrePersona?PersonaId=${PersonaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }
  getEncuentros(
    eventoId: number,
    deporteId: number,
    fecha: Date
  ): Promise<Cronograma[]> {
    const mes = fecha.getMonth() + 1;
    const fechaStr = fecha.getFullYear() + '/' + mes + '/' + fecha.getDate();

    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetGronogramaConjunto?eventoId=${eventoId}&deporteId=${deporteId}&fecha=${fechaStr}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Cronograma[])
      .catch(this.handleError);
  }
  GetProgramacionConjunto(
    eventoId: number,
    deporteId: number,
    fecha: Date,
    delegacionId: number
  ): Promise<any[]> {
    let mes = 0;
    let fechaStr = '';
    try {
      mes = fecha.getMonth() + 1;
      fechaStr = fecha.getFullYear() + '-' + mes + '-' + fecha.getDate();
    } catch (error) {
      fechaStr = null;
    }

    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${
          urls.urlConjunto
          }/api/Set/GetProgramacionConjunto?eventoId=${eventoId}&delegacionId=${delegacionId}&deporteId=${deporteId}&fecha=${fechaStr}`
        )
        .toPromise()
        .then((r: Response) => r.json() as any[])
        .catch(this.handleError)
    );
  }

  GetProgramacionConjuntoRama(
    eventoId: number,
    parametroRamaId: number,
    deporteId: number,
    fecha: Date,
    delegacionId: number
  ): Promise<any[]> {
    let mes = 0;
    let fechaStr = '';
    try {
      mes = fecha.getMonth() + 1;
      fechaStr = fecha.getFullYear() + '-' + mes + '-' + fecha.getDate();
    } catch (error) {
      fechaStr = null;
    }

    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${
          urls.urlConjunto
          }/api/Set/GetProgramacionConjuntoRama?eventoId=${eventoId}&parametroRamaId=${parametroRamaId}&delegacionId=${delegacionId}&deporteId=${deporteId}&fecha=${fechaStr}`
        )
        .toPromise()
        .then((r: Response) => r.json() as any[])
        .catch(this.handleError)
    );
  }

  GetCronogramasFecha(
    DeporteId: number,
    eventoId: number,
    PruebaId: number,
    fecha: Date,
    ParametroRamaId: number
  ): Promise<any[]> {
    let mes = 0;
    let fechaStr = '';
    try {
      mes = fecha.getMonth() + 1;
      fechaStr = fecha.getFullYear() + '-' + mes + '-' + fecha.getDate();
    } catch (error) {
      fechaStr = null;
    }

    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${
          urls.urlConjunto
          // tslint:disable-next-line:max-line-length
          }/api/Set/GetCronogramasFecha?eventoId=${eventoId}&PruebaId=${PruebaId}&ParametroRamaId=${ParametroRamaId}&fecha=${fechaStr}&DeporteId=${DeporteId}`
        )
        .toPromise()
        .then((r: Response) => r.json() as any[])
        .catch(this.handleError)
    );
  }
  GetPlanillaPersonas(
    competidorId: number,
    planillaId: number,
    search: string
  ): Promise<PlanillaPersona[]> {
    const busqueda = search.trim() === '' ? '%' : search;
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetPlanillaPersonas?competidorId=${competidorId}&planillaId=${planillaId}&search=${busqueda}`
      )
      .toPromise()
      .then((r: Response) => r.json() as PlanillaPersona[])
      .catch(this.handleError);
  }
  GetPlanillas(
    competidorId: number,
    planillaId: number,
    search: string,
    parametroRolId: number
  ): Promise<PlanillaPersona[]> {
    const busqueda = search.trim() === '' ? '%' : search;
    return this.http
      .get(
        `${
        urls.urlConjunto
        // tslint:disable-next-line:max-line-length
        }/api/Set/GetPlanillaPersonas?competidorId=${competidorId}&planillaId=${planillaId}&search=${busqueda}&parametroRolId=${parametroRolId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as PlanillaPersona[])
      .catch(this.handleError);
  }
  GetPlanillaEquipo(competidorId: number): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/getEquipoPersona?competidorId=${competidorId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }

  // tslint:disable-next-line:max-line-length
  SavePosicionNumero(
    equipoId: number,
    personaId: number,
    posicion: string,
    numero: number,
    planillaPersonaId: number,
    parametroRolId: number,
    capitan: number
  ) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    // tslint:disable-next-line:max-line-length
    return this.http.post(
      `${
      urls.urlConjunto
      // tslint:disable-next-line:max-line-length
      }/api/set/UpdateEquipoPersona?equipoId=${equipoId}&personaId=${personaId}&planillaPersonaId=${planillaPersonaId}&posicion=${posicion}&nroCamiseta=${numero}&parametroRolId=${parametroRolId}&capitan=${capitan}`,
      options
    );
  }

  SaveMedallero(
    cronogramaId: number,
    competidorId: number,
    posicion: number,
    ParametroMedallaId: number,
    sembrado: string,
    tiempo: number,
    marca: number,
    esGanador: number,
    esRecord: number
  ) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    // tslint:disable-next-line:max-line-length
    return this.http.post(
      `${
      urls.urlConjunto
      // tslint:disable-next-line:max-line-length
      }/api/set/UpdateCronogramaCompetidor?cronogramaId=${cronogramaId}&competidorId=${competidorId}&posicion=${posicion}&ParametroMedallaId=${ParametroMedallaId}&sembrado=${sembrado}&tiempo=${tiempo}&marca=${marca}&esGanador=${esGanador}&esRecord=${esRecord}`,
      options
    );
  }










  getDelegaciones(EventoId: number): Promise<Equipos[]> {
    return this.http
      .get(`${urls.urlConjunto}/api/Set/GetDelegacion?EventoId=${EventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as Equipos[])
      .catch(this.handleError);
  }

  getEquiposPrueba(PruebaEventoId: number): Promise<Equipos[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetEquiposPrueba?PruebaEventoId=${PruebaEventoId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Equipos[])
      .catch(this.handleError);
  }

  SaveEquipo(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/SaveEquipo`,
      data,
      options
    );
  }

  SaveEquipoFrogDeportes(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/SaveEquipoFrogDeportes`,
      data,
      options
    );
  }

  DeleteEquipo(equipoId: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(
      `${urls.urlConjunto}/api/Set/DeleteEquipo?EquipoId=${equipoId}`,

      options
    );
  }

  getEquiposPersona(EquipoId: number): Promise<EquipoPersona[]> {
    return this.http
      .get(`${urls.urlConjunto}/api/Set/GetEquiposPersona?EquipoId=${EquipoId}`)
      .toPromise()
      .then((r: Response) => r.json() as EquipoPersona[])
      .catch(this.handleError);
  }

  getPersonasEquipoFrog(EquipoId: number): Promise<any[]> {
    return this.http
      .get(`${urls.urlConjunto}/api/Set/GetPersonasEquipoFrog?EquipoId=${EquipoId}`)
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }

  getEquipos(EquipoId: number): Promise<Equipos> {
    return this.http
      .get(`${urls.urlConjunto}/api/Set/GetEquipos?EquipoId=${EquipoId}`)
      .toPromise()
      .then((r: Response) => r.json() as Equipos)
      .catch(this.handleError);
  }

  getDeporteEquipos(EquipoId: number): Promise<Equipos> {
    return this.http
      .get(`${urls.urlConjunto}/api/Set/GetDeporteEquipos?EquipoId=${EquipoId}`)
      .toPromise()
      .then((r: Response) => r.json() as Equipos)
      .catch(this.handleError);
  }


  getDeporteNombre(eventoId: number, deporteId: number): Promise<Equipos> {
    return this.http
      .get(`${urls.urlConjunto}/api/Set/GetDeportePeriodo?eventoId=${eventoId}&deporteId=${deporteId}`)
      .toPromise()
      .then((r: Response) => r.json() as Equipos)
      .catch(this.handleError);
  }

  SaveEquipoPersona(data: any): Promise<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/SaveEquipoPersona`,
      data,
      options
    ).toPromise()
      .then((r: Response) => r.json() as Equipos)
      .catch(this.handleError);
  }

  DeleteEquipoPersona(
    equipoId: number,
    personaId: number
  ): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(
      `${
      urls.urlConjunto
      }/api/Set/DeleteEquipoPersona?EquipoId=${equipoId}&personaId=${personaId}`,

      options
    );
  }

  getPlanilla(cronogramaId: number): Promise<Planilla[]> {
    return this.http
      .get(
        `${urls.urlConjunto}/api/Set/GetPlanilla?cronogramaId=${cronogramaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Planilla[])
      .catch(this.handleError);
  }
  getJugadores(
    CronogramaId: number,
    competidorId: number,
    parametroRolId: number,
    deporteId: number
  ): Promise<any[]> {
    return this.http
      .get(
        // tslint:disable-next-line:max-line-length
        `${
        urls.urlSite
        // tslint:disable-next-line:max-line-length
        }/api/Site/GetPlanilla?CronogramaId=${CronogramaId}&competidorId=${competidorId}&parametroRolId=${parametroRolId}&deporteId=${deporteId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }
  getGoles(
    CronogramaId: number,
    competidorId: number,
    deporteId: number
  ): Promise<any[]> {
    return this.http
      .get(
        // tslint:disable-next-line:max-line-length
        `${
        urls.urlSite
        }/api/Site/GetResultados?CronogramaId=${CronogramaId}&competidorId=${competidorId}&deporteId=${deporteId}&gol=1`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }
  getAmonestaciones(
    CronogramaId: number,
    competidorId: number,
    deporteId: number
  ): Promise<any[]> {
    return this.http
      .get(
        // tslint:disable-next-line:max-line-length
        `${
        urls.urlSite
        }/api/Site/GetResultados?CronogramaId=${CronogramaId}&competidorId=${competidorId}&deporteId=${deporteId}&gol=0`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }
  GetPlanillaPersonasApoyo(
    competidorId: number,
    planillaId: number,
    parametroRolId: number
  ): Promise<PlanillaPersona[]> {
    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${
          urls.urlConjunto
          }/api/Set/GetPlanillaPersonasApoyo?competidorId=${competidorId}&planillaId=${planillaId}&ParametroRolId=${parametroRolId}`
        )
        .toPromise()
        .then((r: Response) => r.json() as PlanillaPersona[])
        .catch(this.handleError)
    );
  }
  getSearchPersona(
    competidorId: number,
    planillaId: number,
    query: string
  ): Promise<CompetidorPersona[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetPlanillaPersonas?competidorId=${competidorId}&planillaId=${planillaId}&search=${query}`
      )
      .toPromise()
      .then((r: Response) => r.json() as CompetidorPersona[])
      .catch(this.handleError);
  }

  getDeportista(
    query: string,
    EventoId: number,
    delegacionId: number
  ): Promise<Persona[]> {
    return this.http
      .get(
        `${
        urls.urlGeneric
        }/api/Generic/GetDeportista?eventoId=${EventoId}&search=${query}&DelegacionId=${delegacionId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Persona[])
      .catch(this.handleError);
  }


  SearchPersonaEquipo(
    competidorId: number,
    planillaId: number,
    query: string
  ): Promise<Persona[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/SearchPersonaEquipo?competidorId=${competidorId}&planillaId=${planillaId}&search=${query}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Persona[])
      .catch(this.handleError);
  }
  GetCapitanPlanilla(
    competidorId: number,
    planillaId: number
  ): Promise<PlanillaPersona[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetCapitanPlanilla?competidorId=${competidorId}&planillaId=${planillaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as PlanillaPersona[])
      .catch(this.handleError);
  }
  SearchPersonaApoyo(eventoId: number, query: string): Promise<Persona[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/SearchPersonaApoyo?eventoId=${eventoId}&search=${query}`
      )
      .toPromise()
      .then((r: Response) => r.json() as Persona[])
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
  savePlanilla(data: FormGroup): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/SavePlanilla`,
      data.value,
      options
    );
  }
  SavePlanillaPersona(data: FormGroup): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/SavePlanillaPersona`,
      data.value,
      options
    );
  }
  DeletePlanillaPersona(data: FormGroup): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/DeletePlanillaPersona`,
      data.value,
      options
    );
  }
  getPosicion(codigo: number): Promise<SelectItem[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetParametros?codigo=40${codigo}`)
      .toPromise()
      .then((r: Response) =>
        r.json().map(item => {
          return { label: item.ParametroDescripcion, value: item.Abreviatura };
        })
      );
  }
  getParametro(codigo: number): Promise<SelectItem[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetParametros?codigo=${codigo}`)
      .toPromise()
      .then((r: Response) =>
        r.json().map(item => {
          return { label: item.ParametroDescripcion, value: item.ParametroId };
        })
      );
  }
  getHistorialSucesos(
    planillaId: number,
    deportePeriodoId: number,
    competidorId: number
  ): Promise<Suceso[]> {
    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${
          urls.urlConjunto
          }/api/Set/getHistorialSucesos?planillaId=${planillaId}&deportePeriodoId=${deportePeriodoId}&competidorId=${competidorId}`
        )
        .toPromise()
        .then((r: Response) => r.json() as Suceso[])
        .catch(this.handleError)
    );
  }
  DeletSuceso(data: FormGroup): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/DeletSuceso`,
      data.value,
      options
    );
  }

  GetEvento(eventoId: number): Promise<Evento> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetEvento?eventoId=${eventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as Evento)
      .catch(this.handleError);
  }

  updateHoraInicio(planillaId: number): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/set/UpdateHoraInicio?planillaId=${planillaId}`,
      options
    );
  }

  updateHoraFin(planillaId: number): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/set/UpdateHoraFin?planillaId=${planillaId}`,
      options
    );
  }

  updatePosesionBalon(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/set/SavePosesionBalon`,
      data,
      options
    );
  }
  DeleteSucesosGrupos(data: any[]): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/set/DeleteSucesosGrupos`,
      data,
      options
    );
  }

  // tslint:disable-next-line:max-line-length
  GetSucesoPartido(
    competidorId: number,
    planillaId: number,
    deporteId: number,
    control: number,
    visor: number,
    deportePeriodoId: number
  ): Promise<any> {
    let voleibol = '';
    if (Number(deporteId) === 6) {
      voleibol = `&deportePeriodoId=${deportePeriodoId}`;
    }
    return (
      this.http
        // tslint:disable-next-line:max-line-length
        .get(
          `${
          urls.urlConjunto
          // tslint:disable-next-line:max-line-length
          }/api/Set/GetSucesoPartido?competidorId=${competidorId}&planillaId=${planillaId}&deporteId=${deporteId}&control=${control}&visor=${visor}${voleibol}`
        )
        .toPromise()
        .then((r: Response) => r.json() as any)
        .catch(this.handleError)
    );
  }

  getParametroFinalPeriodo(deporteId: number): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/set/GetParametroFinalPeriodo?deporteId=${deporteId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }

  getEquipoSorteo(
    deporteId: number,
    ramaId: number,
    eventoId: number
  ): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetEquiposDeporte?deporteId=${deporteId}&ramaId=${ramaId}&eventoId=${eventoId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }
  getEquipoSorteoParametro(
    deporteId: number,
    ramaId: number,
    eventoId: number
  ): Promise<SelectItem[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetEquiposDeporte?deporteId=${deporteId}&ramaId=${ramaId}&eventoId=${eventoId}`
      )
      .toPromise()
      .then((r: Response) =>
        r.json().map(item => {
          return {
            label: item.Equipo,
            value: {
              id: item.EquipoId,
              name: item.Equipo,
              DelegacionId: item.DelegacionId
            }
          };
        })
      );
  }

  getGruposSorteo(
    deporteId: number,
    ramaId: number,
    eventoId: number,
    faseId: number
  ): Promise<SelectItem[]> {
    // tslint:disable-next-line:max-line-length
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetGrupos?deporteId=${deporteId}&ramaId=${ramaId}&eventoId=${eventoId}&faseId=${faseId}`
      )
      .toPromise()
      .then((r: Response) =>
        r.json().map(item => {
          return {
            label: 'Grupo ' + item.GrupoDescripcion,
            value: item.GrupoId
          };
        })
      );
  }

  SaveEquipoGrupo(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlConjunto}/api/Set/SaveEquipoGrupo`,
      data,
      options
    );
  }
  GetGruposEquipos(
    deporteId: number,
    ramaId: number,
    eventoId: number,
    fase: number
  ): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/set/GetGruposEquipos?deporteId=${deporteId}&ramaId=${ramaId}&eventoId=${eventoId}&fase=${fase}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }
  getEquiposGrupo(grupoId: number): Promise<any[]> {
    return this.http
      .get(`${urls.urlConjunto}/api/Set/GetGruposEquipo?grupoId=${grupoId}`)
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }
  DeleteEquipoGrupo(grupoId: number, equipoId: number): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/DeleteEquipoGrupo?grupoId=${grupoId}&equipoId=${equipoId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[]);
  }
  GetCategoria(pruebaEventoId: number): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlGeneric
        }/api/Generic/GetCategoria?pruebaEventoId=${pruebaEventoId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  sumaPuntos(planillaId: number, deportePeriodoId: number): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetPuntosSet?planillaId=${planillaId}&deportePeriodoId=${deportePeriodoId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }
  sumaPuntosBaloncesto(planillaId: number): Promise<any[]> {

    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetPuntosBaloncesto?planillaId=${planillaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }
  GetPuntosPlanilla(PlanillaId: number, DeportePeriodoId: number): Promise<any[]> {

    return this.http
      .get(`${urls.urlConjunto}/api/Set/GetPuntosPlanilla?PlanillaId=${PlanillaId}&DeportePeriodoId=${DeportePeriodoId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }
  obtenerIdDelegacion(idCompetidor: number, eventoId: number): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlGeneric
        }/api/Generic/GetDelegacion?competidorId=${idCompetidor}&eventoId=${eventoId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }
  obteneResultadosSet(eventoId: number, planillaId: number): Promise<any[]> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetVolleySet?eventoId=${eventoId}&planillaId=${planillaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any[])
      .catch(this.handleError);
  }

  GetDelegaciones(eventoId: number): Promise<any> {
    return this.http
      .get(`${urls.urlSite}/api/Site/GetDelegaciones?EventoId=${eventoId}`)
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  CreateFixture(
    eventoId: number,
    deporteId: number,
    parametroRamaId: number
  ): Promise<any> {
    // tslint:disable-next-line:max-line-length
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/CreateFixture?eventoId=${eventoId}&deporteId=${deporteId}&parametroRamaId=${parametroRamaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  SaveCronograma(data: any): Observable<Response> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlGeneric}/api/Generic/SaveCronograma`,
      data,
      options
    );
  }
  DeleteCronograma(cronogramaId: number): Promise<any> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(
      `${
      urls.urlGeneric
      }/api/Generic/DeleteCronograma?cronogramaId=${cronogramaId}`,
      options
    ).toPromise().then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }

  GetCronogramas(
    eventoId: number,
    deporteId: number,
    pruebaId: number,
    parametroRamaId: number
  ): Promise<any> {
    return this.http
      .get(
        // tslint:disable-next-line:max-line-length
        `${
        urls.urlGeneric
        }/api/Generic/GetCronogramas?eventoId=${eventoId}&deporteId=${deporteId}&pruebaId=${pruebaId}&parametroRamaId=${parametroRamaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  GetInstalaciones(): Promise<SelectItem[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetInstalaciones`)
      .toPromise()
      .then((r: Response) =>
        r.json().map(item => {
          return {
            label: item.InstalacionDescripcion,
            value: item.InstalacionId
          };
        })
      );
  }
  GetAreas(InstalacionId: number): Promise<SelectItem[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetAreasInstalacion?InstalacionId=${InstalacionId}`)
      .toPromise()
      .then((r: Response) =>
        r.json().map(item => {
          return {
            label: item.Descripcion,
            value: item.AreaInstalacionId
          };
        })
      );
  }
  GetGruposDeportes(
    eventoId: number,
    deporteId: number,
    parametroRamaId: number
  ): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/set/GetGruposDeportes?eventoId=${eventoId}&deporteId=${deporteId}&parametroRamaId=${parametroRamaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }

  GetEstadisticoWeb(cronogramaId: number, deporteId: number): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlSite
        }/api/Site/GetEstadisticoWeb?cronogramaId=${cronogramaId}&deporteId=${deporteId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }

  GetResultadosWeb(cronogramaId: number, deporteId: number): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlSite
        }/api/Site/GetResultadosWeb?cronogramaId=${cronogramaId}&deporteId=${deporteId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  GetResultadosBaloncesto(cronogramaId: number): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlSite
        }/api/Site/GetResultadosBaloncesto?cronogramaId=${cronogramaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  GetPlanillaBaloncesto(
    cronogramaId: number,
    competidorId: number
  ): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlSite
        }/api/Site/GetPlanillaBaloncesto?cronogramaId=${cronogramaId}&competidorId=${competidorId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  GetPlanillaArbitraje(cronogramaId: number): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlSite
        }/api/Site/GetPlanillaArbitraje?cronogramaId=${cronogramaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
  IniciarPosecion(deporteId: number): Promise<number> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/InitPosecion?deporteId=${deporteId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }

  IniciarTiempoExtra(deporteId: number): Promise<number> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/InitTiempoExtra?deporteId=${deporteId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }

  GetImagenPLanilla(cronogramaId: number): Promise<any> {
    return this.http
      .get(
        `${
        urls.urlConjunto
        }/api/Set/GetFotoPlanilla?cronogramaId=${cronogramaId}`
      )
      .toPromise()
      .then((r: Response) => r.json() as any)
      .catch(this.handleError);
  }
}
