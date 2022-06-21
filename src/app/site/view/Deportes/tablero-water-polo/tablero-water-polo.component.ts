import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { Marcador } from '../../../domain/Conjunto/Marcador';
import { CronometroComponent } from '../../../component/widgets/cronometro/cronometro.component';
import { Cronometro } from '../../../domain/widgets/cronometro.type';
import { Router, ActivatedRoute } from '@angular/router';
import * as urls from '../../../domain/Shared/global';
import { ButtonModule } from 'primeng/primeng';
import { DialogoConjuntoComponent } from '../../../component/dialogo/dialogo-conjunto/dialogo-conjunto.component';
import { BotonConjuntoComponent } from '../../../component/boton/boton-conjunto/boton-conjunto.component';
import { Parametro } from '../../../domain/Conjunto/parametros';
import { SucesoPersona } from '../../../domain/Conjunto/SucesoPersona';
import { DataGridModule } from 'primeng/primeng';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import {
  Message,
  ConfirmDialogModule,
  ConfirmationService
} from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { CambioJugadorComponent } from '../../Futbol/cambio-jugador/cambio-jugador.component';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { SimpleService } from '../../../service/simple/simple.service';
import { SpinnerModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';


import { MenuModule, MenuItem } from 'primeng/primeng';





declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-tablero-water-polo',
  animations: [
    trigger('flyInOut', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition('* => void', [
        animate('0.2s 0.1s ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ])
  ],
  templateUrl: './tablero-water-polo.component.html',
  styleUrls: ['./tablero-water-polo.component.css']
})
export class TableroWaterPoloComponent implements OnInit {
  jugadorA:any;
  jugadorB:any;
  urlA = '../../../../../assets/erpHammer/images/1.jpg';
  urlB = '../../../../../assets/erpHammer/images/2.jpg';
  banderaA = '1033.png';
  banderaB = '1032.png';
  puntoA = 0;
  puntoB = 0;
  contA = 0;
  contB = 0;
  contAC = 0;
  contBC = 0;
  contador:any;
  added = 1;
  set:string;
  exclusion = 'Exclusión';
  cronometro: String;
  cronometro_descuento: String;
  mensaje = 'LET';
  Tiempos:any[];
  trans:number;
  conthora = 0;
  setDato:any;
  setDatoB:any;
  position: any;

   verde= false;
   verdeB = false;
   contcolor1 = 0;
   contcolor2 = 0;
   contcolor3 = 0;
   contcolor4 = 0;
   NombreCompleto:any;
   cantidadFaltas:number;

   contAA = 0;
   contBB = 0;
   contACC = 0;
   conthoraB= 0;
   contBCC= 0;
   posB = 0;

  capturar: boolean;
  pos = 0;
  
  pantallaId: any;
  posesion: number;
  private _connection: SignalRConnection;
  private _mensaje: SignalRConnection;
  show: boolean;
  visible: boolean;
  periodos: any[];
  periodosA: any[];
  periodosB: any[];
  faltasA: any[];
  faltasB: any[];
  colores: any[];
  aux: any[];
  Equipo: any[];
  setTiempo = '00:00';

  marcadorDatos: Marcador = new Marcador();
  estadoA:number;
  estadoB:number;
  band:number;
  dataAux:any;
  private styleDia: any;
  color: any;
  accion:number;
  accionB:number;
  iniciar:boolean;
  reversa: boolean;
  tiempoconvertido:number;
  contadorlista=0;
  tiemposA: any[];
  tiemposB: any[];

  pausa:boolean;
  contadorA = 0;
  contadorB = 0;
  mensajes:boolean;
  datos:any;
  styleA: any;
  styleB: any;
  CompetidorBId: number;
  CompetidorAId: number;
  countA1 = 0;
  countA0 = 0;
  countB1 = 0;
  countB0 = 0;
  colorFalta:any;
  NombreCorto:any;
  jugaA:any;
  jugaB:any;
  bandA:any;
  bandB:any;
  contPelota:any;
  o: IConnectionOptions = {
    hubName: 'HammerWaterPoloHub',
    qs: {
      name: 'usuario',
      group: 'waterpolo'
    },
    url: urls.urlSockets
  };

  constructor(private _signalR: SignalR,
    private activedRoute: ActivatedRoute) {


    this.pantallaId = this.activedRoute.snapshot.params['pantallaId'];

    this.jugaA = this.activedRoute.snapshot.params['equipoA'];
    this.jugaB = this.activedRoute.snapshot.params['equipoB'];
    this.bandA= this.activedRoute.snapshot.params['idcompetidor1'];
    this.bandB = this.activedRoute.snapshot.params['idcompetidor2'];
    


    this.o.qs.name = this.pantallaId;
    this.conectar();
    this.visible = false;
    this.periodos = [];
    this.periodosA = [];
    this.periodosB = [];
    this.faltasA = [];
    this.faltasB = [];
    this.colores = [];
    this.aux = [];


    
  }

  ngOnInit() {

    $('body').attr(
      'style',
      'overflow-y:hidden !important; overflow-x:hidden !important; '
    );
    this.reversa = true;
    this.accion = 5;
    this.accionB = 5;
    this.iniciar = true;
    this.set = "1 T";


    this.jugadorA = this.jugaA;
    this.jugadorB = this.jugaB;
    this.banderaA = this.bandA;
    this.banderaB = this.bandB;

  }

  private conectar() {

    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {

      const listenerPeriodo = c.listenFor('HandleActualizarPeriodo');
      // const changeCronometro = c.listenFor('HandleControlCronometro');

      listenerPeriodo.subscribe(data => {

        setTimeout(()=>{   
          if(data['Periodo'] === "1er Tiempo")
          {
            this.set = "1 T"
          }
   
          if(data['Periodo'] === "2do Tiempo")
          {
           this.set = "2 T"
          }
          if(data['Periodo'] === "Tiempo Adicional")
          {
           this.set = "T A"
          }
     },1000);
       
     if(data['Pausar'] === false)
     {
       this.accion = 3;
       this.accionB = 3;
     }
 

      });


      const listenerAccion = c.listenFor('HandleActualizarAccion');
      // const changeCronometro = c.listenFor('HandleControlCronometro');

      listenerAccion.subscribe(data => {
    

        //console.log("Este es un ejemplo de data accion del marcador: ", data);
        this.setTiempo = '02:00';
        if(data['Pausa'] === true)
        {
         this.accion = 3;
         this.accionB = 3;
        }
        else{
          this.accion = 1;
          this.accionB = 1;
        }

      });



      
      const listenerFalta = c.listenFor('HandleActualizarMarcadorFalta');
      // const changeCronometro = c.listenFor('HandleControlCronometro');
 
      listenerFalta.subscribe(data => {

        
          if(data['Posicion'] === 1)
          {

            if(this.faltasA.length > 0)
            {
     
              this.faltasA.forEach(element => {
               if(element.Nombre === data['Nombre'] )
               {
                  
              
                  if(element.Estado === 1)
                  {
                    this.colorFalta = "verde";
                    this.cantidadFaltas = 1;
                    var valor = 2;
                     element.Estado = 2;
                    
                  }

                  if(element.Estado === 2)
                  {
                    this.color = "amarrillo"
                    this.cantidadFaltas = 2;
                    element.Estado = 3;
                  }
                  if(element.Estado === 3)
                  {
                     this.colorFalta = "rojo"
                  }
                
            
               }
               else{
            
               }
           
             });

            }
            else{
              this.faltasA.unshift(data);
         
            }

          }
          else
          {




          }














      });

      const listener = c.listenFor('HandleActualizarMarcador');

    
      this.accion = 5;
      listener.subscribe(data => {


        this.tiemposA = [];
        this.tiemposB = [];
       this.setTiempo = '02:00';


        if(data['Posicion'] === 1)
        {
          this.contA = 0;
          this.contB = 0;
          this.contAC = 0;
          this.conthora= 0;
          this.contBC= 0;
          this.pos = 0;

       if(this.periodosA.length > 0)
       {

         this.periodosA.forEach(element => {
          if(element.Estado === 0)
          {
           
            this.contAC = this.contAC + 1;
            if(element.Nombre === data['Nombre'])
            {
              this.conthora = this.conthora + 1;
           
              this.pos = this.contAC;
              this.accion = 4;
            }
            else
            {
              this.contBC = this.contBC+1
            }


          }
      
        });



       }


       if(this.conthora != 1)
       {
        this.periodosA.unshift(data);
        this.contadorA = this.contadorA + 1;
       }

       this.periodosA.sort(function (a, b) {
        return a.Estado - b.Estado;
      });

      console.log(this.periodosA);

          if(this.periodosA.length === 6)
              {
                this.countA0 = 0;
                this.countA1= 0;

                this.periodosA.forEach(element => {
                  if(element.Estado === 0)
                  {
                   
                   this.countA0 = this.countA0 +1;
        
        
                  }
                  else
                  {
                    this.countA1 = this.countA1 +1;
                  }
              
                });


                if(this.countA0 == 6)
                {
                  this.contadorA = this.contadorA - 1;
      
                }

                if(this.countA1 != 0)
                {
                  this.contadorA = this.countA0;
      
                }
               
                if(this.periodosA[5].Estado == 0)
                {
                  this.contadorA = this.countA0 -1;
                }




                this.periodosA.pop();
              }
            
            
            
        }    
        
        
   else{

          this.contAA = 0;
          this.contBB = 0;
          this.contACC = 0;
          this.conthoraB= 0;
          this.contBCC= 0;
          this.posB = 0;

       if(this.periodosB.length > 0)
       {

         this.periodosB.forEach(element => {
          if(element.Estado === 0)
          {
           
            this.contACC = this.contACC + 1;
            if(element.Nombre === data['Nombre'])
            {
              this.conthoraB = this.conthoraB + 1;
              this.posB = this.contACC;
              this.accionB = 4;
            }
            else
            {
              this.contBCC = this.contBCC+1
            }


          }
      
        });


       }


       if(this.conthoraB != 1)
       {
        this.periodosB.unshift(data);
        this.contadorB = this.contadorB + 1;
       }

     this.periodosB.sort(function (a, b) {
        return a.Estado - b.Estado;
      });

     if(this.periodosB.length === 6)
       {
         this.countB0 = 0;
         this.countB1= 0;
         this.periodosB.forEach(element => {
           if(element.Estado === 0)
           {
            
            this.countB0 = this.countB0 +1;
 
 
           }
           else
           {
             this.countB1 = this.countB1 +1;
           }
       
         });


         if(this.countB0 == 6)
         {
           this.contadorB = this.contadorB - 1;

         }

         if(this.countB1 != 0)
         {
           this.contadorB = this.countB0;

         }
        
         if(this.periodosB[5].Estado == 0)
         {
           this.contadorB = this.countB0 -1;
         }


         this.periodosB.pop();
       }
        
        }


      });
   
  });
}

 doCapturaA($event)
 {

   let horasA = $event;
  if(horasA !== '00:00:00')
  {
     this.tiemposA.push(horasA);
  }

 
   this.setDato= this.tiemposA[this.pos - 1];
   if(this.setDato != undefined)
   {
         this.accion = 8;
         this.tiemposA= [];
   }

 }


 doCapturaB(eve)
 {



   let horasB = eve;
   if(horasB !== '00:00:00')
   {
     this.tiemposB.push(horasB);
   }
 
   this.setDatoB= this.tiemposB[this.posB - 1];
   if(this.setDatoB != undefined)
   {
         this.accionB = 8;
         this.tiemposB= [];
   }


 }

 doCapturarFinalA(datocolor)
 {
   let cronometrosLista = document.querySelectorAll(".ui-g-12.left.tiempo");
   let indice = 0;
   Array.prototype.slice.call(document.querySelectorAll(".ui-g-12.left.tiempo")).forEach(element => {
      if (element.innerText == "00:00" || element.innerText == "00:01")

     {
      this.periodosA[indice].Estado = 1;


     }
     indice++;
  
   });
   this.contadorA = this.contadorA - 1;
   if(this.contadorA < 0)
   {
     this.contadorA = 0;
   }
 }


 doCapturarFinalB($event){

  let cronometrosLista = document.querySelectorAll(".ui-g-12.right.tiempo");
  let indice = 0;
  Array.prototype.slice.call(document.querySelectorAll(".ui-g-12.right.tiempo")).forEach(element => {
    if (element.innerText == "00:00" || element.innerText == "00:01")
    
    {
     this.periodosB[indice].Estado = 1;
  
    }
 
    indice++;
  });
  this.contadorB = this.contadorB - 1;

   
    if(this.contadorB < 0)
    {
      this.contadorB = 0;
    }
 }







}
