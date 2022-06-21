import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Tcube } from '../../domain/Conjunto/Tcube';
import { Ticket } from '../../domain/Conjunto/Ticket';
import { TicketService } from '../../service/Tickets/ticket.service';
import {DataTableModule,SharedModule, Message, DataTable, SelectItem, ProgressBarModule} from 'primeng/primeng';
import { clearInterval } from 'timers';

@Component({
  selector: 'app-Atc',
  templateUrl: './AtencionCliente.component.html',
  styleUrls: ['./AtencionCliente.component.css'],
  providers: [TicketService]
})

export class AtencionClienteComponent implements OnInit{
  paqtickets: Ticket[];
  list:Ticket[];
  paqtickets2: Ticket[]=[{Id: null,
    tkt:null,
    fecha:null,
    hora: null,
    estado: null,
    mesa: null,
    tiempo: null,
    servicio: null }];
  exx: String;
  ele: Ticket={
    Id: 5,
    tkt:1,
    fecha:"21012018",
    hora: "05:01:15",
    estado: false,
    mesa: 1,
    tiempo: "00:00:00",
    servicio: ""

  }; 
  stic: Tcube={
    Id: null,
    mesa: null,
    fecha:null,
    tkt:null
    
   
  }; 
  Id: number;
  Fe: string;
  Ho: string;
  TT: number;
  me: string; 
  es: boolean;
  pare : number;
  ti: string ;
  ser: string;
  value: number;
  ide: number;
  mesa: number;
  datos:String;
  serv: SelectItem[];
  msgs: Message[];
  selected: string;
  min: number;
  seg: number;
  hor: number;
  xxx: number;
  yyy: number;
  d1: boolean;
  d2: boolean;
  d3: boolean;
  param: number[];
  estado:boolean;
  xxxx: boolean;
  i: number;
  display: boolean;
  stop: number;
 

  constructor(private http: Http,
    private ticketService: TicketService,
    //private lcontrol: LoadingController
  ) {
      
        this.serv=[];
        this.serv.push({label:'Acreditacion', value: 'Acreditacion'} )
        this.serv.push({label:'Delegacion', value: 'Delegacion'} )
        this.serv.push({label:'Prensa', value: 'Prensa'} )
        this.serv.push({label:'Tecnica', value: 'Tecnica'} )
        this.serv.push({label:'Otros', value: 'Otros'} )
        
        this.me="&nbsp";
        this.value=0;
        this.mesa= 1;
        this.min=0;
        this.hor=0;
        this.seg=0;
        this.xxx=0;
        this.display=false;
        this.Id=-1;
  }
  async obtener() {
  
      this.pare = 1;
      
      await  this.ticketService
        .TodoTicket()
        .then(res => {
          
        if (res!=null)
          {   console.log(res);
              this.paqtickets = res; 
              this.ele = this.paqtickets[0];
              //this.paqtickets2[0]=this.ele;
              //console.log('paqtickets2: ',this.paqtickets2);
              this.Id=this.ele.Id;
              this.Fe=this.ele.fecha.substring(0,8);
              this.Ho= this.ele.hora.substring(0,8);
              this.es = this.ele.estado;
              this.TT = this.ele.tkt;  
              this.ti= "00:00:00";
              this.ser= "-";
              this.me="Mesa "+this.mesa;
              this.value=0;
              this.xxx=0; 
              this.stic.Id = (this.Id);
              this.stic.mesa=this.mesa;
              this.stic.tkt= (this.TT);
                if ((this.Id)&&(this.Id!= -1))
                  {    
                      this.ide= (this.Id)
                      this.ticketService.llamadoticket (this.ide).subscribe(res => {
                          const resp = res.json();
                          if (resp > 0) {
                              console.log(" ya da llamado Ticket:"+ this.Id);
                             
                              console.log(this.ele);
                                    }
                                });
                          
                  this.ele.mesa  = this.mesa;
                  //var  cadena="{ Id="+this.ele.Id+ " Mesa="+this.ele.mesa.toString()+" tkt="+ this.ele.tkt.toString()+ "}"
                  //console.log("VEAMOS EL OBJ"+this.ele);
                  
                  
                  console.log("Como stic= ",this.stic);   
                    this.d1= true;
                    this.d2= !this.d1; 
                    this.d3= this.d2;   
                 }

         }
           else
              {
                         this.msgs = [];
                         this.msgs.push({severity:'info',summary:'No hay mas Tickets',detail:'No Existen Clientes Esperando'});
                         
                          
              }
         
             });
      
           
      
             console.log("outside",this.stic);  
             if(this.stic.Id!=-1)
             {
               this.ticketService.Asignarte (this.stic).subscribe(res => {0
                 const resp = res.json();
                 if (resp > 0) {
                     console.log(" ya da asignar");   
                                        
                     
                     }
                      
                 });
          
           
             }
       let interval = setInterval(() => {
              this.value = this.value +0.1;
              if( (this.value <= 100) && (this.d1) ) {
                 
                 this.xxx++;
                 this.yyy=this.xxx;
                 this.hor= Math.trunc(this.yyy/3600);
                 this.yyy= Math.trunc( this.yyy%3600);
                 this.min= Math.trunc(this.yyy/60);
                 this.seg= Math.trunc(this.yyy%60);
  
                 this.ti = this.hor+":"+this.min+":"+this.seg;
             
              }
              else
                  {
                      clearInterval(interval);
                      this.value=0;
                      //this.d2=true;
                  }
          }, 1000);
  
    
   
        
      
       
  }
  todos()
  {
    let interval = setInterval(() => {
      this.ticketService
      .TodoTicket()
      .then(res => {
        this.list=res;
      });
      if(this.stop==0)
      {
        clearInterval(interval);
      }
            
  }, 1000);

  }


  Terminar()
  { 
      if (this.selected)
      {      
              this.ele.tiempo = this.ti;
              this.ele.servicio = this.selected;
            
              console.log("ticket a cerrar",this.ele);
              
              this.ticketService.Cerrar ( this.ele).subscribe(res => {
                    const resp = res.json();
                      console.log(resp );
                        this.Id=null;
                        this.Fe=null;
                        this.Ho=null;
                        this.TT=null;
                        this.me=null;
                        this.es=null;
                        this.ser=null;
                        this.ti=null;
                        this.selected=null;
                        // this.es=;
                        this.value=102;
                      
                    // }
                });
                this.d1= false;
                this.d3= false;
                this.d2= true;
                  this.msgs = [];
             }   
             else
             {console.log("este es",this.selected);
               this.msgs = [];
               this.msgs.push({severity:'info',summary:'Imposible Cerrar el Ticket',detail:'Elija un Servicio'});
  
             }
  }
  escoger(n:number) {
  this.mesa=n;
   this.display=false;
   
 }
 rellamar()
 {
  

 }

 setdata(data: any)
 {
    // this.
    this.TT= (data['tkt']);
    this.me= String (data['mesa']);
 }
  ngOnInit() {
   ///
  this.Id=null;
  this.Fe=null;
  this.Ho=null;
  this.TT=null;
  this.me=null;
  this.es=null;
  this.ser=null;
  this.ti=null;
                        


   ///////
    this.xxxx= false;
   this.display=true;
   // console.log(this.mesa);
   this.d1=false;
   this.d2= !this.d1;
   this.d3= true;
   this.stop=1;

   this.todos(); 
  }
  ngOnDestroy ()
  {
    this.stop=0;

  }

}
