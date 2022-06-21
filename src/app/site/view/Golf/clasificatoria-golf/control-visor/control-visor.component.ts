import { Component, OnInit, AfterViewInit, NgModule } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../../service/Golf/categoria.service';
import { ButtonModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { TriStateCheckboxModule } from 'primeng/primeng';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../../domain/Shared/global';

@Component({
  selector: 'app-control-visor',
  templateUrl: './control-visor.component.html',
  styleUrls: ['./control-visor.component.css'],
  providers: [/*SocketService,*/ CategoriaService]
})
export class ControlVisorComponent implements OnInit {
  boton_act = 'Automatico';
  boton_scroll = 'Scroll Movimiento';
  listacategorias: any[];
  handy: any;
  tiempo: SelectItem[];
  eventoId: number;
  jornadaId: number;
  categoriaId: number;
  jornada: string;
  categoria: string;
  connection;
  cicloTimer;
  seleccion = '2000';
  deporte = 39;
  seleccionHandy: string;
  fecha: Date;
  es: any;

  /*sockets */
  private _connection: SignalRConnection;
  private _mensaje: SignalRConnection;

  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'usuario:visor', group: 'golf' },
    url: urls.urlSockets
  };

  constructor(
    private activedRoute: ActivatedRoute,
    /*private socket: SocketService,*/
    private categoriaService: CategoriaService,
    private _signalR: SignalR,
    private router: Router
  ) {
    this.tiempo = [];
    this.tiempo.push({ label: 'Selec. Tiempo', value: null });
    this.tiempo.push({ label: '2 seg', value: '2000' });
    this.tiempo.push({ label: '3 seg', value: '3000' });
    this.tiempo.push({ label: '5 seg', value: '5000' });
    this.tiempo.push({ label: '7 seg', value: '7000' });
    this.tiempo.push({ label: '10 seg', value: '10000' });
    this.tiempo.push({ label: '15 seg', value: '15000' });
    this.tiempo.push({ label: '30 seg', value: '30000' });
    this.tiempo.push({ label: '60 seg', value: '60000' });

    this.handy = [];
    this.handy.push({ label: 'ocultar', value: 'ocultar' });
    this.handy.push({ label: 'mostrar', value: 'mostrar' });
  }
  ngOnInit() {
    this.eventoId = this.activedRoute.snapshot.params['eventoId'];
    this.conectar();
    this.initFechas();
  }
  /*sockets */
  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    return new Promise((resolve, reject) => {
      this._connection.start().then(c => {
        const listener = c.listenFor('controlGolfVisor');
        listener.subscribe(data => { });
        this.actualizarVisor(
          this.jornadaId,
          this.categoriaId,
          this.jornada,
          this.categoria

        );
      });
      resolve();
    });
  }
  actualizarVisor(jornadaId, categoriaId, jornada, categoria) {
    const parametroVisoar = {
      jornadaId: jornadaId,
      categoriaId: categoriaId,
      jornada: jornada,
      categoria: categoria
    };
    this._connection.invoke('mostrarDatos', 'all', parametroVisoar, 'golf');
  }
  actualizarVisorJornada(jornadaId, categoriaId, jornada, categoria) {
    const parametroVisoar = {
      jornadaId: jornadaId,
      categoriaId: categoriaId,
      jornada: jornada,
      categoria: categoria
    };
    this._connection.invoke(
      'mostrarDatos',
      'all',
      parametroVisoar,
      'golf_jornada'
    );
  }
  actualizarVisorEquipo(data) {

    this._connection.invoke(
      'mostrarDatos',
      'all',
      data,
      'golf_equipo'
    );
  }
  handleCategoria($event) {
    this.categoriaId = $event.categoriaId;
    this.categoria = $event.descripcion;
    this.parar();
    this.actualizarVisor(
      this.jornadaId,
      this.categoriaId,
      this.jornada,
      this.categoria
    );
  }
  handleCategoria_jornada($event) {
    this.categoriaId = $event.categoriaId;
    this.categoria = $event.descripcion;
    this.actualizarVisorJornada(
      this.jornadaId,
      this.categoriaId,
      this.jornada,
      this.categoria
    );
  }
  handleJornada($event) {
    this.jornadaId = $event.jornadaId;
    this.jornada = $event.descripcion;
    this.parar();
    this.actualizarVisor(
      this.jornadaId,
      this.categoriaId,
      this.jornada,
      this.categoria
    );
  }

  handleCategoria_equipo($event) {
    console.clear()
    console.log($event)
    this.categoriaId = $event.categoriaId;
    this.categoria = $event.descripcion;
    const data = {
      PruebaEventoId: $event.PruebaEventoId,
      jornadaId: this.jornadaId,
      categoriaId: this.categoriaId,
      jornada: this.jornada,
      categoria: this.categoria
    };
    this.actualizarVisorEquipo(data);
  }

  cicloTiempo() {

    this.boton_act = 'Parar Automatico';
    const aidjornada = this.jornadaId;
    const ajornada = this.jornada;
    let lcc;
    lcc = this.listacategorias;
    let contador = 0;
    let parametroVisoar;
    const _connection2 = this._connection;
    this.cicloTimer = setInterval(function () {
      parametroVisoar = {
        jornadaId: aidjornada,
        categoriaId: lcc[contador].CategoriaId,
        jornada: ajornada,
        categoria: lcc[contador].Descripcion
      };
      _connection2.invoke('mostrarDatos', 'all', parametroVisoar, 'golf');
      if (contador < lcc.length - 1) {
        contador++;
      } else {
        contador = 0;
      }
    }, this.seleccion);
  }
  scroll() {

    if (this.boton_scroll === 'Scroll Movimiento') {
      this.boton_scroll = 'Detener Scroll';
      this._connection.invoke('devuelveScrollDatos', 'all', 'scroll', 'golf');
    } else {
      this.boton_scroll = 'Scroll Movimiento';
      this._connection.invoke(
        'devuelveScrollDatos',
        'all',
        'scroll_pausa',
        'golf'
      );
    }

  }
  automatico2() {
    if (this.boton_act === 'Parar Automatico') {
      this.parar();
    } else {
      const newcategorias = [];
      this.categoriaService.getCategoriasList(this.eventoId).then(res => {
        this.listacategorias = res;
        this.cicloTiempo();
      });
    }
  }
  parar() {
    this.boton_act = 'Automatico';
    clearInterval(this.cicloTimer);
  }
  ocultarHandy() {
    console.log(this.seleccionHandy);
    this._connection.invoke(
      'devuelveHandyDatos',
      'all',
      this.seleccionHandy,
      'golf'
    );
  }
  send() {
    const inputs = {
      eventoId: this.eventoId,
      deporteId: this.deporte,
      parametroRamaId: 0,
      grupoid: 0,
      pruebaId: 0,
      accion: 39,
      ciudad: 'Cochabamba',
      seleccionadas: [],
      viewlogo: true,
      delegacion: '0',
      tiempo: 25,
      pruebas_selecciondas: ['0'],
      podio: 0,
      fechas: this.fecha,
      json: ''
    };
    this._connection.invoke('send', 'grupos_golf', inputs);
  }
  doOpenVisor() {
    window.open(`#/panel/grupos_golf`);
  }



  doOpenVisorGolf() {
    // this.router.navigate(['/master/golf-Visor', this.jornadaId, this.categoriaId]);
    window.open(`#/visor-golf/${this.eventoId}`);
  }
  doOpenVisorJornada() {
    window.open(`#/visor-jornada/${this.eventoId}`);
  }

  doOpenVisorJornadaGrupo() {
    window.open(`#/visor-jornada-deporte/${this.eventoId}`);
  }
  onChange_dropdown() {
    this.send();
  }
  private initFechas() {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [
        'domingo',
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado'
      ],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre'
      ],
      monthNamesShort: [
        'ene',
        'feb',
        'mar',
        'abr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dic'
      ],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }
}
