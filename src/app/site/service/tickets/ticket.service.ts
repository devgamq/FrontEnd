import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Ticket } from '../../domain/Conjunto/Ticket';
import { Tcube } from '../../domain/Conjunto/Tcube';
import { Evento } from '../../domain/deportes/grupo/evento';
import * as urls from '../../domain/Shared/global';

@Injectable()
export class TicketService {
  constructor(private http: Http) {}

  TodoTicket(): Promise<Ticket[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetTickets`)
      .toPromise()
      .then((r: Response) => r.json() as Ticket[]);
  }
  TodoAsignados(): Promise<Ticket[]> {
    return this.http
      .get(`${urls.urlGeneric}/api/Generic/GetAsignados`)
      .toPromise()
      .then((r: Response) => r.json() as Ticket[]);
  }

  guardarTicket(n: number) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlGeneric}/api/Generic/SetTicket`,
      n,
      options
    );
  }

  llamadoticket(idTicket: number) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlGeneric}/api/Generic/Llamado`,
      idTicket,
      options
    );
  }

  Asignarte(data :Tcube) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
       `${urls.urlGeneric}/api/Generic/Asignar`,
       data,
       options
    );
  }

  Cerrar(data: Ticket) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlGeneric}/api/Generic/Cerrar`,
      data,
      options
    );
  }

  Impre(data: Evento) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(
      `${urls.urlGeneric}/api/Generic/Imprimir`,
      data,
      options
    );
  }
}
