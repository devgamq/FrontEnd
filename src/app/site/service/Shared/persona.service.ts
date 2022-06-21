import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Persona } from '../../domain/Shared/persona';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';

@Injectable()
export class PersonaService {
  constructor(private http: Http) {}
  // Promise <Persona[]>{
  getPersonas(eventoId: any) {
    return this.http
      .get(`${urls.urlCommon}/api/Common/GetPersonas?eventoId=${eventoId}`)
      .toPromise()
      .then(res => <any[]>res.json());
    // .then(data => {return data;});
    // .then((r:Response) => r.json() as Persona[] });
  }
  SearchCompetidores_Golf(eventoId: number, query: any) {
    return this.http
      .get(
        `${
          urls.urlCommon
        }/api/Common/SearchCompetidores_Golf?eventoId=${eventoId}&texto=${query}`
      )
      .toPromise()
      .then(res => <any[]>res.json());
  }
}
