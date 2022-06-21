import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { PodioService } from '../../service/conjunto/podio.service';
import { DeporteService } from '../../service/Acreditacion/deporte.service';
import { PronosticoService } from '../../service/conjunto/pronostico.service';
import { Http } from "@angular/http";
import { MedalleroService } from '../../service/conjunto/medallero.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { Router, ActivatedRoute } from '@angular/router';
import * as urls from '../../domain/Shared/global';


@Component({
  selector: 'app-visor-pronostico',
  templateUrl: './visor-pronostico.component.html',
  styleUrls: ['./visor-pronostico.component.css'],
  providers: [PodioService, DeporteService, PronosticoService, MedalleroService],
  encapsulation: ViewEncapsulation.None
})
export class VisorPronosticoComponent implements OnInit {

   clima: any;
   temperatura: number;
   timer: any;
   nombre: string;
   icono: string;

   @Input() lugar: string;




  public dias: any[];
  public dia1: any;
  public dia2: any;
  public dia3: any;
  fecha1:any;
  fecha2:any;
  fecha3:any;
  fecha4:any;
  fecha5:any;
  fecha6:any;
  fecha7:any;
  temp_maxima1:any;
  temp_maxima2:any;
  temp_maxima3:any;
  temp_maxima4:any;
  temp_maxima5:any;
  temp_maxima6:any;
  temp_maxima7:any;
  temp_minima1:any;
  temp_minima2:any;
  temp_minima3:any;
  temp_minima4:any;
  temp_minima5:any;
  temp_minima6:any;
  temp_minima7:any;
  icono1:any;
  icono2:any;
  icono3:any;
  icono4:any;
  icono5:any;
  icono6:any;
  icono7:any;

  humedad1:any;
  humedad2:any;
  humedad3:any;
  humedad4:any;
  humedad5:any;
  humedad6:any;

  viento1:any;
  viento2:any;
  viento3:any;
  viento4:any;
  viento5:any;
  viento6:any;

  texto1:any;
  texto2:any;
  texto3:any;
  texto4:any;
  texto5:any;
  texto6:any;


  ico_fase_luna1:any;
  ico_fase_luna2:any;
  ico_fase_luna3:any;
  ico_viento1:any;
  ico_viento2:any;
  ico_viento3:any;
  puesta_luna1:any;
  puesta_luna2:any;
  puesta_luna3:any;
  puesta_sol1:any;
  puesta_sol2:any;
  puesta_sol3:any;
  today:any;
  private _connection: SignalRConnection;
  private _mensaje: SignalRConnection;

  o: IConnectionOptions = {
    hubName: 'HammerPronosticoHub',
    qs: {
      name: 'usuario',
      group: 'pronostico'
    },
    url: urls.urlSockets
  };

 
  constructor(
    private podioService: PodioService,
    private deporteService: DeporteService,
    private pronosticoService: PronosticoService,
    private medalleroService: MedalleroService,
    private _signalR: SignalR,
    private activedRoute: ActivatedRoute,
    private http: Http
  ) {

    this.dias = [];

    
  }

  ngOnInit() {

  
  //  this.datos();
   this.initClima();
   this.getTiempo();
   this.recargar();
   this.goTimer();


  }


private recargar(){



  setTimeout(function(){ location.reload();
  }, 90000000);

}

 private initClima() {
     try {
         this.lugar = 'Cochabamba';
         this.medalleroService
         .GetClima(String(this.lugar).replace(/"/g, ''))
         .then(res => {
           this.clima = res;

           this.temperatura = Math.round(Number(this.clima.main.temp) - 273);
           this.nombre =
             String(this.clima.name) === 'Potosi'
               ? 'Potosí'
               : String(this.clima.name);
           this.icono = String(this.clima.weather[0].icon);
         });
     } catch (error) {
       this.temperatura = 0;
       this.nombre = '';
     }
   }

   private goTimer() {
    let c = 0;
    this.timer = setInterval(() => {
      c++;
      this.initClima();
      if (c === 60) {
        clearInterval(this.timer);
        this.goTimer();
      }
    }, 3600000);
  }

  private getTiempo(){


    this.pronosticoService
    .GetTiempo()
    .then(res => {

     const datos = res;

      this.fecha1 = datos[558];
      this.fecha2 =  datos[589];
      this.fecha3 = datos[620];
      this.fecha4 = datos[651];
      this.fecha5 =  datos[682];
      this.fecha6 = datos[713];
      this.fecha7 = datos[744];

     this.humedad1= datos[568];
     this.humedad2=datos[599];
     this.humedad3=datos[630];
     this.humedad4= datos[661];
     this.humedad5=datos[692];
     this.humedad6=datos[723];


     this.temp_maxima1=datos[560];
     this.temp_maxima2=datos[591];
      this.temp_maxima3=datos[622];
      this.temp_maxima4=datos[653];
      this.temp_maxima5=datos[684];
       this.temp_maxima6=datos[715];
       this.temp_maxima7=datos[746];

     this.temp_minima1=datos[562];
      this.temp_minima2=datos[593];
      this.temp_minima3=datos[624];
      this.temp_minima4=datos[655];
      this.temp_minima5=datos[686];
      this.temp_minima6=datos[717];
      this.temp_minima7=datos[748];






     this.texto1=datos[566];
     this.texto2=datos[597];
     this.texto3=datos[628];
     this.texto4=datos[659];
     this.texto5=datos[690];
     this.texto6=datos[721];

     this.viento1=datos[570];
     this.viento2=datos[601];
      this.viento3=datos[632];
      this.viento4=datos[663];
      this.viento5=datos[694];
       this.viento6=datos[725];


     this.icono1=datos[564];
      this.icono2=datos[595];
      this.icono3=datos[626];
      this.icono4=datos[657];
      this.icono5=datos[688];
      this.icono6=datos[719];
      this.icono7=datos[750];

   
      







    });

  }





}

