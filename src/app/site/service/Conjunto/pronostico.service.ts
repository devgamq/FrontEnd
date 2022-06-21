import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';


import { PlanillaPersona } from '../../domain/deportes/grupo/PlanillaPersona';
import { Planilla } from '../../domain/deportes/grupo/Planilla';
import { Suceso } from '../../domain/deportes/grupo/Suceso';
import { Evento } from '../../domain/deportes/grupo/Evento';
import { Persona } from '../../domain/shared/Persona';
import {  RequestOptions, Headers } from '@angular/http';
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
export class PronosticoService {
    
    constructor(private http: Http) {}

    getPronostico1() {
        return this.http.get('assets/demo/data/pronosticodia1.json')
                    .toPromise()
                    .then(res => <any[]> res.json().data)
                    .then(data => { return data; });
    }

    

        GetTiempo(): Promise<any> {
            return this.http
              .get(
                `${urls.urlSite}/api/Site/GetTiempo`
              )
              .toPromise()
              .then((r: Response) => r.json() as any)
              
          }

    
}


