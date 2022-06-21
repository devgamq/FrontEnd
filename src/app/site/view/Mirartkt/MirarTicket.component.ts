import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Ticket } from '../../domain/Conjunto/Ticket';
import { TicketService } from '../../service/Tickets/ticket.service';
import {DataTableModule,SharedModule, Message,DataTable, MultiSelectModule, SelectItem, ProgressBarModule} from 'primeng/primeng';
//import {DataTableModule,SharedModule, Message, DataTable, SelectItem, ProgressBarModule} from 'primeng/primeng';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../domain/Shared/global';

@Component({
  selector: 'app-Mirartkt',
  templateUrl: './MirarTicket.component.html',
  styleUrls: ['./MirarTicket.component.css'],
  providers: [TicketService]
 
})
export class MirarTicketComponent implements OnInit {
  
  tt: number[][]; 
  tic: string[]; 
  tkt: number;
  mesa: string;
  fecha: string;
  hora: string;
  n: number;
  value: number;
  paq: Ticket[];
  TT: Ticket;
  tablero: boolean;
  modelContainingURL: String;
  inc: number;
  private _connection: SignalRConnection;
  @Input() Tktp: string = "5";
  @Input() mm: string = '34';
   o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'mesa' + Math.random(), group: 'Ticket' },
    url: urls.urlSockets,
    
  };
  // @Output() Tktp: new EventEmitter();
  // @Output() mm: new EventEmitter();


  constructor(private http: Http,
    private ticketService: TicketService,
    private _signalR: SignalR) 
    {
    var dd = new Date();
    var d = dd.getDate();
    var mm = dd.getMonth() + 1;
    var y = dd.getFullYear();
    var s = dd.getSeconds();
    var m = dd.getMinutes();
    var h = dd.getHours();

    this.hora = h.toString() + ":" + m.toString() + ":" + s.toString();
    this.fecha = d.toString() + "/" + mm.toString() + "/" + y.toString();
     this.mesa = "0";
    this.tkt = 0;
    this.tablero= false;
    this.inc=0;
  }
  setpantalla(t: number, me: string) {
    this.mesa = me;
    this.tkt = t;
  }
  rellamada()
  { 
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then((c)=>{
    const listener = c.listenFor('Sendllamada');
    listener.subscribe((data) => {
        localStorage.setItem('Ticket', JSON.stringify(data));
        this.setdata(data);
        console.log(data);
      
      });
      c.invoke('Rellamada', this.o.qs.name, this.o.qs.group).then(() => {

      });
     });
  }
  setdata(data: any)
  {
    // this.
    this.tkt= (data['tkt']);
    this.mesa= String (data['mesa']);
  }

  ngOnInit() {
     let interval = setInterval(() => {
            this.value = this.value +1;
           
            this.ticketService
                 .TodoAsignados()
                 .then(res => {
                  //console.log("global: ",res);
                   if (res.length>0)
                    { console.log("ES>0: ",res);
                      this.paq = res;  
                      this.TT = this.paq[res.length-1]; 
                      if ( this.inc<=5 )
                      {  
                      this.tkt= this.TT.tkt;
                      if (this.TT.mesa != null)
                         this.mesa = this.TT.mesa.toString(); 
                      }
                    
                    //console.log(this.value+this.inc);
                     this.inc=this.inc+1;
                     //console.log("el numero es"+this.inc);
                  //  this.rellamada();
                    
                      if ((this.inc%5)==0)
                        {    if( (this.paq.length- (this.inc/5))>=0)
                            { this.tkt=this.paq[this.paq.length- (this.inc/5)].tkt;
                            this.mesa=this.paq[this.paq.length- (this.inc/5)].mesa.toString();
                            this.tablero=!this.tablero;
                          //  console.log(this.tkt +" "+this.mesa );
                            }  
                          else
                              {
                                this.inc=0;

                              }
                            // console.log(this.inc+" "+this.tablero);
                        }
                    } 
                    else
                    { console.log("ES==0: ",res);
                      if (res.length==0)
                      this.paq = res;  
                    }              
               });        
           }, 1000);
           //this.modelContainingURL="https://vimeo.com/channels/musicvideoland/238252047";
  }

}
