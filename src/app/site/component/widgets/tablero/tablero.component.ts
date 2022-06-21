import { Component, OnInit, Input } from '@angular/core';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { Marcador } from 'app/site/domain/deportes/grupo/Marcador';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Cronometro } from '../../../domain/widgets/cronometro.type';
import { Router, ActivatedRoute } from '@angular/router';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { SelectButtonModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import * as urls from '../../../domain/Shared/global';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.css'],
  providers: [ConjuntoService, DeporteService]
})
export class TableroComponent implements OnInit {
  @Input() style: number;
  @Input() time = 'marcador';
  @Input() hora: string;
  @Input() marcador: Marcador;
  setHora = '00:00';
  setTiempo: string;
  eventoId: number;
  private _connection: SignalRConnection;
  /*nombre deporte*/
  deportes: any[];
  nombreDeporte: string;
  color: any;
  tarjetaAmarillaA: any;
  tarjetaRojaA: any;
  tarjetasA: any;

  tarjetaAmarillaB: any;
  tarjetaRojaB: any;
  tarjetasB: any;

  usuarioSocket: any = JSON.parse(sessionStorage.getItem('resu'));
  styleDia: any;
  styleNoche: any;
  parametrosA: any[];
  parametrosB: any[];
  // configuracion:Cronometro;

  accion = 0;

  playSocket = false;
  pauseSocket = false;
  bloqueoPlay = false;
  bloqueoPause = false;

  banderaEquipoA: string;
  banderaEquipoB: string;

  nombrePeriodo: string;
  periodoId: number;

  noDeporteEsVoleibol = true;
  noDeporteEsBasquet = true;

  equipoA: SelectItem[];
  equipoB: SelectItem[];

  cols: any[];

  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: {
      name: 'usuario:' + this.usuarioSocket.UsuarioId,
      group: 'encuentro' + this.activedRoute.snapshot.params['PlanillaId']
    },
    url: urls.urlSockets
  };

  constructor(
    private conjuntoService: ConjuntoService,
    private activedRoute: ActivatedRoute,
    private deporteService: DeporteService,
    private _signalR: SignalR
  ) {
    /*this.configuracion=new Cronometro();
    this.configuracion.minuto=1;
    this.configuracion.segundo=0;*/

    this.marcador = new Marcador();
    this.styleDia = {
      color: 'black',
      'background-color': 'white',
      border: '3px solid #000000'
    };
    this.styleNoche = {
      color: 'white',
      'background-color': 'black',
      border: '3px solid #fff'
    };
    this.marcador.competidorIdA = this.activedRoute.snapshot.params[
      'idcompetidor1'
    ];
    this.marcador.competidorIdB = this.activedRoute.snapshot.params[
      'idcompetidor2'
    ];
    this.marcador.planillaId = this.activedRoute.snapshot.params['PlanillaId'];
    this.marcador.deporteId = this.activedRoute.snapshot.params['deporteId'];
    this.eventoId = this.activedRoute.snapshot.params['eventoId'];
    this.marcador.control = 0;
    this.marcador.visor = 1;
    this.marcador.EquipoA = this.activedRoute.snapshot.params['equipoA'];
    this.marcador.EquipoB = this.activedRoute.snapshot.params['equipoB'];
    this.marcador.tiempo = 0;
    this.periodoId = 0;
    this.style = 1;

    this.banderaEquipoA = 'assets/banderas/bolivia.png';
    this.banderaEquipoB = 'assets/banderas/bolivia.png';
  }

  ngOnInit() {
    $('body').attr(
      'style',
      'overflow-y:hidden !important; overflow-x:hidden !important; '
    );
    localStorage.clear();
    this.setEstilo();
    this.setdatos();
    this.doGetDeportes();
    this.conectar();

    this.obtenerIdDelegacion(this.marcador.competidorIdA, 1);
    this.obtenerIdDelegacion(this.marcador.competidorIdB, 2);

    if (Number(this.marcador.deporteId) === 3) {
      this.noDeporteEsBasquet = false;
      this.nombrePeriodo = 'Cuarto';
    } else if (Number(this.marcador.deporteId) === 5) {
      this.nombrePeriodo = 'Período';
    } else if (Number(this.marcador.deporteId) === 6) {
      this.noDeporteEsVoleibol = false;
      this.nombrePeriodo = 'Set';
      this.equipoA = [];
      this.equipoB = [];
    } else {
      this.nombrePeriodo = 'Período';
    }
    // this.setHora="40:02";
  }
  recargarDatos() {
    this.setdatos();
    this.doGetDeportes();
    this.obteneResultadosSet();
    this.obtenerIdDelegacion(this.marcador.competidorIdA, 1);
    this.obtenerIdDelegacion(this.marcador.competidorIdB, 2);
  }
  private setEstilo() {
    try {
      if (this.style === 1) {
        this.color = this.styleNoche;
      } else {
        this.color = this.styleDia;
      }
    } catch (error) {
      this.color = this.styleDia;
    }
  }

  /*Nombre deporte */

  doGetDeportes() {
    this.deporteService.getDeportes(this.eventoId).then(res => {
      this.deportes = res;
      const id = this.marcador.deporteId;
      const consulta1 = this.deportes.filter(function(c) {
        return Number(c.DeporteId) === Number(id);
      });
      this.nombreDeporte = consulta1[0].DeporteDescripcion.toUpperCase();
    });
  }

  obtenerIdDelegacion(idCompetidor, indice) {
    this.conjuntoService
      .obtenerIdDelegacion(idCompetidor, this.eventoId)
      .then(res => {
        if (Number(indice) === 1) {
          this.banderaEquipoA =
            '/assets/banderas/' + res[0].DelegacionId + '.png';
        } else if (Number(indice) === 2) {
          this.banderaEquipoB =
            '/assets/banderas/' + res[0].DelegacionId + '.png';
        }
      });
  }

  obteneResultadosSet() {
    this.equipoA = [];
    this.equipoB = [];
    console.log(this.equipoA);
    this.conjuntoService
      .obteneResultadosSet(this.eventoId, this.marcador.planillaId)
      .then(res => {
        if (
          Number(this.marcador.competidorIdA) === Number(res[0]['CompetidorId'])
        ) {
          this.equipoA.push({ label: res[0]['1S'], value: res[0]['1S'] });
          this.equipoA.push({ label: res[0]['2S'], value: res[0]['2S'] });
          this.equipoA.push({ label: res[0]['3S'], value: res[0]['3S'] });

          this.equipoB.push({ label: res[1]['1S'], value: res[1]['1S'] });
          this.equipoB.push({ label: res[1]['2S'], value: res[1]['2S'] });
          this.equipoB.push({ label: res[1]['3S'], value: res[1]['3S'] });
        } else if (
          Number(this.marcador.competidorIdB) === Number(res[0]['CompetidorId'])
        ) {
          this.equipoB.push({ label: res[0]['1S'], value: res[0]['1S'] });
          this.equipoB.push({ label: res[0]['2S'], value: res[0]['2S'] });
          this.equipoB.push({ label: res[0]['3S'], value: res[0]['3S'] });

          this.equipoA.push({ label: res[1]['1S'], value: res[1]['1S'] });
          this.equipoA.push({ label: res[1]['2S'], value: res[1]['2S'] });
          this.equipoA.push({ label: res[1]['3S'], value: res[1]['3S'] });
        }
      });
  }

  /*cronometro */
  pause(estadopause) {
    if (estadopause) {
      this.iniciarPausa();
      this.pauseSocket = true;
    }

    this.accion = 3;
  }
  play(estadoplay) {
    if (estadoplay) {
      this.iniciarPlay();
      this.playSocket = true;
    }
    this.accion = 1;
  }
  private iniciarPlay() {
    this._connection.invoke('playClientes', 'all', 'bloquear', this.o.qs.group);
  }
  private iniciarPausa() {
    this._connection.invoke('playClientes', 'all', 'pausar', this.o.qs.group);
  }

  private setdatos() {
    this.conjuntoService
      .GetSucesoPartido(
        this.marcador.competidorIdA,
        this.marcador.planillaId,
        this.marcador.deporteId,
        this.marcador.control,
        this.marcador.visor,
        this.periodoId
      )
      .then(res => {
        let amarilla;
        let roja;
        let gol;
        console.log(res);
        if (res.length > 0) {
          if (Number(this.marcador.deporteId) === 4) {
            this.parametrosA = res.filter(
              item =>
                item.ParametroSucesoId !== 1 &&
                item.Parametro !== 'Amarilla' &&
                item.Parametro !== 'Roja'
            );
            amarilla = res.filter(
              item => item.Parametro === 'Amarilla' && item.Valor !== 0
            );
            roja = res.filter(
              item => item.Parametro === 'Roja' && item.Valor !== 0
            );
            gol = res.filter(
              item =>
                Number(item.ParametroSucesoId) === 1 &&
                Number(item.DeporteId) === 4
            )[0];
            this.marcador.GolesA = gol.Valor;
          } else if (Number(this.marcador.deporteId) === 5) {
            this.parametrosA = res.filter(
              item =>
                item.ParametroSucesoId !== 19 &&
                item.Parametro !== 'Amarilla' &&
                item.Parametro !== 'Roja'
            );
            amarilla = res.filter(
              item => item.Parametro === 'Amarilla' && item.Valor !== 0
            );
            roja = res.filter(
              item => item.Parametro === 'Roja' && item.Valor !== 0
            );
            gol = res.filter(
              item =>
                Number(item.ParametroSucesoId) === 19 &&
                Number(item.DeporteId) === 5
            )[0];
            this.marcador.GolesA = gol.Valor;
          } else if (Number(this.marcador.deporteId) === 6) {
            this.marcador.GolesA =
              res[0].Valor + res[1].Valor + res[2].Valor + res[3].Valor;
          } else if (Number(this.marcador.deporteId) === 3) {
            this.marcador.GolesA = res[0].Valor + res[1].Valor + res[2].Valor;
            this.parametrosA = res.filter(
              item =>
                item.ParametroSucesoId !== 26 &&
                item.ParametroSucesoId !== 27 &&
                item.ParametroSucesoId !== 28
            );
          }

          if (amarilla[0]) {
            this.tarjetaAmarillaA = Array(amarilla[0].Valor).fill(
              'tarjeta-amarilla'
            );
          }
          if (roja[0]) {
            this.tarjetaRojaA = Array(roja[0].Valor).fill('tarjeta-roja');
          }

          this.tarjetasA = this.tarjetaAmarillaA.concat(this.tarjetaRojaA);
        }
      });
    this.conjuntoService
      .GetSucesoPartido(
        this.marcador.competidorIdB,
        this.marcador.planillaId,
        this.marcador.deporteId,
        this.marcador.control,
        this.marcador.visor,
        this.periodoId
      )
      .then(res => {
        let amarilla;
        let roja;
        let gol;
        if (res.length > 0) {
          console.log(res);
          if (Number(this.marcador.deporteId) === 4) {
            this.parametrosB = res.filter(
              item =>
                item.ParametroSucesoId !== 1 &&
                item.Parametro !== 'Amarilla' &&
                item.Parametro !== 'Roja'
            );
            amarilla = res.filter(
              item => item.Parametro === 'Amarilla' && item.Valor !== 0
            );
            roja = res.filter(
              item => item.Parametro === 'Roja' && item.Valor !== 0
            );
            gol = res.filter(
              item =>
                Number(item.ParametroSucesoId) === 1 &&
                Number(item.DeporteId) === 4
            )[0];
            this.marcador.GolesB = gol.Valor;
          } else if (Number(this.marcador.deporteId) === 5) {
            this.parametrosB = res.filter(
              item =>
                item.ParametroSucesoId !== 19 &&
                item.Parametro !== 'Amarilla' &&
                item.Parametro !== 'Roja'
            );
            amarilla = res.filter(
              item => item.Parametro === 'Amarilla' && item.Valor !== 0
            );
            roja = res.filter(
              item => item.Parametro === 'Roja' && item.Valor !== 0
            );
            gol = res.filter(
              item =>
                Number(item.ParametroSucesoId) === 19 &&
                Number(item.DeporteId) === 5
            )[0];
            this.marcador.GolesB = gol.Valor;
          } else if (Number(this.marcador.deporteId) === 6) {
            this.marcador.GolesB =
              res[0].Valor + res[1].Valor + res[2].Valor + res[3].Valor;
          } else if (Number(this.marcador.deporteId) === 3) {
            this.marcador.GolesB = res[0].Valor + res[1].Valor + res[2].Valor;
            this.parametrosB = res.filter(
              item =>
                item.ParametroSucesoId !== 26 &&
                item.ParametroSucesoId !== 27 &&
                item.ParametroSucesoId !== 28
            );
          }

          if (amarilla[0]) {
            this.tarjetaAmarillaB = Array(amarilla[0].Valor).fill(
              'tarjeta-amarilla'
            );
          }
          if (roja[0]) {
            this.tarjetaRojaB = Array(roja[0].Valor).fill('tarjeta-roja');
          }
          this.tarjetasB = this.tarjetaAmarillaB.concat(this.tarjetaRojaB);
        }
      });
  }

  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {
      const listener = c.listenFor('devuelveVisor');
      listener.subscribe(data => {
        this.marcador.tiempo = data['periodo'];
        this.periodoId = data['periodoId'];
        this.recargarDatos();
      });

      const listenerMensaje = c.listenFor('DevolverGrupos');
      listenerMensaje.subscribe(data => {
        if (data === 'bloquear' && !this.playSocket) {
          this.play(false);
          this.bloqueoPlay = true;
          this.bloqueoPause = true;
          this.playSocket = true;
          this.pauseSocket = false;
        } else if (data === 'pausar' && !this.pauseSocket) {
          this.pause(false);
          this.bloqueoPlay = true;
          this.bloqueoPause = true;
          this.pauseSocket = true;
          this.playSocket = false;
        }
      });
    });
  }
}
