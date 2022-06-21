import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { DelegacionService } from '../../../service/Acreditacion/delegacion.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Util } from '../../../view/Futbol/util';
import { PipeFechaComponent } from '../pipe-fecha/pipe-fecha.component';
import { CalendarModule } from 'primeng/primeng';
import { SplitButtonModule, MenuItem } from 'primeng/primeng';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';

@Component({
  selector: 'app-rol-encuentro',
  templateUrl: './rol-encuentro.component.html',
  styleUrls: ['./rol-encuentro.component.css'],
  providers: [DeporteService, DelegacionService, ConjuntoService],
  encapsulation: ViewEncapsulation.None
})
export class RolEncuentroComponent implements OnInit {
  private _connection: SignalRConnection;
  deportes: SelectItem[];
  delegaciones: SelectItem[];
  fechastr: Date;
  deporte: any;
  delegacion: any;
  evento: any;
  fechas: any[];
  fechas_aux: any[];
  instalaciones: any[];
  data: any[];
  utilidad: Util;
  en: any;
  items: MenuItem[];
  planilla = 0;
  formato: PipeFechaComponent;
  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'control', group: 'contacto' },
    url: urls.urlSockets
  };

  constructor(
    private route: ActivatedRoute,
    private deporteService: DeporteService,
    private conjuntoService: ConjuntoService,
    private delegacionService: DelegacionService,
    private router: Router,
    private _signalR: SignalR
  ) {
    this.evento = this.route.snapshot.params['eventoId'];
    this.utilidad = new Util();

    this.data = [];
    this.deportes = [];
    this.fechas = [];
    this.fechas_aux = [];
    this.instalaciones = [];
    this.delegacion = 0;
    this.initFechas();
    this.formato = new PipeFechaComponent();
  }

  ngOnInit() {
    this.initDeportes();
    this.initDelegaciones();
    this.conectar();
    this.hiloConectar();
  }
  private hiloConectar() {
    const timerScroll = setInterval(() => {
      console.clear();
      this.conectar();
    }, 600000);
  }
  private verMarcador(fila) {
    const CronogramaId = fila.CronogramaId;
    const Deporte = fila.Deporte;
    const DeporteId = fila.DeporteId;
    this.getPlanilla(CronogramaId, Deporte, DeporteId);
  }
  private getPlanilla(CronogramaId, Deporte, DeporteId) {
    this.conjuntoService.getPlanilla(CronogramaId).then(res => {
      this.planilla = res[0].PlanillaId;
      window.open(
        `#/marcas/${CronogramaId}/${Deporte}/${DeporteId}/${this.planilla}`
      );
    });
  }
  private initFechas() {
    this.en = {
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
  private initDeportes() {
    this.deporteService.getDeportes(this.evento).then(res => {
      this.deportes = res
        .map(item => {
          return {
            value: item.DeporteId,
            label: item.DeporteDescripcion
          };
        })
        .sort((a, b) => String(a.label).localeCompare(String(b.label)));
    });
  }
  private initDelegaciones() {
    this.delegacionService.getDelegaciones(this.evento).then(res => {
      this.delegaciones = res.map(item => {
        return {
          value: item.DelegacionId,
          label: item.Nombre
        };
      });
      this.delegaciones.unshift({ value: 0, label: 'Todas' });
    });
  }
  private cargarDatos() {
    this.conjuntoService
      .GetProgramacionConjunto(
        this.evento,
        this.deporte,
        this.fechastr,
        this.delegacion
      )
      .then(res => {
        if (res.length > 0) {
          this.data = res;
          this.fechas = [];
          this.fechas_aux = [];

          this.data.forEach(element => {
            const base = {
              fecha: element.Fecha,
              escenarios: this.setInstalaciones(element.Fecha)
            };

            if (this.fechas_aux.indexOf(element.Fecha) === -1) {
              this.fechas.push(base);
              this.fechas_aux.push(element.Fecha);
            }
          });
        }
      });
  }
  selectedDeporte() {
    this.fechas = [];
    this.cargarDatos();
  }

  public setInstalaciones(fecha) {
    const instalaciones = [];
    const datos = this.data.filter(item => item.Fecha === fecha);

    datos.forEach(element => {
      if (instalaciones.indexOf(element.Instalacion) === -1) {
        instalaciones.push(element.Instalacion);
      }
    });

    return instalaciones;
  }
  public getGrupoDatos(fecha, instalacion) {
    return this.data.filter(
      item => item.Fecha === fecha && item.Instalacion === instalacion
    );
  }

  handleRowDblclick($event) {
    const CronogramaId = $event.data.CronogramaId;
    this.router.navigate([
      'master/resumen-partido/' +
      this.evento +
      '/' +
      CronogramaId +
      '/' +
      this.deporte
    ]);
  }
  verAlineacion(fila) {
    const CronogramaId = fila.CronogramaId;
    const DeporteId = fila.DeporteId;
    window.open(`#/alineacion/${CronogramaId}/${this.evento}/${DeporteId}`);
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

  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start();
  }
  verPantalla(data) {
    const grupo = this.o.qs.group;
    const inputs = {
      eventoId: this.evento,
      deporteId: this.deporte,
      CronogramaId: data.CronogramaId,
      tiempo: 25,
    };

    this._connection.invoke('sendCodesur', 'contacto', inputs);

  }
  mostrarVisor() {
    window.open(
      `#/t_${this.deporte}/${this.evento}/${this.deporte}/0/pantalla${Math.floor(Math.random() * 100) + 1}`
    );
  }
}



