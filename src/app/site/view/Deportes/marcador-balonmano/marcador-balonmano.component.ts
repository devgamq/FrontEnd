import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/primeng';
import { DialogoConjuntoComponent } from '../../../component/dialogo/dialogo-conjunto/dialogo-conjunto.component';
import { BotonConjuntoComponent } from '../../../component/boton/boton-conjunto/boton-conjunto.component';
import { Marcador } from '../../../domain/Conjunto/Marcador';
import { Parametro } from '../../../domain/Conjunto/parametros';
import { SucesoPersona } from '../../../domain/Conjunto/SucesoPersona';
import { DataGridModule } from 'primeng/primeng';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import {
  Message,
  ConfirmDialogModule,
  ConfirmationService
} from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { CronometroComponent } from '../../../component/widgets/cronometro/cronometro.component';
import { Cronometro } from '../../../domain/widgets/cronometro.type';
import { Router, ActivatedRoute } from '@angular/router';
import { CambioJugadorComponent } from '../../Futbol/cambio-jugador/cambio-jugador.component';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { SimpleService } from '../../../service/simple/simple.service';
import { SpinnerModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';
import { MenuModule, MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-marcador-balonmano',
  templateUrl: './marcador-balonmano.component.html',
  styleUrls: ['./marcador-balonmano.component.css'],
  providers: [ConfirmationService, ConjuntoService, DeporteService, SimpleService],
  encapsulation: ViewEncapsulation.None
})
export class MarcadorBalonmanoComponent implements OnInit {

  mostrarDialogo: boolean;
  inicio = 0;
  mostrarDialogoCambioA: boolean;
  mostrarDialogoCambioB: boolean;
  tipo = 0;
  mostrarDialogoAdicion: boolean;
  mostrarDialogoDatosEventoA: boolean;
  mostrarDialogoDatosEventoB: boolean;

  marcadorDatos: Marcador = new Marcador();
  parametroDatos: Parametro = new Parametro();
  sucesoPersona: SucesoPersona;
  sucesoPersonas: any[];
  cabecera: string;
  mensaje: Message[] = [];
  TiempoCapturado: string;
  /*Equipos*/
  datos: Parametro[];
  datosB: Parametro[];
  e1 = ' ';
  equipoA: string;
  equipoB: string;
  CompetidorIdA: number;
  CompetidorIdB: number;
  DeportePeriodoId: number;
  /*pocesion del balon */
  posesionSeleccionado: number;
  min_pos = 0;
  seg_pos = 0;
  band_pos = false;
  Idequipo: any;
  posesion_arreglo: any;
  posesion_iconoA = '';
  posesion_iconoB = '';
  /*periodo del partido */
  periodo: SelectItem[];
  periodoSeleccionado: number;
  periodos: any[];
  consulta: any;
  cronometro;
  eventoId: number;
  deporteId: number;
  DeportePeriodoIdAnt: number;
  DeportePeriodoIdSuceso = 0;
  tiempoPeriodo = '00:00:00';
  ParametroSucesoId: number;
  /*para el autocomplete */
  competidorId: number;
  planillaId: number;
  estado = 0;
  tiempo = '00:00'
  cronograma:number;
  delegacionA:number;
  delegacionB:number;

  /*cronometro */
  capturar: boolean;
  setTiempo: string;
  configuracion: Cronometro;
  pausa: boolean;
  iniciar: boolean;
  parar: boolean;
  color: number;
  mostrar_pausa = false;
  mostrar_play = true;
  conCronometro: boolean;
  accion = 0;
  captura: boolean;
  iniciado: boolean;
  /* parametros de inicio*/
  iniciaId: number;
  posIniciaId: number;
  guarda_posecion_number: number;
  guarda_posecion: boolean;
  mostrarDialogoConj = 0;
  mostrar: Boolean;
  mostrarvalor: number;


  /*CAMBIO DE JUGADOR */
  cambioJugador = 0;
  /*nombre deporte*/
  deportes: any[];
  nombreDeporte: string;
  /*tiempo de adicion */
  tiempoAdicion = 0;
  /*color de los botones*/
  estiloBotonPosesionA = 'boton_posesion';
  estiloBotonPosesionB = 'boton_posesion';

  estiloPosesionA = false;
  estiloPosesionB = false;
  /*verificar si esta esta en linea*/
  enlinea = false;
  /*logo de equipo*/
  logoA = '/assets/erpHammer/images/logoB.png';
  logoB = '/assets/erpHammer/images/logoB.png';

  /**/
  mensajeSocket: string;

  /*tiempo capturado*/
  dobleTiempo: string;

  /*Bloquear play*/
  bloqueoPlay = false;
  bloqueoPause = false;
  bloqueoAdicion = false;
  bloqueoPosesion = false;

  /*penales */
  mostrarPenales = false;

  /*sockets */
  private _connection: SignalRConnection;
  private _mensaje: SignalRConnection;

  playSocket = false;
  pauseSocket = false;
  adicionSocket = false;
  posesionSocket = false;
  cambiarCronometro = false;
  /*visor*/
  abreviaturaTiempo: string;
  listaOpciones: MenuItem[];
  /*total puntos*/
  totalPuntosA = 0;
  totalPuntosB = 0;
  mostrarTotalPuntos = false;

  cronometro_campo = 3;
  alineacioncronometro = 'right';

  periodoDeporte: string;

  tipoCalificacion = '';

  mostrarOpcionSuceso: boolean;
  mostrarOpcionSucesoB: boolean;
  periodoMarcador: string;
  dataJugadoresA;
  dataJugadoresB;
  EquipoA: any[];
  EquipoB: any[];
  NombreC: String;
  NumeroC: Number;

  bandA:any;
  bandB:any;
  jugaA:any;
  jugaB:any;

  /*Bloquear boton suceso*/
  botonSucesoBloqueo = false;

  usuarioSocket: any = JSON.parse(sessionStorage.getItem('resu'));
  o: IConnectionOptions = {


    hubName: 'HammerBalonmanoHub',
    qs: {
      name: 'usuario:' + this.usuarioSocket.UsuarioId,
      group: 'encuentro' + this.activedRoute.snapshot.params['PlanillaId']
    },
    url: urls.urlSockets
  };

  constructor(
    private confirmationService: ConfirmationService,
    private conjuntoService: ConjuntoService,
    private deporteService: DeporteService,
    private simpleSerivce: SimpleService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private _signalR: SignalR
  ) {
    /*cronometro*/
    this.pausa = false;
    this.iniciar = false;
    this.parar = false;
    this.tipoCalificacion = 'PUNTOS';
    this.iniciado = false;

    this.configuracion = new Cronometro();

    this.configuracion.hora = 0;
    this.configuracion.minuto = 0;
    this.configuracion.segundo = 0;

    this.configuracion.horaTope = 0;
    this.configuracion.minutoTope = 0;
    this.configuracion.segundoTope = 0;
    this.color = 0;
    this.accion = 0;

    /*de afuera */
    this.planillaId = this.activedRoute.snapshot.params['PlanillaId'];
    this.eventoId = this.activedRoute.snapshot.params['eventoId'];
    this.deporteId = this.activedRoute.snapshot.params['deporteId'];
    this.CompetidorIdA = this.activedRoute.snapshot.params['idcompetidor1'];
    this.CompetidorIdB = this.activedRoute.snapshot.params['idcompetidor2'];
    this.tipo = this.activedRoute.snapshot.params['tipo'];
  }
  ngOnInit() {

    this.datosDeporte(Number(this.deporteId));

    const equipo: any = JSON.parse(localStorage.getItem('encuentro'));


    
    this.equipoA = equipo.data.EquipoA;
    this.equipoB = equipo.data.EquipoB;

 
     this.simpleSerivce.getListaGanadores(equipo.data.CronogramaId).then(res => {
     // this.simpleSerivce.getListaGanadores(equipo.CronogramaId).then(res => {
           // this.simpleSerivce.getListaGanadores(equipo.CronogramaId).then(res => {
      this.dataJugadoresA = res[0];
      this.dataJugadoresB = res[1];
    });

    this.cargarBotonesEquipo(
      this.CompetidorIdA,
      this.planillaId,
      1,
      this.DeportePeriodoIdSuceso
    );
    this.cargarBotonesEquipo(
      this.CompetidorIdB,
      this.planillaId,
      2,
      this.DeportePeriodoIdSuceso
    );
    this.cargarBotonesPeriodo();

    this.obtenerIdDelegacion(this.CompetidorIdA, 1);
    this.obtenerIdDelegacion(this.CompetidorIdB, 2);

    this.doGetDeportes();
    this.conectar();
    this.initPosecion();
    this.initTiempoExtra();
  }

  showNombre(event) {
    this.NombreC = event;
  }



  /*Inicializar Datos deportes*/
  // this.guarda_posecion = false;
  datosDeporte(deporteId: number) {
    // this.getPuntosPlanilla();
    switch (deporteId) {
      case 3: {

        this.mostrarTotalPuntos = true;
        this.alineacioncronometro = 'center';
        this.periodoDeporte = 'Cuarto';

        break;
      }
      case 4: {

        this.mostrarTotalPuntos = false;
        this.alineacioncronometro = 'right';
        this.periodoDeporte = 'Período';
        break;
      }
      case 5: {

        this.mostrarTotalPuntos = false;
        this.alineacioncronometro = 'center';
        this.periodoDeporte = 'Período';
        break;
      }
      case 6: {

        this.mostrarTotalPuntos = true;
        this.alineacioncronometro = 'center';
        this.periodoDeporte = 'Set';

        break;
      }
      case 15: {

        this.mostrarTotalPuntos = false;
        this.alineacioncronometro = 'center';
        this.periodoDeporte = 'Periodo';
        break;
      }
      default: {
        console.log('Error deporte Id');
        break;
      }
    }
  }


  obtenerIdDelegacion(idCompetidor, indice) {


    
    this.conjuntoService
      .obtenerIdDelegacion(idCompetidor, this.eventoId)
      .then(res => {
        if (Number(indice) === 1) {
          this.delegacionA = res[0].DelegacionId;
          this.logoA = res.length > 0 ? '/assets/banderas/' + res[0].DelegacionId + '.png' : '/assets/banderas/usr.png';
        } else if (Number(indice) === 2) {
          this.delegacionB = res[0].DelegacionId;
          this.logoB = res.length > 0 ? '/assets/banderas/' + res[0].DelegacionId + '.png' : '/assets/banderas/usr.png';
        }
      });
  }
  private getPuntosPlanilla() {
    this.conjuntoService
      .GetPuntosPlanilla(this.planillaId, this.DeportePeriodoId)
      .then(res => {
        if (res.length > 0) {
          if (Number(res[0].CompetidorId) === Number(this.CompetidorIdA)) {
            this.totalPuntosA = res[0].Valor;
            this.totalPuntosB = res.length > 1 ? res[1].Valor : 0;
          } else if (Number(res[0].CompetidorId) === Number(this.CompetidorIdB)) {
            this.totalPuntosA = res.length > 1 ? res[1].Valor : 0;
            this.totalPuntosB = res[0].Valor;
          } else {
            this.totalPuntosA = 0;
            this.totalPuntosB = 0;
          }
        } else {
          this.totalPuntosA = 0;
          this.totalPuntosB = 0;
        }
        // this.actualizarVisor();
      });
  }



  public regresar() {
    this.router.navigate([
      'master/cronograma/' + this.eventoId + '/' + this.deporteId + '/' + this.tipo
    ]);

  }

  /*Nombre deporte */
  doGetDeportes() {
    this.deporteService.getDeportes(this.eventoId).then(res => {
      this.deportes = res;
      const id = this.deporteId;
      const consulta1 = this.deportes.filter(function (c) {
        return c.DeporteId + '' === id + '';
      });
      this.nombreDeporte = consulta1[0].DeporteDescripcion;
    });
  }

  SeleccionarPeriodo() {

    this.DeportePeriodoIdAnt = this.DeportePeriodoId;
    this.DeportePeriodoId = this.periodoSeleccionado;
    this.capturarTiempo(0, 0);
    this.confirmationService.confirm({
      message: 'Desea Cambiar de Periodo?',
      header: 'Confirmacion Cambio',
      accept: () => {
        this.accion = 7;
        this.mostrarDialogoConj = 1;
        const periodoBuscar = this.DeportePeriodoId;
        const consulta1 = this.periodos.filter(function (c) {
          return c.DeportePeriodoId === periodoBuscar;
          
        });
        this.tiempoPeriodo = this.TiempoCapturado;
        this.mostrar_play = true;
        this.mostrar_pausa = false;

        this.getParametroFinalPeriodo();
        this.guardarPeriodoSeleccionado();
        this.abreviaturaTiempo = consulta1[0].Abreviatura;

        this.DeportePeriodoIdSuceso = this.periodoSeleccionado;
        this.cargarBotonesEquipo(
          this.CompetidorIdA,
          this.planillaId,
          1,
          this.DeportePeriodoIdSuceso
        );
        this.cargarBotonesEquipo(
          this.CompetidorIdB,
          this.planillaId,
          2,
          this.DeportePeriodoIdSuceso
        );
        this.periodoMarcador = consulta1[0].Periodo;
        this.getPuntosPlanilla();
        this.actualizarPeriodo();

    
      },
      reject: () => {
        this.periodoSeleccionado = this.DeportePeriodoIdAnt;
        this.DeportePeriodoId = this.periodoSeleccionado;
      }
    });
  }

  guardarPeriodoSeleccionado() {
    this.botonSucesoBloqueo = false;
    const tiempo = this.tiempoPeriodo.split(':');
    const periodoCambio = {
      DeportePeriodoId: this.periodoSeleccionado,
      Tiempo: parseInt(tiempo[1], 10) + '.' + parseInt(tiempo[2], 10),
      Competidor: null,
      PlanillaId: this.planillaId,
      ParametroSucesoId: this.ParametroSucesoId,
      Eliminado: 0,
      Valor: 1
    };
    if (this.tiempoPeriodo !== '00:00:00') {
      this.conjuntoService
        .guardarSucesoParametro(periodoCambio)
        .subscribe(res => {
          const resp = res.json();
          this.tiempoAdicion = 0;
        });
    }
  }
  SeleccionarPeriodoCalculado() {
    if (this.TiempoCapturado === '00:00:00') {
      this.botonSucesoBloqueo = false;
      // this.periodoSeleccionado = this.periodos[0].DeportePeriodoId;
      this.DeportePeriodoId = this.periodoSeleccionado;
      const periodoBuscar = this.DeportePeriodoId;
      const consulta1 = this.periodos.filter(function (c) {
        return c.DeportePeriodoId === periodoBuscar;
      });
      this.abreviaturaTiempo = consulta1[0].Abreviatura;
      // this.actualizarVisor();
    }
  }
  cargarBotonesPeriodo() {
    this.periodo = [];
    this.conjuntoService
      .getPeriodoPartido(this.eventoId, this.deporteId)
      .then(res => {
        this.periodos = res;
        res.forEach(item => {
          this.periodo.push({
            label: item.Abreviatura,
            value: item.DeportePeriodoId
          });
        });
      });
  }
  cargarBotonesEquipo(
    compedirId: number,
    planillaId: number,
    lugar: number,
    deportePeriodoId: number
  ) {

    this.conjuntoService
      .getParametrosConjunto(
      compedirId,
      planillaId,
      this.deporteId,
      deportePeriodoId
      )
      .then(res => {
        if (Number(lugar) === 1) {
          this.datos = res;
        } else if (Number(lugar) === 2) {
          this.datosB = res;
        }
      });
  }
  mostrarDialogoMarcador() {
    this.mostrarDialogo = true;
  }
  onclickGuardarMarcador($event) {



    const tiempo = $event.TiempoCapturado.split(':');
    $event.Tiempo = tiempo[0] + '.' + tiempo[1];
    this.mensaje = [];
    if ($event.RegistraPersona && $event.SucesoPersona.PlanillaPersonaId > 0) {
      this.guardarSucesoParametro($event);
      this.mostrarDialogo = false;
    } else if (
      !$event.RegistraPersona &&
      Number($event.SucesoPersona.PlanillaPersonaId) === 0
    ) {
      this.guardarSucesoParametro($event);
      this.mostrarDialogo = false;
    } else {
      this.mensaje.push({
        severity: 'danger',
        summary: 'Error',
        detail: 'Introduzca un jugador'
      });
    }
    this.parametroDatos.Valor = $event.marcador;
  }

  guardarSucesoParametro(event: any) {

    this.mensaje = [];
    if (event.DeportePeriodoId) {
      this.conjuntoService.guardarSucesoParametro(event).subscribe(res => {
        const resp = res.json();
        if (resp) {
          this.botonSucesoBloqueo = false;
          this.mensaje.push({
            severity: 'success',
            summary: 'Exito',
            detail: 'Se agrego correctamente el registro'
          });

          if (this.sucesoPersona.Orden === 9) {


              // this.actualizarVisor();
              this.actualizarVisor();
         
          }

          this.cargarBotonesEquipo(
            event.CompetidorId,
            event.PlanillaId,
            event.posicion_grid,
            this.DeportePeriodoIdSuceso
          );
           this.seleccionarParametro(
             event.CompetidorId,
             event.PlanillaId,
             event.posicion_grid
           );
          this.getPuntosPlanilla();
        } else {
          this.mensaje.push({
            severity: 'danger',
            summary: 'Error',
            detail: 'Error al guardar el registro'
          });
        }
      });
    } else {
      this.mensaje.push({
        severity: 'danger',
        summary: 'Error',
        detail: 'Error al guardar el registro'
      });
    }
  }

  mostrarMarcador($event, pos, equipo) {



    this.sucesoPersonas = [];
    this.marcadorDatos = new Marcador();

    this.marcadorDatos.DeportePeriodoId = this.DeportePeriodoId;
    this.marcadorDatos.CompetidorId = $event.CompetidorId;
    this.marcadorDatos.PlanillaId = $event.PlanillaId;
    this.marcadorDatos.ParametroSucesoId = $event.ParametroSucesoId;

    this.sucesoPersona = new SucesoPersona();
    this.sucesoPersona.PlanillaPersonaId = 0;

    this.sucesoPersona.Orden = $event.Orden;

    this.sucesoPersonas.push(this.sucesoPersona);

    this.marcadorDatos.SucesoPersona = this.sucesoPersona;
    this.marcadorDatos.SucesoPersonas = this.sucesoPersonas;
    this.marcadorDatos.posicion_grid = pos;

    this.marcadorDatos.NombreParametro = $event.Parametro;
    this.marcadorDatos.NombreEquipo = equipo;
    this.marcadorDatos.marcador = $event.Valor;
    this.marcadorDatos.RegistraPersona = $event.RegistraPersona;
    this.marcadorDatos.Valor = $event.ValorSuceso;
    this.cabecera =
      $event.Parametro +
      '[' +
      this.marcadorDatos.NombreEquipo +
      ']: ' +
      (Number(this.marcadorDatos.marcador) + 1);

    this.competidorId = $event.CompetidorId;
    this.planillaId = $event.PlanillaId;
    if (Number(pos) === 1) {
      this.mostrarOpcionSuceso = true;
      this.mostrarOpcionSucesoB = false;
    } else {
      this.mostrarOpcionSucesoB = true;
      this.mostrarOpcionSuceso = false;
    }


  }
  /*cronometro */
  pause(estadopause) {
    if (estadopause) {
      this.iniciarPausa();
      this.pauseSocket = true;
      this.iniciado =  false;

    }
    this.accion = 3;
    if (this.iniciar) {
      this.pausa = true;
 
      this.iniciar = false;

    }
    this.parar = false;
    this.mostrar_pausa = false;
    this.mostrar_play = true;

    this.band_pos = false;
    const noguardar = 0;
    this.detenerPosesion(noguardar);
    this.iniciaEquipo(0);
    this.enlinea = false;
    
    this.actualizarAccion();

  }
  play(estadoplay) {


    if (this.control_Periodo()) {
      if (estadoplay) {
        this.iniciarPlay();
        this.playSocket = true;
      }
      this.accion = 1;
      this.iniciar = true;
      this.pausa = false;
      this.parar = false;

      this.mostrar_pausa = true;
      this.mostrar_play = false;
      //this.calcularPosesion(this.iniciaId, this.posIniciaId, false, 0);

      this.capturarTiempo(0, 0);

      this.guardarHoraInicio();
      this.enlinea = true;
    }
    this.actualizarAccion();



  }
  stop() {
    this.accion = 2;
    this.parar = true;
    this.iniciar = false;
    this.pausa = false;
    this.actualizarAccion();
  }
  IngresoTempo($event) {
    this.accion = 0;
    this.setTiempo = '';
  }
  /*Guarda la hora de inicio*/
  guardarHoraInicio() {
    this.mensaje = [];
    this.conjuntoService.updateHoraInicio(this.planillaId).subscribe(res => {
      const resp = res.json();
      if (resp) {
        this.mensaje.push({
          severity: 'success',
          summary: 'Exito',
          detail: 'Se a iniciado el Encuentro'
        });
      } else {
        this.mensaje.push({
          severity: 'danger',
          summary: 'Error',
          detail: 'Error al iniciar el Encuentro'
        });
      }
    });
  }
  private control_Periodo() {
    this.DeportePeriodoIdAnt = this.DeportePeriodoId;
    this.DeportePeriodoId = this.periodoSeleccionado;
    if (!this.DeportePeriodoId) {
      this.mensaje = [];
      this.mensaje.push({
        severity: 'danger',
        summary: 'Error',
        detail: 'Debe Seleccionar un Periodo'
      });
      return false;
    }
    return true;
  }



  /*Guarda la hora de inicio*/
  guardarFinEncuentro() {
    if (this.control_Periodo()) {
      this.mensaje = [];
      this.confirmationService.confirm({
        message: 'Desea Terminar El Partido',
        header: 'Terminar Partido',
        accept: () => {
          this.conjuntoService.updateHoraFin(this.planillaId).subscribe(res => {
            const resp = res.json();
            if (resp) {
              this.pause(true);
              this.guardarPeriodoSeleccionado();
              this.mensaje.push({
                severity: 'success',
                summary: 'Exito',
                detail: 'Se a finalizado el Partido'
              });
            } else {
              this.mensaje.push({
                severity: 'danger',
                summary: 'Error',
                detail: 'Error al Terminar el Partido'
              });
            }
          });
        },
        reject: () => {
          this.mensaje.push({
            severity: 'danger',
            summary: 'Error',
            detail: 'No se termino el partido'
          });
        }
      });
    }
  }
  private initPosecion() {
    this.conjuntoService
      .IniciarPosecion(this.deporteId)
      .then(res => {
        this.guarda_posecion_number = res;

      });
  }


  private initTiempoExtra() {
    this.conjuntoService
      .IniciarTiempoExtra(this.deporteId)
      .then(res => {

        this.mostrarvalor = res;
        this.mostrar = this.mostrarvalor > 0 ? true : false;
      });
  }


  guardarPosesionBalon(competidorId: number) {
    const posesion_balon = {
      deportePeriodoId: this.DeportePeriodoId,
      competidorId: competidorId,
      planillaId: this.planillaId,
      valor: this.min_pos * 60 + this.seg_pos,
      ParametroSucesoId: this.guarda_posecion_number
    };
    console.clear();
    console.log(posesion_balon);

    this.conjuntoService.updatePosesionBalon(posesion_balon).subscribe(res => {
      const resp = res.json();
    });
  }
  iniciaEquipo(pos) {
    switch (pos) {
      case 0:
        this.estiloBotonPosesionA = 'boton_posesion';
        this.estiloBotonPosesionB = 'boton_posesion';

        this.estiloPosesionA = false;
        this.estiloPosesionB = false;

        this.posesion_iconoA = '';
        this.posesion_iconoB = '';

        break;
      case 1:
        this.estiloPosesionA = true;
        this.estiloPosesionB = false;

        this.posesion_iconoA = '/assets/erpHammer/images/pelota.png';
        this.posesion_iconoB = '';
        break;
      case 2:
        this.estiloPosesionB = true;
        this.estiloPosesionA = false;

        this.posesion_iconoA = '';
        this.posesion_iconoB = '/assets/erpHammer/images/pelota.png';
        break;

      default:
        confirm('no existe esa opcion');
    }
  }
  detenerPosesion(noguardar) {
    const val: any = localStorage.getItem('posesionEquipo');
    if (val) {
      this.posesion_arreglo = {
        idCompedir: this.Idequipo,
        min: this.min_pos,
        seg: this.seg_pos
      };

      if (noguardar === 0) {
      } else {
        this.guardarPosesionBalon(this.Idequipo);
      }
      const val2: any[] = JSON.parse(val);
      val2.push(this.posesion_arreglo);

      localStorage.setItem('posesionEquipo', JSON.stringify(val2));
    } else {
      this.posesion_arreglo = [
        { idCompedir: this.Idequipo, min: this.min_pos, seg: this.seg_pos }
      ];

      if (noguardar === 0) {
      } else {
        this.guardarPosesionBalon(this.Idequipo);
      }

      localStorage.setItem(
        'posesionEquipo',
        JSON.stringify(this.posesion_arreglo)
      );
    }
    clearInterval(this.cronometro);

    this.Idequipo = this.posesionSeleccionado;
    /*no olvidar borra el local storage */
  }
  IniciarPosesion() {
    let contador_s = 0;
    let contador_m = 0;
    this.min_pos = contador_m;
    this.cronometro = setInterval(() => {
      if (Number(contador_s) === 60) {
        contador_s = 0;
        contador_m++;
        this.min_pos = contador_m;
        if (Number(contador_m) === 60) {
          contador_m = 0;
        }
      }
      this.seg_pos = contador_s;
      contador_s++;
    }, 1000);
  }

  capturarTiempo(mostrar, cambio) {
     
 

      if (this.iniciado === false) {
        this.mostrarDialogo = false;
        this.mensaje = [];
        this.mensaje.push({
          severity: 'info',
          summary: 'Información',
          detail: 'Debe iniciar el Encuentro'
        });
 
      }
      else{

      this.mostrarDialogo = true;
      this.capturar = !this.capturar;
      this.mostrarDialogoConj = mostrar;
      this.cambioJugador = cambio;

      }

   }

  doCaptura($event) {
    this.mensaje = [];
    this.TiempoCapturado = $event;
    const tiempo = this.TiempoCapturado.split(':');
    // this.marcadorDatos.Tiempo =
    //   parseInt(tiempo[1], 10) + '.' + parseInt(tiempo[2], 10);
      this.marcadorDatos.Tiempo =  tiempo[1] + '.' + tiempo[2];
    this.marcadorDatos.TiempoCapturado = tiempo[1] + ':' + tiempo[2];
    if (this.iniciar && !this.botonSucesoBloqueo) {
     // this.SeleccionarPeriodoCalculado();
      this.mostrarDialogoConjunto(this.mostrarDialogoConj);
    } else if (this.DeportePeriodoId && !this.iniciar) {
      this.mostrarDialogoConjunto(this.mostrarDialogoConj);
    } else {
      this.control_Periodo();
      this.mostrarDialogoConjunto(0);
    }
  }


  doIniciado($event){

    this.iniciado = $event;
    

  }

  mostrarDialogoConjunto(mostrar) {
    this.mensaje = [];
    if (
      this.marcadorDatos.NombreParametro === 'Cambio' &&
      Number(this.cambioJugador) === 1
    ) {
      mostrar = 2;
    } else if (
      this.marcadorDatos.NombreParametro === 'Cambio' &&
      Number(this.cambioJugador) === 2
    ) {
      mostrar = 3;
    } else if (Number(mostrar) === 1 || Number(mostrar) === 0) {
      mostrar = mostrar;
    } else {
      mostrar = 3;
    }

    switch (mostrar) {
      case 0:
        this.mensaje = [];
        this.mostrarDialogo = false;
        if (this.inicio > 0) {
          this.control_Periodo();
        }
        this.inicio++;

        break;
      case 1:
        if (this.enlinea && Number(this.marcadorDatos.RegistraPersona) === 0) {
          this.botonSucesoBloqueo = true;
          this.guardarSucesoParametro(this.marcadorDatos);
          this.mostrarDialogo = false;
        } else {
          this.mostrarDialogo = true;
        }
        break;
      case 2:
        if (this.DeportePeriodoId) {
          this.mostrarDialogoCambioA = true;
        } else {
          this.control_Periodo();
        }
        break;
      case 3:
        if (this.DeportePeriodoId) {
          this.mostrarDialogoCambioB = true;
        } else {
          this.control_Periodo();
        }
        break;
      default:
        this.mostrarDialogo = false;
    }
  }

  mostrarAdicion() {
    this.mensaje = [];
    if (this.DeportePeriodoId) {
      this.mostrarDialogoAdicion = true;
    } else {
      this.control_Periodo();
    }
  }

  guardarTiempoAdicion() {

    const tiempoAdicionPartido = {
      DeportePeriodoId: this.DeportePeriodoId,
      Tiempo: null,
      Competidor: null,
      PlanillaId: this.planillaId,
      ParametroSucesoId: this.mostrarvalor,
      Valor: this.tiempoAdicion
    };

    this.conjuntoService
      .InsSucesosAdicion(tiempoAdicionPartido)
      .subscribe(res => {
        const resp = res.json();
      });
    this.mostrarDialogoAdicion = false;

    this.adicionSocket = true;

  }

  mostrarDatosEncuentro(pos) {
    this.mensaje = [];
    if (Number(pos) === 1) {
      if (this.DeportePeriodoId) {
        this.mostrarDialogoDatosEventoA = true;
      } else {
        this.control_Periodo();
      }
    } else {
      if (this.DeportePeriodoId) {
        this.mostrarDialogoDatosEventoB = true;
      } else {
        this.control_Periodo();
      }
    }
  }

  cambioEvento($event, pos) {
    const cambioPartido = {
      DeportePeriodoId: this.DeportePeriodoId,
      Tiempo: this.marcadorDatos.Tiempo,
      CompetidorId: this.competidorId,
      PlanillaId: this.planillaId,
      ParametroSucesoId: this.marcadorDatos.ParametroSucesoId,
      posicion_grid: pos,
      Valor: this.marcadorDatos.Valor,
      SucesoPersonas: $event
    };

    this.guardarSucesoParametro(cambioPartido);

    this.mostrarDialogoCambioA = false;
    this.mostrarDialogoCambioB = false;
  }

  cerrarDialogoDatosEventoA() {
    this.mostrarDialogoDatosEventoA = false;
  }

  cerrarDialogoDatosEventoB() {
    this.mostrarDialogoDatosEventoB = false;
  }

  cerrarDialogo() {
    this.mostrarDialogoCambioA = false;
  }

  cerrarDialogoB() {
    this.mostrarDialogoCambioB = false;
  }



  getParametroFinalPeriodo() {
    this.conjuntoService.getParametroFinalPeriodo(this.deporteId).then(res => {
      this.ParametroSucesoId = res[0].ParametroSucesoId;
    });
  }
  /*sockets */
  private conectar() {

    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then((c) => {

    });


  }

  private controlCronometro(estado: boolean) {
    this._connection.invoke('ControlCronometro', estado);
  }

  private insertarAdicion(adicion) {
    this._connection.invoke('insertarAdicion', 'all', adicion, this.o.qs.group);
  }
  private seleccionarParametro(CompId, PlanId, posgrid) {
    const parametroSockets = {
      competidorId: CompId,
      PlanId: PlanId,
      posicion: posgrid
    };
    this._connection.invoke(
      'seleccionarParametro',
      'all',
      parametroSockets,
      this.o.qs.group
    );
  }
  private DevolverPosesion() {
    this._connection.invoke(
      'seleccionarPosesion',
      'all',
      'bloquearPosesion',
      this.o.qs.group
    );
  }
  private actualizarParametros(id, pos) {
    const parametroSockets = {
      id: id,
      pos: pos
    };
    this._connection.invoke(
      'actualizarParametro',
      'all',
      parametroSockets,
      this.o.qs.group
    );
  }

  actualizarVisor() {

    if (this.marcadorDatos.posicion_grid === 1) {
      console.clear();
      console.log('entro actualizar')
      const dataMarcador = {
        Periodo: this.periodoMarcador, // this.abreviaturaTiempo,
        Posicion: this.marcadorDatos.posicion_grid,
        Nombre: this.NombreC,
        Estado: this.estado,

      };
      this._connection.invoke(
        'ActualizarMarcador',
        dataMarcador
      );

    }
    else {

      // console.clear();
      console.log('entro actualizar')
      const dataMarcador = {
        Periodo: this.periodoMarcador, // this.abreviaturaTiempo,
        Posicion: this.marcadorDatos.posicion_grid,
        Nombre: this.NombreC,
        Estado: this.estado,
   
    


      };
      console.log(dataMarcador);
      this._connection.invoke(
        'ActualizarMarcador',
        dataMarcador
      );

    }
  }

  actualizarAccion() {

          console.clear();
          console.log('entro actualizar Accion')
          const dataAccion = {
            Pausa: this.pausa,
            Iniciar:this.iniciar,

          };
          this._connection.invoke(
            'ActualizarAccion',
            dataAccion
          );
    
        }


    actualizarPeriodo() {

          console.clear();
          console.log('entro actualizar periodo')
          const dataAccion = {
            Periodo: this.periodoMarcador,
            Pausar: this.pausa,

          };
          this._connection.invoke(
            'ActualizarPeriodo',
            dataAccion
          );
    
        }      

 private iniciarPausa() {
  this._connection.invoke('playClientes', 'all', 'pausar', this.o.qs.group);
  console.log("entro a iniciar pausa");
 }


 private iniciarPlay() {
   this._connection.invoke('playClientes', 'all', 'bloquear', this.o.qs.group);
   console.log("entro a iniciar play");
}

  doOpenVisor() {

    if (this.control_Periodo()) {
      // tslint:disable-next-line:max-line-length

      this.bandA = this.delegacionA;
      this.bandB = this.delegacionB;
      this.jugaA = this.equipoA;
      this.jugaB = this.equipoB;

      window.open(
        `#/t_${this.deporteId}/${this.bandA}/${this.bandB}/${
        this.planillaId
        }/${this.eventoId}/${this.deporteId}/${this.jugaA}/${this.jugaB}/pantalla${Math.floor(Math.random() * 100) + 1}`
      );
    }
  }


  /*cierra dialogo A de jugadores*/
  cerrarDialogoJug() {
    this.mostrarDialogo = false;
  }

  setplanilla() {
    this.router.navigate(['master/planilla/' + this.eventoId + '/' + this.deporteId + '/' + this.planillaId
      + '/' + this.tipo]);
  }
}
