import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { Cronometro } from '../../../domain/widgets/cronometro.type';

@Component({
  selector: 'app-cronometro-water-polo',
  templateUrl: './cronometro-water-polo.component.html',
  styleUrls: ['./cronometro-water-polo.component.css']
})

export class CronometroWaterPoloComponent implements OnInit, OnChanges {
  hora: number;
  minuto: number;
  segundo: number;
  capturas: Array<any>;
  

  shora: string;
  sminuto: string;
  ssegundo: string;
  HoraInicio: string;
  HoraTope: string;
  timerIniciado: boolean;
  timer: any;
  color: any;
  horaCapturadaLast: string;
  verde= true;
  Horasarray: Array<any>;
  posicion: number;
  setDatos: any;
  display = false;
  private styleDia: any;
  private styleNoche: any;
  conttotal:any;
  contposicion:any;
  contnoposicion:any;
  contp: any[];
  contnp:any[];
  verden = 0;
  incrementar=0;
  decrementar=0;
  cadenam:any;
  caenas:any;
  miDatoIn:any;
  miDatoDe:any;
  MinutoActual:any;
  MinutoSistema:any;
  segundocapturado:any;


  @Input() time: string;

  @Input() configuracion: Cronometro;
  @Input() iniciar: boolean;
  @Input() pausa: boolean;
  @Input() parar: boolean;
  @Input() reversa: boolean;
  @Input() tieneTope: boolean;
  @Input() style: number;
  @Input() capturar: boolean;
  @Input() accion: number;
  @Input() setTiempo: string;
  @Input() setHora: string;
  @Input() setDato: string;

  @Output() HoraCapturada = new EventEmitter();
  @Output() IngresoTempo = new EventEmitter();
  @Output() ColorVerde= new EventEmitter();
  @Output() Posicion= new EventEmitter();

  constructor() {
    this.hora = 0;
    this.minuto = 0;
    this.segundo = 0;
    this.capturas = [];
    this.Horasarray = [];
    this.contp = [];
    this.contnp = [];
    this.shora = '00';
    this.sminuto = '00';
    this.ssegundo = '00';
    this.timerIniciado = false;
    this.configuracion = new Cronometro();
    this.HoraTope = '';
    this.styleDia = { 'color': 'white', 'background-color': 'transparent' , 'font-family': 'Oswald', 'font-size': '2.2vw',  'text-align': 'top'};
    this.styleNoche = { 'color': 'white', 'background-color': 'black' };
    this.conttotal = 0;
    this.contposicion = 0;
    this.contnoposicion = 0;

  }

  ngOnInit() {

    try {
      if (this.style === 1) { this.color = this.styleNoche; } else { this.color = this.styleDia; }
    } catch (error) {
      this.color = this.styleDia;
    }





    this.iniciarTempo();

    try {
      this.HoraTope =
        this.lpad('0', 2, String(this.configuracion.minutoTope)) + ':' +
        this.lpad('0', 2, String(this.configuracion.segundoTope));
    } catch (error) {

      this.HoraTope = '00:00';
    }
    const tiempoCapturado = localStorage.getItem('tiempo');
    if (this.accion === 5 && this.setTiempo !== '') {
      try {
        this.HoraInicio = "00:20";
        this.initTime();
      } catch (error) { }
    } else {
      if (tiempoCapturado !== '') {
        try {
          this.HoraInicio = this.HoraInicio;
          this.initTime();
        } catch (error) { }
      }
    }
    if (this.iniciar) { this.ngOnIniciar(); }

  }
  private iniciarTempo() {
    try {
      this.ssegundo = this.lpad('0', 2, String(this.configuracion.segundo));
      this.sminuto = this.lpad('0', 2, String(this.configuracion.minuto));
      this.segundo = this.configuracion.segundo;
      this.minuto = this.configuracion.minuto;

      this.HoraInicio = this.sminuto + ':' + this.ssegundo;

    } catch (error) {
      this.HoraInicio = "00:20";
      this.ssegundo = '00';
      this.sminuto = '00';
      this.segundo = 0;
      this.minuto = 0;
    }
  }
  ngOnIniciar() {

     this.ngOnReversa(); 


  }

  ngOnReversa() {




    this.initTime();
    if (this.minuto === 0 && this.segundo === 0) {

      this.pararAlarma();
    }

    if (this.timerIniciado === false) {
      this.timerIniciado = true;


      this.timer = setInterval(() => {
        if (this.getSegundos() > 0) {
          if ((this.segundo === 0 && this.minuto > 0) ||
            (this.segundo === 0 && this.minuto === 0)) { this.segundo = 0; } else {
            this.segundo -= 1;
          }
        }
        if (this.segundo === 0) {
          if (this.minuto > 0) {
            this.segundo = 0;
            this.segundo = 59;
            this.minuto -= 1;
          }
          /*if(this.minuto==0)
            {
              if(this.hora>0){
              this.minuto=0;
              this.minuto=59;

              this.hora-=1;
              }
            }*/

        }
     
        this.initTexto();
        this.controlTope();
      }, 1000);

    }
  }

  ngOnPausar() {
    if (this.timer) {
      this.HoraInicio = this.sminuto + ':' + this.ssegundo;
      if (this.timerIniciado) { this.capturaHora(); }
      this.timerIniciado = false;
      clearInterval(this.timer);

    }
  }
  ngOnDetener() {
    if (this.timer) {
      if (this.timerIniciado) { this.capturaHora(); }

      this.timerIniciado = false;
      clearInterval(this.timer);

      this.hora = 0;
      this.minuto = 0;
      this.segundo = 0;

      this.initTexto();

    }
  }
  ngOnChanges(changes: SimpleChanges) {
    try {

      console.log(changes);
      const pararEvent = changes['capturar'];
      const validateRama = JSON.stringify(pararEvent.currentValue);
      this.capturaHora();
      this.HoraCapturada.emit(this.horaCapturadaLast);
   
 

    } catch (error) {

    }


    try {

      const pararEvent = changes['accion'];
      const action = Number(JSON.stringify(pararEvent.currentValue));

      switch (action) {


       
        case 8:

       this.setDatos = this.setDato;
       this.sminuto;
       this.ssegundo;
       const timeDato = this.setDatos.replace('"', '').split(':');
       
               if (timeDato.length === 3) {
                 const ihora=timeDato[0];
                 const iminuto = timeDato[1];
                 const isegundo = timeDato[2];
                 this.segundocapturado = parseInt(isegundo, 10);
                 
                 this.MinutoActual =  timeDato[1];
                 this.incrementar = this.segundocapturado +1;
                 this.decrementar = this.segundocapturado -1;
                
                 if(this.incrementar >=10)
                 {
                     this.caenas= String(this.incrementar)
                 }
                 else{

                  this.caenas= "0" + String(this.incrementar)

                 }


                 if(this.decrementar >=10)
                 {
                     this.cadenam= String(this.decrementar)
                 }
                 else{

                  this.cadenam= "0" + String(this.decrementar)

                 }



               }

           
             this.miDatoIn = "00" + ":" +  this.MinutoActual + ":" + this.caenas;
             this.miDatoDe = "00" + ":" + this.MinutoActual + ":" + this.cadenam;
              
             this.MinutoSistema = "00" + ":" + this.sminuto + ":" +this.ssegundo;


        if(this.miDatoIn === this.MinutoSistema || this.miDatoDe === this.MinutoSistema|| this.setDatos === this.MinutoSistema )
        {
            const timeL = this.setDatos.replace('"', '').split(':');

            if (timeL.length === 3) {
              const ihora=timeL[0];
              const iminuto = timeL[1];
              const isegundo = timeL[2];
              this.hora=parseInt(ihora);
              this.minuto = parseInt(iminuto, 10);
              this.segundo = parseInt(isegundo, 10);

            }

            this.minuto = this.minuto + 2;
            //this.sminuto =  this.lpad('0', 2, String(this.configuracion.minuto));
            //this.ssegundo;
      
        }

    
             
        break;
        case 4:


 
          this.capturaHora();
          this.HoraCapturada.emit(this.horaCapturadaLast);
    

     
          break;
        case 1:
          
          this.ngOnIniciar();

          break;
        case 3:
          this.ngOnPausar();
          break;
        case 2:

          this.ngOnDetener();
          this.initConfiguracion();
          this.iniciarTempo();
          break;

        case 5:

      

          this.IngresoTempo.emit();
         // this.ngOnDetener();

          // tslint:disable-next-line:no-shadowed-variable
          const pararEvent = changes['setTiempo'];
          const tempo = JSON.stringify(pararEvent.currentValue);
          this.HoraInicio = tempo;
          this.initTime();
          break;
        case 6:
          this.ngOnDetener();
          const sethoraEvento = changes['setHora'];

          const validateRama = JSON.stringify(sethoraEvento.currentValue);
          this.HoraInicio = validateRama;

          this.initTime();
          break;

        default: break;
      }
    } catch (error) {
      // alert(error)
    }
  }
  private controlTope() {
    if (this.tieneTope) {
      const horaAux = this.sminuto + ':' + this.ssegundo;
      if (horaAux === this.HoraTope) {
        if (this.timer) {
          this.timerIniciado = false;
          clearInterval(this.timer);
          
   
          this.ColorVerde.emit(this.verde);
    
        }
      }
    }
  }
  private getSegundos() {
    // var segHora=this.hora*3600;
    const segMin = this.minuto * 60;
    return segMin + this.segundo;
  }
  private initTime() {

  
    
    const timelist = this.HoraInicio.replace('"', '').split(':');

    if (timelist.length === 2) {
      // var ihora=timelist[0];
      const iminuto = timelist[0];
      const isegundo = timelist[1];
      // this.hora=parseInt(ihora);
      this.minuto = parseInt(iminuto, 10);
      this.segundo = parseInt(isegundo, 10);

    } else {
      this.hora = 0;
      this.minuto = 0;
      this.segundo = 0;
    }
    this.initTexto();
  }
  private pararAlarma() {
    if (this.timer) {
      this.timerIniciado = false;
      clearInterval(this.timer);

      this.hora = 0;
      this.minuto = 0;
      this.segundo = 0;

      this.initTexto();

    }

  }
  private initConfiguracion() {

    this.HoraInicio = 
      this.lpad('0', 2, String(this.configuracion.minuto)) + ':' +
      this.lpad('0', 2, String(this.configuracion.segundo));


  }
  private capturaHora() {
    const lapso: any = {};
    lapso.hora = this.shora;
    lapso.minuto = this.sminuto;
    lapso.segundo = this.ssegundo;
    this.horaCapturadaLast = this.lpad('0', 2, this.shora) + ':' +
      this.lpad('0', 2, this.sminuto) + ':' +
      this.lpad('0', 2, this.ssegundo);
    this.capturas.push(lapso);
  }


  private lpad(caracter: string, length: number, texto: string) {
    while (texto.length < length) { texto = caracter + texto; }
    return texto;
  }
  private initTexto() {

    this.sminuto = this.lpad('0', 2, String(this.minuto));
    this.ssegundo = this.lpad('0', 2, String(this.segundo));

  }
  setTime() {
    this.display = true;
  }
  salir() {
    this.display = false;
  }
  loadTiempo($event) {

    this.IngresoTempo.emit();
    this.ngOnDetener();
    this.HoraInicio = "00:20";

    this.initTime();
    this.display = false;
  }

  loadReversa($event) {
    this.reversa = $event;
  }

}
