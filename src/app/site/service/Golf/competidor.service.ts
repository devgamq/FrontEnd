import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../domain/Shared/global';
import { GolfCompetidor } from '../../domain/Golf/golfCompetidor';

@Injectable()
export class CompetidorService {

    constructor(private http: Http) { }
    setGolfCompetidor(data: FormGroup): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${urls.urlGolf}/api/Golf/InsertCompetidorGolfCompetidor`, data.value, options);
    }
    deleteGolfCompetidor(competidorId: number): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http
            .delete(`${urls.urlGolf}/api/Golf/Delete_GolfCompetidor?competidorId=${competidorId}`, options);
    }
}
