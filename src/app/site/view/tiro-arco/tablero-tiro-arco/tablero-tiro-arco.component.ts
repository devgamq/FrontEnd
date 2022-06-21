import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  state
} from '@angular/animations';
import { Delegacion } from '../../../domain/Acreditacion/delegacion';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  Event as NavigationEvent
} from '@angular/router';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';
import { TiroArcoService } from '../../../service/simple/tiro_arco';
import { Persona } from '../../../domain/shared/persona';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-tablero-tiro-arco',
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
        animate(
          '0.2s 0.1s ease-out',
          style({
            opacity: 0,
            transform: 'translateX(100%)'
          })
        )
      ])
    ])
  ],
  templateUrl: './tablero-tiro-arco.component.html',
  styleUrls: ['./tablero-tiro-arco.component.css'],
  providers: [ConjuntoService, TiroArcoService],
  encapsulation: ViewEncapsulation.None
})
export class TableroTiroArcoComponent implements OnInit {
  nombreTotalGeneral: string;
  nombre: string;
  nombreTotal: string;
  delegacionA: Delegacion;
  delegacionB: Delegacion;
  eventoId: number;
  logoA: any;
  logoB: any;
  correlativo = '1';
  pantallaId: any;
  visible: boolean;
  mensaje = 'conectando';
  PlanillaId = 0;
  PeriodoId = 0;
  cols: any[];
  lista: any[];
  listaA: Persona[];
  listaB: Persona[];
  cronogramaId = 0;
  CompetidorIdA = 0;
  CompetidorIdB = 0;
  uig = '';
  uigB = '';
  anchoB = '';
  paisA = '';
  paisB = '';
  DelegacionIdA = '';
  DelegacionIdB = '';
  private _connection: SignalRConnection;

  o: IConnectionOptions = {
    hubName: 'MarcadorTiroArcoHub',
    qs: {
      name: 'usuario',
      group: 'tiroArco'
    },
    url: urls.urlSockets
  };

  constructor(
    private tiroArcoService: TiroArcoService,
    private route: ActivatedRoute,
    private conjuntoService: ConjuntoService,
    private activedRoute: ActivatedRoute,
    private _signalR: SignalR,
    private router: Router
  ) {
    this.pantallaId = this.activedRoute.snapshot.params['pantallaId'];
    this.o.qs.name = this.pantallaId;
    this.visible = false;
    this.delegacionA = new Delegacion();
    this.delegacionB = new Delegacion();
    this.lista = [];
    this.cols = [];
    this.conectar();
  }

  ngOnInit() {
    $('body').attr(
      'style',
      'overflow-y:hidden !important; overflow-x:hidden !important; '
    );
  }
  conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {
      this.socketService(c);
    });
    this._connection.status.subscribe(change => {
      if (change.name === 'disconnected') {
        this.visible = true;
        this.mensaje = 'Reconectando...';
        this._connection.start().then(c => {
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
  socketService(c) {
    const changePeriodo = c.listenFor('HandleActualizarPeriodo');
    changePeriodo.subscribe(data => {
      console.clear();
      console.log(data);
      this.correlativo = data.periodo.Correlativo;
      this.PlanillaId = data.periodo.PlanillaId;
      this.PeriodoId = data.periodo.PeriodoId;
      this.cronogramaId = data.encuentro.CronogramaId;
      this.CompetidorIdA = data.encuentro.CompetidorAId;
      this.CompetidorIdB = data.encuentro.CompetidorBId;
      this.paisA = data.delegacionA.Nombre;
      this.paisB = data.delegacionB.Nombre;
      this.DelegacionIdA = data.delegacionA.DelegacionId;
      this.DelegacionIdB = data.delegacionB.DelegacionId;
      this.initDatosPuntaje();

      this.logoA = '/assets/banderas/' + data.delegacionA.DelegacionId + '.png';
      this.logoB = '/assets/banderas/' + data.delegacionB.DelegacionId + '.png';

      this.nombreTotal = data.Prueba.includes('ecurvo') ? 'Sum.' : 'S.Total';
      this.nombreTotalGeneral = data.Prueba.includes('ecurvo')
        ? 'P.Set'
        : 'Total';
      this.nombre = data.Prueba.includes('ecurvo') ? 'Set' : 'Ronda';

      this.getPersonal(this.cronogramaId, this.CompetidorIdA, 1);
      this.getPersonal(this.cronogramaId, this.CompetidorIdB, 2);
    });
  }
  private getPersonal(
    cronogramaId: number,
    CompetidorIdA: number,
    indice: number
  ) {
    this.tiroArcoService.GetPersonal(cronogramaId, CompetidorIdA).then(res => {
      if (indice === 1) {
        this.listaA = res;
        switch (Number(this.listaA.length)) {
          case 1:
            this.uig = 'ui-g-12';
            this.anchoB = 'ancho1';
            break;
          case 2:
            this.uig = 'ui-g-6';
            this.anchoB = 'ancho2';
            break;
          case 3:
            this.uig = 'ui-g-4';
            this.anchoB = 'ancho3';
            break;
        }
      } else {
        this.listaB = res;
        switch (Number(this.listaB.length)) {
          case 1:
            this.uigB = 'ui-g-12';
            this.anchoB = 'ancho1';
            break;
          case 2:
            this.uigB = 'ui-g-6';
            this.anchoB = 'ancho2';
            break;
          case 3:
            this.uigB = 'ui-g-4';
            this.anchoB = 'ancho3';
            break;
        }
      }
    });
  }

  private initDatosPuntaje() {
    this.cols = [];
    this.tiroArcoService
      .GetPuntosSet(this.PlanillaId, this.PeriodoId)
      .then(res => {
        // tslint:disable-next-line:forin
        for (const key in res['0']) {
          if (!isNaN(Number(key))) {
            this.cols.push({ field: key, header: '' });
          }
        }
        // tslint:disable-next-line:forin
        for (const i in res) {
          // tslint:disable-next-line:forin
          for (const j in res[i]) {
            const valor = res[i][j];
            if (!isNaN(valor) && Number(valor) < 0) {
              const num = Number(valor) * -1;
              res[i][j] = num + '*';
            }
          }
        }

        this.lista = res;
      });
  }
}
