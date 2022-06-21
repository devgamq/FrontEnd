import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { CambioJugadorComponent } from '../cambio-jugador/cambio-jugador.component';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { SpinnerModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';
import {
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
@Component({
  selector: 'app-marcador-conjunto',
  templateUrl: './marcador-conjunto.component.html',
  styleUrls: ['./marcador-conjunto.component.css'],
  providers: [ConfirmationService, ConjuntoService, DeporteService],
  encapsulation: ViewEncapsulation.None
})
export class MarcadorConjuntoComponent implements OnInit {
  /*nombre deporte*/
  deportes: any[];
  nombreDeporte: string;
  eventoId: number;
  deporteId: number;
  planillaId: number;

  /*Equipos*/
  datos: Parametro[];
  datosB: Parametro[];
  CompetidorIdA: number;
  CompetidorIdB: number;
  DeportePeriodoIdSuceso = 0;
  equipoA: string;
  equipoB: string;
  /*periodo del partido */
  periodo: SelectItem[];
  periodoSeleccionado: number;
  periodos: any[];

  /*color de los botones*/
  estiloBotonPosesionA = 'boton_posesion';
  estiloBotonPosesionB = 'boton_posesion';
  /*logo de equipo*/
  logoA = '/assets/erpHammer/images/logoA.png';
  logoB = '/assets/erpHammer/images/logoB.png';
  /*label botones vacio*/
  e1 = ' ';

  data: any[];
  /*jugadores*/
  titulares: any[];
  suplentes: any[];
  titularesB: any[];
  suplentesB: any[];
  succesosPersonaA: any[];
  succesosPersonaB: any[];
  seleccionTitularA: any;
  seleccionTitularB: any;
  seleccionSuplenteA: any;
  seleccionSuplenteB: any;

  succesosConPersona: any[];
  succesosConPersonaB: any[];

  /*periodo*/
  periodoDeporte: string;
  DeportePeriodoId: number;
  DeportePeriodoIdAnt: number;
  ParametroSucesoId: number;

  /*Marcador*/
  sucesoPersonas: any[];
  sucesoPersona: SucesoPersona = new SucesoPersona();
  marcadorDatos: Marcador = new Marcador();
  cabecera: string;
  mostrarDialogoConj = 0;
  TiempoCapturado: string;
  tiempoPeriodo = '00:00:00';
  mostrarDialogo: boolean;
  /*visor*/
  abreviaturaTiempo: string;
  /*tiempo de adicion */
  tiempoAdicion = 0;
  /*verificar si esta esta en linea*/
  enlinea = false;
  mostrar_pausa = false;
  mostrar_play = true;
  accion: number;
  pausa: boolean;
  parar: boolean;

  /*cronometro*/
  iniciar: boolean;
  capturar: boolean;

  /*total puntos*/
  totalPuntosA = 0;
  totalPuntosB = 0;
  /*CAMBIO DE JUGADOR */
  cambioJugador = 0;
  mostrarDialogoCambioA: boolean;
  mostrarDialogoCambioB: boolean;
  sucesoParametroSeleccion: boolean;
  /*Historial de sucesos*/
  mostrarDialogoAdicion: boolean;
  mostrarDialogoDatosEventoA: boolean;
  mostrarDialogoDatosEventoB: boolean;

  mensaje: Message[] = [];
  parametroDatos: Parametro = new Parametro();

  @Input() ParametroId = 0;
  @Input() is_inscripcion = true;

  constructor(
    private confirmationService: ConfirmationService,
    private conjuntoService: ConjuntoService,
    private deporteService: DeporteService,
    private activedRoute: ActivatedRoute,
    private router: Router
  ) {
    /*de afuera */
    this.planillaId = this.activedRoute.snapshot.params['PlanillaId'];
    this.eventoId = this.activedRoute.snapshot.params['eventoId'];
    this.deporteId = this.activedRoute.snapshot.params['deporteId'];
    this.CompetidorIdA = this.activedRoute.snapshot.params['idcompetidor1'];
    this.CompetidorIdB = this.activedRoute.snapshot.params['idcompetidor2'];

    const equipo: any = JSON.parse(localStorage.getItem('encuentro'));
    const ele: any = JSON.parse(localStorage.getItem('elegido'));
    this.equipoA = ele.MarcadorEquipoA;
    this.equipoB = ele.MarcadorEquipoB;
  }
  ngOnInit() {
    this.doGetDeportes();
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

    this.doGetPlanilla(this.CompetidorIdA, this.planillaId, '', 1);
    this.doGetPlanilla(this.CompetidorIdB, this.planillaId, '', 2);
    this.obtenerIdDelegacion(this.CompetidorIdA, 1);
    this.obtenerIdDelegacion(this.CompetidorIdB, 2);

    this.devolverDatosDeporte();
    this.cargarBotonesPeriodo();
    this.cargarResultadoTotal()
  }
  /*Nombre deporte */
  doGetDeportes() {
    this.deporteService.getDeportes(this.eventoId).then(res => {
      this.deportes = res;
      const id = this.deporteId;
      const consulta1 = this.deportes.filter(function(c) {
        return c.DeporteId + '' === id + '';
      });
      this.nombreDeporte = consulta1[0].DeporteDescripcion;
    });
  }
  /*carga los botones*/
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
          this.succesosConPersona = this.datos.filter(function(c) {
            return c.RegistraPersona == 1;
          });
          this.succesosPersonaA = this.datos.filter(function(c) {
            return c.RegistraPersona == 0;
          });
        } else if (Number(lugar) === 2) {
          this.datosB = res;
          this.succesosConPersonaB = this.datosB.filter(function(c) {
            return c.RegistraPersona == 1;
          });
          this.succesosPersonaB = this.datosB.filter(function(c) {
            return c.RegistraPersona == 0;
          });
        }
      });
  }
  /*lista de jugadores*/
  doGetPlanilla(competidorId, planillaId, search, lugar) {
    this.conjuntoService
      .GetPlanillas(competidorId, planillaId, search,lugar)
      .then(res => {
        this.data = res.map(item => {
          const i = 0;
          return {
            Nombre: item.Persona.NombreCompleto,
            Orden: i + 1,
            Numero: item.NumeroCamiseta,
            Id: item.PlanillaPersonaId,
            Titular: item.Parametros.ParametroId,
            Posicion: item.Posicion,
            isInscripcion: this.is_inscripcion,
            PersonaId: item.PersonaId,
            PlanillaPersonaId: item.PlanillaPersonaId,
            Capitan: item.Capitan
          };
        });
        if (this.ParametroId > 0) {
          this.data = this.data.filter(
            item => Number(item.Titular) === Number(this.ParametroId)
          );
        }

        if (Number(lugar) === 1) {
          this.titulares = this.data.filter(function(c) {
            return c.Titular == 1;
          });
          this.suplentes = this.data.filter(function(c) {
            return c.Titular == 2;
          });
        } else if (Number(lugar) === 2) {
          this.titularesB = this.data.filter(function(c) {
            return c.Titular == 1;
          });
          this.suplentesB = this.data.filter(function(c) {
            return c.Titular == 2;
          });
        }
      });
  }
  obtenerIdDelegacion(idCompetidor, indice) {
    this.conjuntoService
      .obtenerIdDelegacion(idCompetidor, this.eventoId)
      .then(res => {
        if (Number(indice) === 1) {
          this.logoA = '/assets/banderas/' + res[0].DelegacionId + '.png';
        } else if (Number(indice) === 2) {
          this.logoB = '/assets/banderas/' + res[0].DelegacionId + '.png';
        }
      });
  }

  devolverDatosDeporte() {
    switch (Number(this.deporteId)) {
      case 3:
        this.periodoDeporte = 'Cuarto';
        break;
      case 4:
        this.periodoDeporte = 'Período';
        break;
      case 5:
        this.periodoDeporte = 'Período';
        break;
      case 6:
        this.periodoDeporte = 'Set';
        break;
      case 15:
        this.periodoDeporte = 'Periodo';
        break;
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

  onRowSelect(event, posicion) {
    this.mensaje = [];
    if (posicion === this.marcadorDatos.posicion_grid) {
      if (this.sucesoParametroSeleccion) {
        this.sucesoPersona.PlanillaPersonaId = event.data.PersonaId;
        this.guardarSucesoParametro(this.marcadorDatos);
      }
    } else {
      this.mensaje.push({
        severity: 'danger',
        summary: 'Error',
        detail: 'Selecciono un jugador del otro Equipo'
      });
    }
  }

  /*Marcador*/
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
    this.cabecera = $event.Parametro + ': ' + this.marcadorDatos.NombreEquipo;

    //this.competidorId = $event.CompetidorId;
    this.planillaId = $event.PlanillaId;

    this.mostrarDialogo = true;
    this.sucesoParametroSeleccion = true;
  }

  public regresar() {
    if (Number(this.deporteId) === 4) {
      this.router.navigate([
        'master/cronogramaFutbol/' + this.eventoId + '/' + this.deporteId
      ]);
    } else if (Number(this.deporteId) === 5) {
      this.router.navigate([
        'master/cronogramaSala/' + this.eventoId + '/' + this.deporteId
      ]);
    } else if (Number(this.deporteId) === 6) {
      this.router.navigate([
        'master/cronogramaVoleibol/' + this.eventoId + '/' + this.deporteId
      ]);
    } else if (Number(this.deporteId) === 3) {
      this.router.navigate([
        'master/cronogramaBasquet/' + this.eventoId + '/' + this.deporteId
      ]);
    }
  }

  SeleccionarPeriodo() {
    this.DeportePeriodoIdAnt = this.DeportePeriodoId;
    this.DeportePeriodoId = this.periodoSeleccionado;
    // this.capturarTiempo(0, 0);
    this.confirmationService.confirm({
      message: 'Desea Cambiar de Periodo?',
      header: 'Confirmacion Cambio',
      accept: () => {
        this.mostrarDialogoConj = 1;
        const periodoBuscar = this.DeportePeriodoId;
        const consulta1 = this.periodos.filter(function(c) {
          return c.DeportePeriodoId === periodoBuscar;
        });
        this.tiempoPeriodo = this.TiempoCapturado;

        this.getParametroFinalPeriodo();
        this.guardarPeriodoSeleccionado();
        this.abreviaturaTiempo = consulta1[0].Abreviatura;
        //this.actualizarVisor();

        this.DeportePeriodoIdSuceso =
          Number(this.deporteId) === 6 ? this.periodoSeleccionado : 0;
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
        if (Number(this.deporteId) === 6) {
           this.cargarResultadoTotal();
        }
      },
      reject: () => {
        this.periodoSeleccionado = this.DeportePeriodoIdAnt;
        this.DeportePeriodoId = this.periodoSeleccionado;
      }
    });
  }
  guardarPeriodoSeleccionado() {
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
      console.log('guarda Periodo');
      this.conjuntoService
        .guardarSucesoParametro(periodoCambio)
        .subscribe(res => {
          const resp = res.json();
          this.tiempoAdicion = 0;
        });
    }
  }
  getParametroFinalPeriodo() {
    this.conjuntoService.getParametroFinalPeriodo(this.deporteId).then(res => {
      this.ParametroSucesoId = res[0].ParametroSucesoId;
    });
  }
  /*cronometro */
  pause(estadopause) {
    if (estadopause) {
      //this.iniciarPausa();
      //this.pauseSocket = true;
    }

    this.accion = 3;
    if (this.iniciar) {
      this.pausa = true;
      this.iniciar = false;
    }
    this.parar = false;
    this.mostrar_pausa = false;
    this.mostrar_play = true;

    //this.band_pos = false;
    const noguardar = 0;
    //this.detenerPosesion(noguardar);
    //this.iniciaEquipo(0);

    this.enlinea = false;
  }
  play(estadoplay) {
    if (estadoplay) {
      // this.iniciarPlay();
      // this.playSocket = true;
    }

    this.accion = 1;
    this.iniciar = true;
    this.pausa = false;
    this.parar = false;

    this.mostrar_pausa = true;
    this.mostrar_play = false;
    //this.calcularPosesion(this.iniciaId, this.posIniciaId, false, 0);
    //this.capturarTiempo(0, 0);
    //this.guardarHoraInicio();
    this.enlinea = true;
  }
  stop() {
    this.accion = 2;
    this.parar = true;
    this.iniciar = false;
    this.pausa = false;
  }

  capturarTiempo(mostrar, cambio) {
    this.capturar = !this.capturar;
    this.mostrarDialogoConj = mostrar;
    //this.cambioJugador = cambio;
  }

  doCaptura($event) {
    this.mensaje = [];
    this.TiempoCapturado = $event;
    const tiempo = this.TiempoCapturado.split(':');
    this.marcadorDatos.Tiempo =
      parseInt(tiempo[1], 10) + '.' + parseInt(tiempo[2], 10);
    this.marcadorDatos.TiempoCapturado = tiempo[1] + ':' + tiempo[2];
    if (this.iniciar) {
      //this.SeleccionarPeriodoCalculado();
      this.mostrarDialogoConjunto(this.mostrarDialogoConj);
    } else if (this.DeportePeriodoId && !this.iniciar) {
      this.mostrarDialogoConjunto(this.mostrarDialogoConj);
    } else {
      this.mensaje.push({
        severity: 'danger',
        summary: 'Error',
        detail: 'No selecciono Periodo'
      });
      this.mostrarDialogoConjunto(0);
    }
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
        this.mostrarDialogo = false;
        this.mensaje.push({
          severity: 'danger',
          summary: 'Error',
          detail: 'No selecciono Periodo'
        });
        break;
      case 1:
        if (this.enlinea && Number(this.marcadorDatos.RegistraPersona) === 0) {
          this.guardarSucesoParametro(this.marcadorDatos);
          this.mostrarDialogo = false;
        } else {
          if (this.marcadorDatos.RegistraPersona === 0) {
            this.mostrarDialogo = true;
          } else {
            this.mostrarDialogo = false;
            this.mensaje.push({
              severity: 'info',
              summary: 'Anuncio',
              detail: 'Selecciones Jugador'
            });
          }
        }
        break;
      case 2:
        if (this.DeportePeriodoId) {
          this.mostrarDialogoCambioA = true;
        } else {
          this.mensaje.push({
            severity: 'info',
            summary: 'Error',
            detail: 'No selecciono Periodo'
          });
        }
        break;
      case 3:
        if (this.DeportePeriodoId) {
          this.mostrarDialogoCambioB = true;
        } else {
          this.mensaje.push({
            severity: 'danger',
            summary: 'Error',
            detail: 'No selecciono Periodo'
          });
        }
        break;
      default:
        this.mostrarDialogo = false;
    }
  }

  /*guardar suceso parametro*/
  onclickGuardarMarcador($event) {
    const tiempo = $event.TiempoCapturado.split(':');
    // $event.Tiempo = parseInt(tiempo[0], 10) + '.' + parseInt(tiempo[1], 10);
    $event.Tiempo = tiempo[0]+ '.' + tiempo[1];
    
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
    console.log(event);
    this.conjuntoService.guardarSucesoParametro(event).subscribe(res => {
      const resp = res.json();
      if (resp) {
        this.mensaje.push({
          severity: 'success',
          summary: 'Exito',
          detail: 'Se agrego correctamente el registro'
        });
        this.cargarBotonesEquipo(
          event.CompetidorId,
          event.PlanillaId,
          event.posicion_grid,
          this.DeportePeriodoIdSuceso
        );
        //this.seleccionarParametro(event.CompetidorId, event.PlanillaId, event.posicion_grid);
        //this.actualizarVisor();
        this.sucesoParametroSeleccion = false;
        if (Number(this.deporteId) === 6) {
          this.cargarResultadoTotal();
        }
        if (Number(this.deporteId) === 3) {
           this.cargarResultadoTotal();
        }
      } else {
        this.mensaje.push({
          severity: 'danger',
          summary: 'Error',
          detail: 'Error al guardar el registro'
        });
      }
    });
  }

  cargarResultadoTotal() {
    this.conjuntoService
      .sumaPuntos(this.planillaId, this.DeportePeriodoIdSuceso)
      .then(res => {
        if (res && this.DeportePeriodoIdSuceso != 0) {
          if (Number(res[0].CompetidorId) === this.CompetidorIdA) {
            this.totalPuntosA = res[0].Valor;
            this.totalPuntosB = res[1].Valor;
          } else if (Number(res[0].CompetidorId) === this.CompetidorIdB) {
            this.totalPuntosA = res[1].Valor;
            this.totalPuntosB = res[0].Valor;
          }
        } else {
          this.totalPuntosA = 0;
          this.totalPuntosB = 0;
        }
      });
  }
}
