import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { JasperService } from '../../../service/Conjunto/jasper.service';
import { Cronograma } from '../../../domain/deportes/grupo/cronograma';
import { Encuentro } from '../../../domain/deportes/grupo/v_encuentro';
import { Planilla } from '../../../domain/deportes/grupo/Planilla';
import { PlanillaPersona } from '../../../domain/deportes/grupo/PlanillaPersona';
import { Equipo } from '../../../domain/deportes/grupo/equipo';
import { Evento } from '../../../domain/deportes/grupo/evento';
import * as config from '../../../domain/Shared/global';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { SplitButtonModule, MenuItem } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { TiroArcoService } from '../../../service/simple/tiro_arco';
import { Util } from '../../../view/Futbol/util';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-cronograma-ta',
  templateUrl: './cronograma-ta.component.html',
  styleUrls: ['./cronograma-ta.component.css'],
  providers: [ConjuntoService, ConfirmationService, JasperService, DeporteService, TiroArcoService]
})
export class CronogramaTaComponent implements OnInit {
  utilidad: Util;
  language: any;
  encuentros: Cronograma[];
  fecha: Date;
  minDate: Date;
  maxDate: Date;
  vista: Encuentro[];
  cronogramaaux: any[];
  encuentroSeleccionado: Encuentro;
  planillaaux: any[];

  planilla = 0;
  @Input() deporteId: number;
  public disableComboDeportes = false;
  PlanillaId: number;
  evento: Evento;
  mostrarResumen: boolean;
  @Input() eventoId: number;
  cronogramaId: number;
  vButton = false;
  currentData: any;
  url: any[];
  tipo = 0;
  nombreDeporte = '';
  disabledplanilla = true;
  constructor(
    private conjuntoService: ConjuntoService,
    private JasperService: JasperService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private deporteService: DeporteService,
    private tiroArcoService: TiroArcoService,
    private formBuilder: FormBuilder
  ) {

    this.fecha = new Date();
    this.minDate = new Date();
    this.maxDate = new Date();

    this.evento = new Evento();
    this.language = config.es;
    this.encuentros = [];
    this.vista = [];
    this.cronogramaaux = [];
    this.url = [];
    this.utilidad = new Util();
    this.encuentroSeleccionado = new Encuentro();

    router.events.forEach((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.url = [];
        this.url = event.url.split('/');
        if (this.url.length > 4) {
          if (String(this.url[2]).includes('cronograma_ta')) {
            const pagina = this.url[2];
            this.eventoId = this.url[3];
            this.deporteId = this.url[4];
            this.tipo = this.url[5];
            this.initValores();
          }

        }
      }
    });
  }

  ngOnInit() {

    this.eventoId = this.route.snapshot.params['eventoId'];
    this.deporteId = this.route.snapshot.params['deporteId'];
    this.tipo = this.route.snapshot.params['tipo'];
    localStorage.clear();
    this.initValores();

  }
  private getNombreDeporte() {
    this.deporteService.getDeportes(this.eventoId).then(res => {
      if (res.length > 0) {
        this.nombreDeporte = res.filter(
          item => Number(item.DeporteId) === Number(this.deporteId)
        )[0].DeporteDescripcion;
      }
    });
  }
  private initValores() {
    this.disableComboDeportes = Number(this.deporteId) === 0 ? false : true;
    this.getNombreDeporte();
    this.doGetEncuentros(this.deporteId);
    this.getEvento();

  }


  private getEvento() {
    this.conjuntoService.GetEvento(this.eventoId).then(res => {
      this.evento = res;
      this.minDate = new Date(this.evento.Inicio);
      this.maxDate = new Date(this.evento.Fin);
    });
  }
  doGetEncuentros(deporteId) {

    this.conjuntoService
      .GetProgramacionConjunto(this.eventoId, deporteId, this.fecha, 0)
      .then(res => {

        this.encuentros = res;

        this.vista = res.map(item => {
          return {

            Hora:
              this.utilidad.lpad(
                '0',
                2,
                String(new Date('1968-11-16T' + item.HoraProgramada).getHours())
              ) +
              ':' +
              this.utilidad.lpad(
                '0',
                2,
                String(
                  new Date('1968-11-16T' + item.HoraProgramada).getMinutes()
                )
              ),
            EquipoA: item.EquipoA == null ? '' : item.EquipoA,
            EquipoB: item.EquipoB == null ? '' : item.EquipoB,
            Escenario: item.Instalacion,
            Estado:
              item.MarcadorEquipoA == null || item.MarcadorEquipoB == null
                ? 'Abierto'
                : item.Estado,
            Puntuacion:
              (item.MarcadorEquipoA == null ? '0' : item.MarcadorEquipoA) +
              '-' +
              (item.MarcadorEquipoB == null ? '0' : item.MarcadorEquipoB),
            EventoId: item.EventoId,
            CompetidorAId: item.CompetidorAId == null ? 0 : item.CompetidorAId,
            CompetidorBId: item.CompetidorBId == null ? 0 : item.CompetidorBId,
            EquipoIdA: item.EquipoIdA == null ? 0 : item.EquipoIdA,
            EquipoIdB: item.EquipoIdA == null ? 0 : item.EquipoIdA,
            Planilla: 0,
            CronogramaId: item.CronogramaId,
            HoraInicio: item.HoraInicio == null ? '00:00' : item.HoraInicio,
            HoraFin: item.HoraFin == null ? '00:00' : item.HoraFin,
            PlanillaEstado: 0,
            Genero: item.Rama,
            PlanillaId: item.PlanillaId,
            Prueba: item.Prueba
          };
        });
      });


  }


  handleDeporte($event) {
    this.deporteId = $event;
    this.doGetEncuentros($event);

  }
  hanldeCalendario() {
    const deporte =
      String(Number(this.deporteId)) === 'NaN' ? 0 : this.deporteId;
    this.doGetEncuentros(deporte);


  }
  verMarcador() {
    try {
      if (this.currentData !== null) {
        this.handleRowDblclick(this.currentData);
      }
    } catch (error) { }
  }

  handleRowDblclick($event) {

    this.encuentroSeleccionado = $event.data;

    this.tiroArcoService
      .GetPlanilla(this.encuentroSeleccionado.CronogramaId)
      .then(res => {
        const auxPlanilla = res;

        if (auxPlanilla == null || auxPlanilla === 0) {
          this.confirmationService.confirm({
            message: 'Desea crear la plantilla?',
            accept: () => {
              this.save();
            }
          });
        } else {
          this.planilla = auxPlanilla;
          this.encuentroSeleccionado.Planilla = this.planilla;
          localStorage.setItem('encuentro', JSON.stringify(this.encuentroSeleccionado));
          this.router.navigate(['master/marcador_ta/' + this.eventoId + '/' + this.deporteId]);
        }
      });

  }

  private save() {
    const planilla = { CronogramaId: this.encuentroSeleccionado.CronogramaId };
    this.tiroArcoService.savePlanilla(planilla).subscribe(res => {

      this.encuentroSeleccionado.Planilla = Number(res.json());
      localStorage.setItem('encuentro', JSON.stringify(this.encuentroSeleccionado));
      this.router.navigate(['master/marcador_ta/' + this.eventoId + '/' + this.deporteId]);
    });
  }


  getColor(estado) {
    if (estado === 'Abierto') {
      return 'green';
    } else if (estado === 'Concluido') {
      return 'red';
    } else {
      return 'Orange';
    }
  }

  mostrarBotonResumen($event) {
    this.cronogramaId = $event.data.CronogramaId;
    const userAgent = navigator.userAgent || navigator.vendor;

    this.currentData = $event;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.vButton = true;
    } else {
      this.vButton = false;
    }
  }

}
