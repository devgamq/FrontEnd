import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { SelectItem } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import * as urls from '../../../domain/Shared/global';
import { InputTextareaModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';

declare var jQuery: any;
declare var $: any;
declare var CodeMirror;
@Component({
  selector: 'app-pantalla-switch',
  templateUrl: './pantalla-switch.component.html',
  styleUrls: ['./pantalla-switch.component.css'],
  providers: [DeporteService, ConjuntoService],
  encapsulation: ViewEncapsulation.None
})
export class PantallaSwitchComponent implements OnInit {
  private _connection: SignalRConnection;
  pantallas: SelectItem[];
  pantallas_seleccionadas: string[];
  acciones: SelectItem[];
  deportes: SelectItem[];
  generos: SelectItem[];
  pruebas: SelectItem[];
  delegaciones: SelectItem[];
  eventoId = 1;
  pruebas_seleccionadas: string[];
  fechas: Date[];
  fecha: Date;
  pantalla: string;
  mensaje: string;
  ciudad: string;
  deporte: string;
  prueba: string;
  deporte_podio: string;
  genero_podio: string;
  genero: string;
  delegacion: string;
  transicion: string;
  accion: any;
  es: any;
  viewlogo: boolean;
  json: string;
  pantallas_data: any[];
  auxiliar: any[];
  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'control', group: 'resultados' },
    url: urls.urlSockets
  };
  message: string;
  visible: string;
  constructor(
    private _signalR: SignalR,
    private route: ActivatedRoute,
    private deporteService: DeporteService,
    private conjuntoService: ConjuntoService
  ) {
    this.pantallas = [];
    this.pantallas_seleccionadas = [];
    this.pantalla = '';
    this.viewlogo = true;
    this.fechas = [];
    this.pantallas_data = [];
    this.message = '';
    this.visible = '';
  }

  ngOnInit() {
    this.initFechas();
    this.eventoId = this.route.snapshot.params['eventoId'];
    this.transicion = '25';
    this.initAcciones();
    this.initCiudades();
    this.initDeportes();
    this.initGeneros();
    this.initDelegaciones();
    this.conectar();
    this.hiloConectar();

    this.get_storage();
  }
  private get_storage() {


    try {
      this.pantallas_data = JSON.parse(localStorage.getItem('data_remote')).map(
        item => {
          return {
            pantalla: item.pantalla,
            visor: { id: item.visor.id, name: item.visor.name },
            deporte: { id: item.deporte.id, name: item.deporte.name },
            fecha: new Date(item.fecha),
            tiempo: item.tiempo
          };
        }
      );
    } catch (error) {
      this.pantallas_data = [];
    }
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
  private initCode() {
    const code = $('#code')[0];
    const editor = CodeMirror.fromTextArea(code, {
      lineNumbers: true,
      mode: 'json'
    });
  }
  private initPantallas() {
    this.pantallas = [];
    this.auxiliar = [];
    // this.pantallas_data = [];
  }
  private initAcciones() {
    this.acciones = [];


    this.acciones.push({
      label: 'Resumen Versus',
      value: { id: 25, name: 'Resumen Versus' }
    });
    this.acciones.push({
      label: 'Jornadas',
      value: { id: 21, name: 'Jornada' }
    });
    this.acciones.push({
      label: 'Individual',
      value: { id: 42, name: 'Individual' }
    });

    this.acciones.push({
      label: 'Records Finales',
      value: { id: 22, name: 'Records' }
    });
    this.acciones.push({
      label: 'Medallero General',
      value: { id: 1, name: 'Medallero General' }
    });

    this.acciones.push({
      label: 'Medallero Mini Atletismo',
      value: { id: 7, name: 'Medallero Mini Atletismo' }
    });
    // this.acciones.push({ label: 'Medallero por Deporte', value: 2 });
    // this.acciones.push({ label: 'Medallero Por Delegacion', value: 3 });
    this.acciones.push({
      label: 'Tabla de posiciones',
      value: { id: 4, name: 'Tabla de posiciones' }
    });
    // this.acciones.push({ label: 'Llaves', value: { id: 8, name: 'Llaves' } });
    this.acciones.push({ label: 'Podios', value: { id: 5, name: 'Podios' } });
    this.acciones.push({
      label: 'Participantes',
      value: { id: 20, name: 'Estudiantes' }
    });
    this.acciones.push({
      label: 'Pronósticos',
      value: { id: 40, name: 'Pronosticos' }
    });
    this.acciones.push({
      label: 'Sporting Timing',
      value: { id: 43, name: 'Sporting Timing' }
    });
    this.acciones.push({
      label: 'V-Ciclismo',
      value: { id: 99, name: 'Jornada Ciclismo' }
    });
    this.acciones = this.acciones.
      sort((a, b) => String(a.label).localeCompare(String(b.label)));
  }

  private initGeneros() {
    this.generos = [];
    this.generos.push({ label: 'Todos', value: 0 });
    this.generos.push({ label: 'Damas', value: 2 });
    this.generos.push({ label: 'Varones', value: 1 });
  }
  private initCiudades() {
    const evento = this.route.snapshot.params['eventoId'];
    switch (evento) {
      case '1':
        this.ciudad = 'Potosi';
        break;
      case '2':
        this.ciudad = 'La Paz';
        break;
      case '3':
        this.ciudad = 'Cochabamba';
        break;
      case '5':
        this.ciudad = 'Cochabamba';
        break;
    }
  }
  private initDeportes() {
    // this.deporteService.getDeportes(2).then(res => {
    this.deporteService.getDeportes(this.eventoId).then(res => {
      this.deportes = res
        .map(item => {
          return {
            value: { id: item.DeporteId, name: item.DeporteDescripcion },
            label: item.DeporteDescripcion
          };
        })
        .sort((a, b) => String(a.label).localeCompare(String(b.label)));
    });
  }
  private initDelegaciones() {
    this.conjuntoService.GetDelegaciones(this.eventoId).then(res => {
      this.delegaciones = res.map(item => {
        return {
          value: item.DelegacionId,
          label: item.Nombre
        };
      });
    });
  }
  private buscarPantalla(visor: string) {
    for (let i = 0; i < this.pantallas_data.length; i++) {
      if (this.pantallas_data[i].pantalla === visor) {
        return true;
      }
    }
    return false;
  }
  private conectar() {


    this._connection = this._signalR.createConnection(this.o);
    this.visible = 'setMessageC';
    this.message = 'Conectando...';
    this._connection.start().then(c => {
      this.socketService(c);
    });
    this._connection.status.subscribe((change) => {
      console.log(change);
      if (change.name === 'disconnected') {
        this.visible = 'setMessageR';
        this.message = 'Reconectando...';
        console.log('aqui tendria que reconectar');
        this._connection.start().then((c) => {
          this.socketService(c);
        });
      }
      if (change.name === 'reconnecting') {
        this.visible = 'setMessageR';
        this.message = 'Reconectando...';
      }
      if (change.name === 'connected') {
        this.visible = 'setMessage';
        this.message = 'Conectado';
      }
    });
  }
  onChange_dropdown() {
    localStorage.setItem('data_remote', JSON.stringify(this.pantallas_data));
  }
  private hiloConectar() {
    const timerScroll = setInterval(() => {
      console.clear();
      this.conectar();
    }, 600000);
  }
  private desconectar() {
    this._connection.invoke('disconnectedPantalla', this.o.qs.group);
  }
  delete(data) {
    console.log(data);
    this.desconectar();
  }
  private getFechas() {
    try {
      this.fechas = [];
      const date_inicio = this.fecha;
      const date_fin = new Date();
      this.fechas.push(
        new Date(
          date_inicio.getFullYear(),
          date_inicio.getMonth(),
          date_inicio.getDate()
        )
      );

      while (date_inicio < date_fin) {
        const i = date_inicio.getDate() + 1;
        date_inicio.setDate(i);
        this.fechas.push(
          new Date(
            date_inicio.getFullYear(),
            date_inicio.getMonth(),
            date_inicio.getDate()
          )
        );
      }
      console.log(this.fechas);
    } catch (error) {
      this.fechas = [];
    }
  }
  enviar(data) {
    console.log(data);
    this.fechas = [];
    try {
      this.fechas.push(
        new Date(
          data.fecha.getFullYear(),
          data.fecha.getMonth(),
          data.fecha.getDate()
        )
      );
    } catch (error) {
      this.fechas = [];
    }
    const grupo = data.pantalla === 'all' ? '0' : this.o.qs.group;
    const inputs = {
      eventoId: this.eventoId,
      deporteId: data.deporte.id,
      parametroRamaId: 0,
      grupoid: this.route.snapshot.params['grupoid'],
      pruebaId: this.route.snapshot.params['pruebaId'],
      accion: data.visor.id,
      ciudad: this.ciudad,
      seleccionadas: [],
      viewlogo: this.viewlogo,
      delegacion: '0',
      tiempo: data.tiempo,
      pruebas_selecciondas: ['0'],
      podio: 0,
      fechas: this.fechas,
      json: this.json,
      fecha: new Date(
        data.fecha.getFullYear(),
        data.fecha.getMonth(),
        data.fecha.getDate()
      )
    };
    this._connection.invoke('send', data.pantalla, inputs);
  }
  private send() {
    // this.json = $('#code').html();
    // this.getFechas();
    try {
      this.fechas.push(
        new Date(
          this.fecha.getFullYear(),
          this.fecha.getMonth(),
          this.fecha.getDate()
        )
      );
    } catch (error) {
      this.fechas = [];
    }

    const grupo = this.pantalla === 'all' ? '0' : this.o.qs.group;
    const inputs = {
      eventoId: this.eventoId,
      deporteId: this.deporte,
      parametroRamaId: 0,
      grupoid: this.route.snapshot.params['grupoid'],
      pruebaId: this.route.snapshot.params['pruebaId'],
      accion: this.accion.id,
      ciudad: this.ciudad,
      seleccionadas: [],
      viewlogo: this.viewlogo,
      delegacion: '0',
      tiempo: this.transicion,
      pruebas_selecciondas: ['0'],
      podio: 0,
      fechas: this.fechas,
      json: this.json,
      fecha: new Date(
        this.fecha.getFullYear(),
        this.fecha.getMonth(),
        this.fecha.getDate()
      )
    };
    const count = this.pantallas_seleccionadas.length;

    if (count > 0) {
      console.log(inputs);
      this.pantallas_seleccionadas.forEach(element => {
        this._connection.invoke('send', element, inputs);
        this.clean();
      });
    }
  }
  private clean() {
    this.pantallas_seleccionadas = [];
    this.accion = '';
    this.deporte = '';
    this.fechas = [];
    this.fecha = null;
  }
  private sendMensaje() {
    const grupo = this.pantalla === 'all' ? '0' : this.o.qs.group;
    this.pantallas_seleccionadas.forEach(element => {
      this._connection.invoke('sendTexto', element, this.mensaje);
    });
  }
  open() {

    window.open(`#/panel/pantalla${Math.floor(Math.random() * 60 + 1)}`);
  }
  private deporteOnchange($event) {
    this.deporteService
      .getPruebas(
        this.eventoId,
        Number(this.deporte_podio),
        Number(this.deporte_podio) > 2 && Number(this.deporte_podio) < 7 ? 0 : 1
      )
      .then(res => {
        this.pruebas = [];
        this.pruebas = res.map(item => {
          return {
            value: item.PruebaId,
            label: item.PruebaDescripcion
          };
        });
      });
  }
  private sendPodio() {
    const grupo = this.pantalla === 'all' ? '0' : this.o.qs.group;
    const inputs = {
      eventoId: this.eventoId,
      deporteId: [this.deporte_podio],
      parametroRamaId: this.genero_podio,
      grupoid: this.route.snapshot.params['grupoid'],
      pruebaId: this.prueba.length > 0 ? this.prueba[0] : '0',
      accion: 5,
      ciudad: this.ciudad,
      seleccionadas: ['5'],
      viewlogo: this.viewlogo,
      delegacion: this.delegacion,
      tiempo: this.transicion,
      pruebas_selecciondas: this.prueba,
      podio: 1
    };

    this._connection.invoke('send', this.pantalla, inputs);
  }
  private sendRefresh() {
    console.clear();
    this._connection.invoke('sendTexto', this.pantalla, 'refrescar');
    this.pantalla = '';
  }
  socketService(c) {
    const listener = c.listenFor('controlPantalla');
    listener.subscribe(data => {
      this.initPantallas();
      for (const prop in data) {
        if (data[prop] !== 'control') {
          const valido = this.buscarPantalla(data[prop]);

          const valores = { label: data[prop], value: data[prop] };
          this.pantallas.push(valores);
          this.auxiliar.push({
            pantalla: data[prop],
            visor: { id: 0, name: 'Ninguno' },
            deporte: { id: 0, name: 'Todos' },
            fecha: new Date(),
            tiempo: 25
          });

          if (!valido) {
            this.pantallas_data.push({
              pantalla: data[prop],
              visor: { id: 0, name: 'Ninguno' },
              deporte: { id: 0, name: 'Todos' },
              fecha: new Date(),
              tiempo: 25
            });
          }
        }
      }
      // tslint:disable-next-line:forin
      for (const i in this.auxiliar) {
        for (const j in this.pantallas_data) {
          if (this.auxiliar[i].pantalla === this.pantallas_data[j].pantalla) {
            this.auxiliar[i] = this.pantallas_data[j];
          }
        }
      }
      localStorage.setItem('data_remote', JSON.stringify(this.auxiliar));
      this.pantallas_data = [];
      this.get_storage();

      console.clear();
    });
    c
      .invoke('controlPantalla', this.o.qs.name, this.o.qs.group)
      .then(() => { });
  }
}
