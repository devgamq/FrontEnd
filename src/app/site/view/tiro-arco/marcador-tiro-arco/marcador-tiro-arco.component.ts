import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  Event as NavigationEvent
} from '@angular/router';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Delegacion } from '../../../domain/Acreditacion/delegacion';
import { Message } from 'primeng/primeng';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { TiroArcoService } from '../../../service/simple/tiro_arco';
import * as urls from '../../../domain/Shared/global';

@Component({
  selector: 'app-marcador-tiro-arco',
  templateUrl: './marcador-tiro-arco.component.html',
  styleUrls: ['./marcador-tiro-arco.component.css'],
  providers: [ConjuntoService, TiroArcoService]
})
export class MarcadorTiroArcoComponent implements OnInit {
  private _connection: SignalRConnection;
  eventoId: number;
  deporteId: number;
  logoA: any;
  logoB: any;
  encuentro: any;
  delegacionA: Delegacion;
  delegacionB: Delegacion;
  cronogramaId = 0;
  CompetidorAId = 0;
  CompetidorBId = 0;
  planillaId = 0;
  periodoId = 0;
  personaIdA = 0;
  personaIdB = 0;
  puntoA = 0;
  puntoB = 0;
  PuntoId = 0;
  Prueba = 0;
  mensaje: Message[] = [];
  candado_set = false;
  show = false;
  periodo: any;
  o: IConnectionOptions = {
    hubName: 'MarcadorTiroArcoHub',
    qs: { name: 'control', group: 'tiroArco' },
    url: urls.urlSockets
  };

  constructor(
    private route: ActivatedRoute,
    private conjuntoService: ConjuntoService,
    private tiroArcoService: TiroArcoService,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private _signalR: SignalR
  ) {
    this.delegacionA = new Delegacion();
    this.delegacionB = new Delegacion();
  }

  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {
      const listener = c.listenFor('controlPantalla');
      listener.subscribe();
      c.invoke('controlPantalla', this.o.qs.name, this.o.qs.group).then(() => {
        this.CheckPeriodos(1, 0);
      });
    });
  }

  ngOnInit() {
    this.eventoId = this.route.snapshot.params['eventoId'];
    this.deporteId = this.route.snapshot.params['deporteId'];
    this.encuentro = JSON.parse(localStorage.getItem('encuentro'));
    this.cronogramaId = this.encuentro.CronogramaId;
    this.CompetidorAId = this.encuentro.CompetidorAId;
    this.CompetidorBId = this.encuentro.CompetidorBId;
    this.planillaId = this.encuentro.Planilla;
    this.Prueba = this.encuentro.Prueba;

    this.conectar();
  }
  regresar() {
    this.router.navigate([
      'master/cronograma_ta/' + this.eventoId + '/' + this.deporteId
    ]);
  }
  private getDelegacion(idA, idB) {
    this.conjuntoService.obtenerIdDelegacion(idA, this.eventoId).then(res => {
      this.delegacionA = res[0];
      this.logoA =
        res.length > 0
          ? '/assets/banderas/' + this.delegacionA.DelegacionId + '.png'
          : '/assets/banderas/usr.png';

      this.conjuntoService.obtenerIdDelegacion(idB, this.eventoId).then(j => {
        this.delegacionB = j[0];
        this.logoB =
          j.length > 0
            ? '/assets/banderas/' + this.delegacionB.DelegacionId + '.png'
            : '/assets/banderas/usr.png';
        this.show = true;
      });
    });
  }

  private CheckPeriodos(sw: number, valor: number) {
    const periodo = { sw: sw, valor: valor, PlanillaId: this.planillaId };

    this.tiroArcoService.CheckPeriodos(periodo).subscribe(res => {
      this.periodo = res.json()[0];
      this.getDelegacion(
        this.encuentro.CompetidorAId,
        this.encuentro.CompetidorBId
      );
    });
  }
  getPeriodoId($event) {
    const periodo = $event;
    this.periodoId = periodo.PeriodoId;

    if (Number(periodo.Correlativo) > 1 || this.candado_set) {
      this.periodo = $event;
      this.sendPeriodo();
      this.candado_set = true;
    }
  }
  sendPeriodo() {
    const data = {
      periodo: this.periodo,
      delegacionA: this.delegacionA,
      delegacionB: this.delegacionB,
      encuentro: this.encuentro,
      Prueba: this.Prueba
    };
    this._connection.invoke('PeriodoEvent', data);
  }
  getPersonaIdA($event) {
    const persona = $event.PersonaId;
    this.personaIdA = persona;
  }
  getPersonaIdB($event) {
    const persona = $event.PersonaId;
    this.personaIdB = persona;
  }
  getMensaje($event) {
    this.mensaje = [];
    this.mensaje.push({
      severity: $event.tipoMensaje,
      summary: 'Mensaje',
      detail: $event.mensaje
    });
  }
  getpuntoA($event) {
    this.puntoA = $event;
    this.PuntoId = this.PuntoId === 1 ? 0 : 1;
    this.sendPeriodo();
  }
  getpuntoB($event) {
    this.puntoB = $event;
    this.PuntoId = this.PuntoId === 1 ? 0 : 1;
    this.sendPeriodo();
  }
  doOpenVisor() {
    window.open(`#/tiro_arco/ta1`);
  }
  closedPeriodo($event) {
    this.PuntoId = this.PuntoId === 1 ? 0 : 1;
    this.sendPeriodo();
  }
}
