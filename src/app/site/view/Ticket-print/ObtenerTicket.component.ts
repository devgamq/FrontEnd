//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Tcube } from '../../domain/Conjunto/Tcube';
import { Ticket } from '../../domain/Conjunto/Ticket';
import { TicketService } from '../../service/Tickets/ticket.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ConjuntoService } from '../../service/Conjunto/conjunto.service';
import { Evento } from '../../domain/deportes/grupo/evento';
@Component({
  selector: 'app-Ticket-print',
  templateUrl: './ObtenerTicket.component.html',
  styleUrls: ['./ObtenerTicket.component.css'],
  providers: [TicketService,ConjuntoService]
})
export class ObtenerTicketComponent implements OnInit {

  hora: string;
  fecha: string;
  tkt: string;
  n: number;
  este: Evento;
  tiketttt: string;
  service : TicketService;
  id_juegos:number;
  display: boolean;
  toini:number;
  //@Output() HoraCapturada = new EventEmitter();

  constructor(private http: Http,
    private ticketService: TicketService, private Serviceglob: ConjuntoService
    ) {
    let dd = new Date();
    let d = dd.getDate();
    let mm = dd.getMonth() + 1;
    let y = dd.getFullYear();
    let s = dd.getSeconds();
    let m = dd.getMinutes();
    let h = dd.getHours();
    this.hora = h.toString() + ":" + m.toString() + ":" + s.toString();
    this.fecha = d.toString() + "/" + mm.toString() + "/" + y.toString();
    this.tkt = "01";
    this.n = 1;
    this.id_juegos=4;
  }


  genTicket() {
    //debugger;}
        console.log("Iniciando......ticket");
        this.ticketService.guardarTicket(this.n).subscribe(res => {
            const resp = res.json();
            if (resp > 0) {
                console.log(" ya da");
            }
            else
            console.log(" whats up"+resp);
        });

     this.Serviceglob.GetEvento(this.id_juegos).then(res=>
       {    
            this.este= res;
            this.este.Version = this.n.toString(); 
             

        }); 

      
     this.n++;
    if (this.n < 10)
      this.tkt = "0" + this.n.toString();
    else
      this.tkt = this.n.toString();
    
  }


  ngOnInit() {
    this.display=true;

  }
  escoger(num:number) {
    this.n =this.toini;
    if (this.n < 10)
      this.tkt = "0" + this.n.toString();
    else
      this.tkt = this.n.toString();
      this.id_juegos=num;
     this.display=false;
     
   }
}
