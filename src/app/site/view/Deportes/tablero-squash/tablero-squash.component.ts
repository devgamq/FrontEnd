import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { Router, ActivatedRoute } from '@angular/router';
import * as urls from '../../../domain/Shared/global';
import { Util } from '../../../view/Futbol/util';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-tablero-squash',
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
  templateUrl: './tablero-squash.component.html',
  styleUrls: ['./tablero-squash.component.css']
})
export class TableroSquashComponent implements OnInit {
  DelegacionIdA = -1;
  DelegacionIdB = -1;
  PersonasEquipoA: any[];
  PersonasEquipoB: any[];
  urlB1 = '';
  urlB2 = '';
  utilidad: Util;
  jugadorA = 'Jugador 1';
  jugadorA1 = 'Jugador A';
  jugadorA2 = 'Jugador B';
  jugadorB1 = 'Jugador C';
  jugadorB2 = 'Jugador D';
  jugadorB = 'Jugador 2';
  urlA = '';
  urlA1 = '';
  urlA2 = '';
  urlB = '';
  banderaA = '1033x.png';
  banderaB = '1033x.png';
  prueba = 1;
  puntoA = 0;
  puntoB = 0;
  set = 'Set';
  cronometro: String;
  cronometro_descuento: String;
  mensaje = 'LET';
  pantallaId: any;
  posesion: number;
  private _connection: SignalRConnection;
  private _mensaje: SignalRConnection;
  show: boolean;
  visible: boolean;
  periodos: any[];
  styleA: any;
  styleB: any;
  CompetidorBId: number;
  CompetidorAId: number;
  PersonasSelectA: any[];
  PersonasSelectB: any[];
  o: IConnectionOptions = {
    hubName: 'MarcadorSquashHub',
    qs: {
      name: 'usuario',
      group: 'squash'
    },
    url: urls.urlSockets
  };

  constructor(private _signalR: SignalR,
    private activedRoute: ActivatedRoute) {
    this.cronometro = '00:00';
    this.cronometro_descuento = '00:00';
    this.pantallaId = this.activedRoute.snapshot.params['pantallaId'];
    this.o.qs.name = this.pantallaId;
    this.conectar();
    this.visible = false;
    this.periodos = [];
    this.utilidad = new Util();
    this.PersonasEquipoA = [];
    this.PersonasEquipoB = [];
    this.PersonasSelectA = [];
    this.PersonasSelectB = [];
  }

  ngOnInit() {
    $('body').attr(
      'style',
      'overflow-y:hidden !important; overflow-x:hidden !important; '
    );
    this.styleA = { display: 'none' };
    this.styleB = { display: 'none' };
  }

  conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {
      this.socketService(c);
    });
    this._connection.status.subscribe((change) => {
      console.log(change);
      if (change.name === 'disconnected') {
        this.visible = true;
        this.mensaje = 'Reconectando...';
        console.log('aqui tendria que reconectar');
        this._connection.start().then((c) => {
          this.socketService(c);
        });
      }
      if (change.name === 'reconnecting') {
        this.visible = true;
        this.mensaje = 'Reconectando...';
      }
      if (change.name === 'connected') {
        this.visible = true;
        this.mensaje = 'Conectado';
        setTimeout(() => {
          this.visible = false;
        }, 2500);
      }
    });
  }
  private cargarPeriodos(data: any) {
    const lista = JSON.parse(JSON.stringify(data));
    // tslint:disable-next-line:no-shadowed-variable
    const aux = lista.filter(function (c: any) {
      return c.TipoPeriodo !== 4;
    });
    // tslint:disable-next-line:prefer-const
    let itemA = [];
    itemA.push(this.jugadorA);
    // tslint:disable-next-line:prefer-const
    let itemB = [];
    itemB.push(this.jugadorB);
    // tslint:disable-next-line:prefer-const
    let itemCronometro = [];
    itemCronometro.push('');

    for (let index = 0; index < aux.length; index++) {

      const element = aux[index];
      if (!element.marcadorA) element.marcadorA = 0;
      if (!element.marcadorB) element.marcadorB = 0;

      itemA.push(element.marcadorA > element.marcadorB);
      itemB.push(element.marcadorA < element.marcadorB);
      itemCronometro.push(false);
      itemA.push(element.marcadorA === '' || element.marcadorA === undefined ? 0 : element.marcadorA);
      itemB.push(element.marcadorB === '' || element.marcadorB === undefined ? 0 : element.marcadorB);
      itemCronometro.push(element.tiempo_current === '' || element.tiempo_current === undefined ? '00:00' : element.tiempo_current);
    }
    this.periodos = [];
    this.periodos.push(itemA);
    this.periodos.push(itemB);
    this.periodos.push(itemCronometro);
  }
  socketService(c) {
    const changePeriodo = c.listenFor('HandleActualizarPeriodo');
    changePeriodo.subscribe(data => {
      console.log(data);
      this.set = data['Periodo'];
      if (data['Tiempo'] === '') {
        this.cronometro = '00:00';
      } else {
        this.cronometro = data['Tiempo'].split(':')[1] + ':' + data['Tiempo'].split(':')[2];
      }
    });

    const changeVisor = c.listenFor('HandleChangeVisor');
    const changeCronometro = c.listenFor('HandleCronometro');
    const changeCronometroDescuento = c.listenFor('HandleDescuento');

    changeVisor.subscribe(data => {
      console.log(data);
      this.CompetidorAId = data['personaIdA'];
      this.CompetidorBId = data['personaIdB'];
      this.puntoA = data['pointsA'];
      this.puntoB = data['pointsB'];
      this.mensaje = data['mensaje'] === '' ? '' : data['mensaje'];
      this.jugadorA = data['nameA'];
      this.prueba = String(data['prueba']).includes('SUB') ? 1 : 2;
      this.jugadorB = data['nameB'];
      this.show = data['balon'] === 1 ? true : false;
      this.visible = data['mensaje'] === '' ? false : true;
      this.posesion = data['posesion'];
      this.styleA = this.posesion === 1 ? '' : { display: 'none' };
      this.styleB = this.posesion === 2 ? '' : { display: 'none' };
      this.urlA = '../../../../../assets/erpHammer/squash/' + this.CompetidorAId + '.jpg';
      this.PersonasSelectA = data['PersonasA'];
      this.PersonasSelectB = data['PersonasB'];

      this.PersonasEquipoA = data['PersonasEquipoA'];
      this.PersonasEquipoB = data['PersonasEquipoB'];
      this.DelegacionIdB = data['DelegacionIdB'];
      this.DelegacionIdA = data['DelegacionIdA'];
      if (this.PersonasEquipoA.length > 1) {
        this.urlA1 = '../../../../../assets/erpHammer/squash/' + this.PersonasEquipoA[0].PersonaId + '.jpg';
        this.urlA2 = '../../../../../assets/erpHammer/squash/' + this.PersonasEquipoA[1].PersonaId + '.jpg';
        this.jugadorA1 = this.PersonasEquipoA[0].NombreAbreviado;
        this.jugadorA2 = this.PersonasEquipoA[1].NombreAbreviado;
      }
      this.urlB = '../../../../../assets/erpHammer/squash/' + this.CompetidorBId + '.jpg';
      if (this.PersonasEquipoB.length > 1) {
        this.urlB1 = '../../../../../assets/erpHammer/squash/' + this.PersonasEquipoB[0].PersonaId + '.jpg';
        this.urlB2 = '../../../../../assets/erpHammer/squash/' + this.PersonasEquipoB[1].PersonaId + '.jpg';
        this.jugadorB1 = this.PersonasEquipoB[0].NombreAbreviado;
        this.jugadorB2 = this.PersonasEquipoB[1].NombreAbreviado;
      }

      if (this.PersonasSelectA.length > 0) {
        this.urlA1 = '../../../../../assets/erpHammer/squash/' + String(this.PersonasSelectA[0]).split('|')[0] + '.jpg';
        this.urlA2 = '../../../../../assets/erpHammer/squash/' + String(this.PersonasSelectA[1]).split('|')[0] + '.jpg';
        this.jugadorA1 = String(this.PersonasSelectA[0]).split('|')[1];
        this.jugadorA2 = String(this.PersonasSelectA[1]).split('|')[1];
      }
      if (this.PersonasSelectB.length > 0) {
        this.urlB1 = '../../../../../assets/erpHammer/squash/' + String(this.PersonasSelectB[0]).split('|')[0] + '.jpg';
        this.urlB2 = '../../../../../assets/erpHammer/squash/' + String(this.PersonasSelectB[1]).split('|')[0] + '.jpg';
        this.jugadorB1 = String(this.PersonasSelectB[0]).split('|')[1];
        this.jugadorB2 = String(this.PersonasSelectB[1]).split('|')[1];
      }
      if (this.PersonasSelectA.length === 1 || this.PersonasSelectB.length === 1) {
        this.urlA = '../../../../../assets/erpHammer/squash/' + String(this.PersonasSelectA[0]).split('|')[0] + '.jpg';
        this.urlB = '../../../../../assets/erpHammer/squash/' + String(this.PersonasSelectB[0]).split('|')[0] + '.jpg';
        if(data["prueba"] != 'Dobles' && data["prueba"] != 'Equipos') {
          this.jugadorA = String(this.PersonasSelectA[0]).split('|')[1];
          this.jugadorB = String(this.PersonasSelectB[0]).split('|')[1];
          this.prueba = 1;
        }
      }

      this.periodos = data['periodos'];
      this.cargarPeriodos(this.periodos);
      setTimeout(() => {
        this.visible = false;
      }, 2500);
    });

    changeCronometro.subscribe(data => {
      console.clear();
      // tslint:disable-next-line:no-construct
      this.cronometro = new String(data);

    });
    changeCronometroDescuento.subscribe(data => {
      console.clear();
      // tslint:disable-next-line:no-construct
      this.cronometro_descuento = new String(data);

    });

    c.invoke('controlPantalla', this.o.qs.name, this.o.qs.group);
  }
  getData(periodo: any[]) {
    // tslint:disable-next-line:prefer-const
    let data = [];
    if (periodo.length > 0) {
      for (let index = 1; index < periodo.length; index++) {
        const is_ganador = periodo[index];
        const valor = periodo[index + 1];
        data.push({ is_ganador: is_ganador, valor: valor });
        index++;
      }


    }
    console.log(data);
    return data;
  }
  getColumnas() {
    if (this.periodos.length > 0) {
      const lista = [];
      for (let index = 0; index < this.periodos[0].length / 2; index++) {
        const item = this.periodos[0][index];
        lista.push(index === 0 ? '' : index);
      }
      return lista;
    }
  }

}
