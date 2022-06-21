import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  trigger,
  state,
  animate,
  transition,
  style
} from '@angular/core';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { ActivatedRoute, Router } from '@angular/router';
import * as urls from '../../../domain/Shared/global';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-tablero-panel',
  templateUrl: './tablero-panel.component.html',
  styleUrls: ['./tablero-panel.component.css'],
  providers: [DeporteService]
})
export class TableroPanelComponent implements OnInit {
  private _connection: SignalRConnection;
  private _mensaje: SignalRConnection;
  tablero = 0;
  tablero_actual = 0;
  EventoId: number;
  delegacionId: number;
  deporteId: number;
  parametroRamaId: number;
  grupoid: number;
  pruebaId: number;
  show_patrocinio = true;
  show_mensaje = false;
  show = true;
  pie_show = true;
  show_logo = false;
  json = '';
  f5_medallero = false;

  timer: any;
  timer_tablero: any;
  timer_podio: any;
  timer_gif: any;
  tiempo: number;

  mensaje = 'MINISTERIO DE DEPORTES';
  ciudad = 'cochabamba';
  acciones: string[];
  pruebas: any[];
  prueba_actual: number;
  es_podio: number;

  fechas: Date[];  
  fecha: Date;
  style: any;
  style_gif: any;
  style_titulo: any;
  style_fondo: any;
  visible: string;

  show_marquee = false;
  @ViewChild('panel', { read: ElementRef })
  public panel: ElementRef;

  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: this.route.snapshot.params['screenId'], group: 'resultados' },
    url: urls.urlSockets
  };

  constructor(
    private _signalR: SignalR,
    private route: ActivatedRoute,
    private deporteService: DeporteService
  ) {
    this.tablero = 0;
    this.style_gif = {
      'background-image':
        'url("assets/esponsors/gif-esponsor.gif?' + Math.random() + '")'
    };
    this.fechas = [];
    this.visible = '';
  }

  ngOnInit() {
    $('body').attr(
      'style',
      'overflow-y:hidden !important; overflow-x:hidden !important; '
    );
    this.refresh();
    this.acciones = [];
    this.conectar();
    this.hiloConectar();

    this.f5_medallero = false;
  }

  private initDatos(data) {

    this.tablero = Number(data['accion']);
    this.EventoId = Number(data['eventoId']);
    this.delegacionId = Number(data['delegacion']);
    this.parametroRamaId = Number(data['parametroRamaId']);
    this.grupoid = Number(data['grupoid']);
    this.ciudad = data['ciudad'] === undefined ? 'cochabamba' : String(data['ciudad']);
    this.acciones = data['seleccionadas'];
    // this.show_logo = Boolean(data['viewlogo']);
    this.deporteId = Number(data['deporteId']);
    this.tiempo = data['tiempo'];
    this.pruebaId = data['pruebaId'];
    this.pruebas = data['pruebas_selecciondas'];
    this.es_podio = data['podio'];
    this.fechas = data['fechas'];
    this.json = data['json'];
    this.fecha = data['fecha'];
    switch (this.EventoId) {
      case 1:
        this.style = { 'background-color': 'rgb(151, 32, 32)' };
        this.style_titulo = { color: '#FF2C26' };
        this.style_fondo = { 'background-color': '#000' };
        break;
      case 2:
        this.style = { 'background-color': 'rgb(1, 139, 176)' };
        this.style_titulo = { color: '#012C72' };
        this.style_fondo = { 'background-color': '#002C53' };
        break;
      case 3:
        this.style = { 'background-color': 'rgb(1, 139, 176)' };
        this.style_titulo = { color: '#012C72' };
        this.style_fondo = { 'background-color': '#002C53' };
        break;
      case 4:
        this.show_logo = false;

        if (this.tablero === 40) {
          this.show_logo = false;
          this.pie_show = false;
        } else {
          this.show_logo = true;
          this.pie_show = true;
        }
        break;
      case 5:
        if (this.tablero === 24 || this.tablero === 40) {
          this.show_logo = false;
          this.pie_show = false;
        } else {
          this.show_logo = true;
          this.pie_show = true;
        }
        break;
      default:
        this.style = { 'background-color': '#000' };
        break;
    }

    switch (this.deporteId) {
      case 39:
        this.style = { 'background-color': 'rgb(17, 88, 17)' };
        this.style_titulo = { color: '#003400' };
        this.style_fondo = { 'background-color': '#000' };
        break;
      default:
        this.style = { 'background-color': '#000' };
        break;
    }

    if (this.es_podio === 0) {
      this.iterarTableros();
    }
    if (this.es_podio === 1) {
      this.iterarPodios();
    }
  }
  private esperaShowSponsor() {
    let c = 0;
    this.show_patrocinio = false;
    this.timer = setInterval(() => {
      c++;

      if (c === 18) {
        clearInterval(this.timer);
        this.show_patrocinio = true;
      }
    }, 10000);
  }
  private iterarTableros() {
    let c = 0;

    if (this.acciones.length > 1) {
      this.timer_tablero = setInterval(() => {
        this.tablero_actual = Number(this.acciones[c]);
        if (this.tablero_actual !== this.tablero) {
          const x = Math.floor(Math.random() * (2 - 1)) + 1; // Math.floor((Math.random() * 6) + 1);
          this.show = false;
          this.style_gif = {
            'background-image':
              'url("assets/esponsors/' + x + '.gif?' + Math.random() + '")'
          };
          this.timer_gif = setInterval(() => {
            clearInterval(this.timer_gif);

            this.tablero = this.tablero_actual;
            this.show = true;
            // this.tablero=6;
          }, 6000);
        }
        c++;
        if (c === this.acciones.length) {
          clearInterval(this.timer_tablero);
          this.iterarTableros();
        }
      }, this.tiempo * 1000);
    }
  }
  private iterarPodios() {
    let c = 0;
    if (this.pruebas.length > 1) {
      if (this.pruebas[0] !== '0') {
        this.timer_podio = setInterval(() => {
          this.prueba_actual = Number(this.pruebas[c]);
          if (this.prueba_actual !== this.pruebaId) {
            const x = Math.floor(Math.random() * (2 - 1)) + 1; // Math.floor((Math.random() * 6) + 1);
            this.show = false;
            this.style_gif = {
              'background-image':
                'url("assets/esponsors/' + x + '.gif?' + Math.random() + '")'
            };
            this.timer_gif = setInterval(() => {
              clearInterval(this.timer_gif);

              this.tablero = 5;
              this.pruebaId = this.prueba_actual;

              this.show = true;
            }, 6000);
          }
          c++;
          if (c === this.pruebas.length) {
            clearInterval(this.timer_podio);
            this.iterarPodios();
          }
        }, this.tiempo * 1000);
      }
    }
  }

  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this.visible = 'circleC';
    this._connection.start().then(c => {
      this.socketService(c);
    });
    this._connection.status.subscribe((change) => {
      console.log(change);
      if (change.name === 'disconnected') {
        this.visible = 'circleR';
        // this.message = 'Reconectando...';
        console.log('aqui tendria que reconectar');
        this._connection.start().then((c) => {
          this.socketService(c);
        });
      }
      if (change.name === 'reconnecting') {
        this.visible = 'circleR';
        // this.message = 'Reconectando...';
      }
      if (change.name === 'connected') {
        this.visible = 'circle';
        // this.message = 'Conectado';
      }
    });
  }
  private refresh() {
    const isRefresh = Number(
      localStorage.getItem('res-' + this.route.snapshot.params['screenId'])
    );
    if (isRefresh === 1) {
      this.tablero = Number(0);
      const aux_data = JSON.parse(
        localStorage.getItem(this.route.snapshot.params['screenId'])
      );
      this.initDatos(aux_data);
      localStorage.removeItem('res-' + this.route.snapshot.params['screenId']);
    }
  }
  private hiloConectar() {
    const isStopped = this._connection.status['isStopped'];
    const closed = this._connection.status['closed'];
    const timerScroll = setInterval(() => {
      console.clear();
      this.conectar();
    }, 600000);
  }
  socketService(c) {
    const listener = c.listenFor('setAccion');
    listener.subscribe(data => {
      clearInterval(this.timer_tablero);
      clearInterval(this.timer_gif);
      this.show = true;
      localStorage.setItem(
        this.route.snapshot.params['screenId'],
        JSON.stringify(data)
      );

      this.initDatos(data);
    });
    const listenerMensaje = c.listenFor('setMensaje');
    listenerMensaje.subscribe(data => {
      const message = String(data);
      if (message !== 'refrescar') {
        this.mensaje = message;
      } else {
        localStorage.setItem(
          'res-' + this.route.snapshot.params['screenId'],
          '1'
        );
        this.f5_medallero = !this.f5_medallero;
        // location.reload();
      }
    });

    c
      .invoke('controlPantalla', this.o.qs.name, this.o.qs.group)
      .then(() => { });
  }
}
