import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { Cronometro } from '../../../domain/widgets/cronometro.type';

@Component({
  selector: 'app-cronometro-codesur',
  templateUrl: './cronometro-codesur.component.html',
  styleUrls: ['./cronometro-codesur.component.css']
})
export class CronometroCodesurComponent implements OnInit, OnChanges {
  hora: number;
  minuto: number;
  segundo: number;
  dia: number;
  capturas: Array<any>;

  sdia: string;
  shora: string;
  sminuto: string;
  ssegundo: string;
  HoraInicio: string;
  HoraTope: string;
  timerIniciado: boolean;
  timer: any;
  color: any;
  horaCapturadaLast: string;

  display = false;

  private styleDia: any;
  private styleNoche: any;

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

  @Output() HoraCapturada = new EventEmitter();
  @Output() IngresoTempo = new EventEmitter();

  constructor() {
    this.dia = 0;
    this.hora = 0;
    this.minuto = 0;
    this.segundo = 0;
    this.capturas = [];
    this.shora = '00';
    this.sminuto = '00';
    this.ssegundo = '00';
    this.timerIniciado = false;
    this.configuracion = new Cronometro();
    this.HoraTope = '';
    this.styleDia = { 'color': 'black', 'background-color': 'white' };
    this.styleNoche = { 'color': 'white', 'background-color': 'black' };
  }

  ngOnInit() {
    this.iniciarTempo();

    this.HoraTope = '00:00:00:00';

    if (this.iniciar) { this.ngOnIniciar(); }

  }
  private iniciarTempo() {
    try {

      this.sdia = this.lpad('0', 2, String(this.configuracion.dia));
      this.shora = this.lpad('0', 2, String(this.configuracion.hora));
      this.ssegundo = this.lpad('0', 2, String(this.configuracion.segundo));
      this.sminuto = this.lpad('0', 2, String(this.configuracion.minuto));
      this.segundo = this.configuracion.segundo;
      this.minuto = this.configuracion.minuto;
      this.hora = this.configuracion.hora;
      this.dia = this.configuracion.dia;
      this.HoraInicio = this.sdia + ':' + this.shora + ':' + this.sminuto + ':' + this.ssegundo;

    } catch (error) {
      this.HoraInicio = '00:00:00:00';
      this.sdia = '00';
      this.ssegundo = '00';
      this.sminuto = '00';
      this.shora = '00';
      this.segundo = 0;
      this.minuto = 0;
      this.hora = 0;
      this.dia = 0;
    }
  }
  ngOnIniciar() {
    this.ngOnReversa();


  }

  ngOnReversa() {
    //  this.initTime();
    if (this.dia === 0 && this.hora === 0 && this.minuto === 0 && this.segundo === 0) {

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
          if (this.minuto === 0) {
            if (this.hora > 0) {
              this.minuto = 0;
              this.minuto = 59;

              this.hora -= 1;
            }
          }
          if (this.hora === 0) {
            if (this.dia > 0) {
              this.hora = 0;
              this.hora = 23;

              this.dia -= 1;
            }
          }

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
          this.ngOnDetener();

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
      this.dia = 0;
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
      this.lpad('0', 2, String(this.configuracion.dia)) + ':' +
      this.lpad('0', 2, String(this.configuracion.hora)) + ':' +
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
    this.sdia = this.lpad('0', 2, String(this.dia));
    this.shora = this.lpad('0', 2, String(this.hora));
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
    this.HoraInicio = $event;

    this.initTime();
    this.display = false;
  }

  loadReversa($event) {
    this.reversa = $event;
  }

}
