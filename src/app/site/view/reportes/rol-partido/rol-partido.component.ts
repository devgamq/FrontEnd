import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { DelegacionService } from '../../../service/Acreditacion/delegacion.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Util } from '../../../view/Futbol/util';
import { PipeFechaComponent } from '../pipe-fecha/pipe-fecha.component';
import { CalendarModule } from 'primeng/primeng';
import { JasperService } from '../../../service/Conjunto/jasper.service';
import { SplitButtonModule, MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-rol-partido',
  templateUrl: './rol-partido.component.html',
  styleUrls: ['./rol-partido.component.css'],
  providers: [
    DeporteService,
    DelegacionService,
    ConjuntoService,
    JasperService
  ],
  encapsulation: ViewEncapsulation.None
})
export class RolPartidoComponent implements OnInit {
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
  display: boolean= false;
  titleDialog: string;
  imgBase64: string[];
  imageIndex;
  constructor(
    private route: ActivatedRoute,
    private deporteService: DeporteService,
    private conjuntoService: ConjuntoService,
    private delegacionService: DelegacionService,
    private JasperService: JasperService,
    private router: Router
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
    this.imageIndex = 0;
    this.imgBase64 = [''];
  }

  ngOnInit() {
    this.initDeportes();
    this.initDelegaciones();
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
    // .GetCronogramasFecha(this.deporte, this.evento, 0, this.fechastr, 0)
      .GetProgramacionConjunto(
        this.evento,
        this.deporte,
        this.fechastr,
        this.delegacion
      )
      .then(res => {
        console.clear();
        console.log(res);
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
  imprimir() {
    let fecha_actual;
    try {
      fecha_actual =
      this.fechastr.getFullYear() +
      '-' +
      (this.fechastr.getMonth() + 1) +
      '-' +
      this.fechastr.getDate();
    } catch (error) {
      fecha_actual = '';
    }

    this.JasperService.getProgramacion(
      this.evento,
      this.deporte,
      fecha_actual
    ).then(res => {
      window.open(URL.createObjectURL(res));
    });
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
  verPantalla(fila) {}

  getColor(estado) {
    if (estado === 'Abierto') {
      return 'green';
    } else if (estado === 'Concluido') {
      return 'red';
    } else {
      return 'Orange';
    }
  }
  getImage(value) {
    console.log(value);
    this.conjuntoService.GetImagenPLanilla(value.CronogramaId).then(res => {
      if (res !== '') {
        this.imgBase64 = []
        this.imgBase64.push('data:image/jpg;base64,' + res);
        this.display = true;
        this.titleDialog = `[${value.Rama}] ${value.EquipoA} vs. ${value.EquipoB}`;
      }
    });
  }
}