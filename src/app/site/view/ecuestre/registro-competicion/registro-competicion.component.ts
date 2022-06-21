import { Component, OnInit } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { SimpleService } from '../../../service/simple/simple.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { EcuestreService } from '../../../service/Conjunto/ecuestre';
import { Util } from '../../../view/Futbol/util';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-registro-competicion',
  templateUrl: './registro-competicion.component.html',
  styleUrls: ['./registro-competicion.component.css'],
  providers: [SimpleService, DeporteService, EcuestreService, ConfirmationService]
})
export class RegistroCompeticionComponent implements OnInit {
  LeccionCompetidorId = 0;
  hideBorrar = false;
  datoSeleccionado: any;
  utilidad: Util;
  en: any;
  hora: Date;
  competidorId: number;
  tabla: any[];
  Equipos: any[];
  msgs: Message[] = [];
  cronogramas: SelectItem[];
  lecciones: SelectItem[];
  categorias: SelectItem[];
  pruebas: SelectItem[];
  fases: SelectItem[];
  tipos: SelectItem[];
  eventoId: number;
  pruebaId: number;
  LeccionId: number;
  parametroRamaId: number;
  parametroFaseId: number;
  parametroTipoId = 1;
  deporteId = 34;
  CronogramaId: number;
  _Persona: any;
  nombre_persona = '';
  estiloauto = 'inputInsertar';
  constructor(private router: Router,
    private simpleService: SimpleService,
    private deporteService: DeporteService,
    private ecuestreService: EcuestreService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute) {
    this.cronogramas = [];
    this.tabla = [];
    this.eventoId = this.route.snapshot.params['eventoId'];
    this.utilidad = new Util();
  }


  ngOnInit() {
    this.getPruebas();
    this.initFechas();
  }

  private cargarTabla() {
    this.tabla = [];
    this.ecuestreService
      .GetCompetidoresEcuestre(this.CronogramaId, this.LeccionId)
      .then(res => {
        this.tabla = res;
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
  private getPruebas() {
    this.pruebas = [];
    this.deporteService
      .getPruebas(this.eventoId, this.deporteId, 1)
      .then(res => {
        res.forEach(item => {
          this.pruebas.push({
            label: item.PruebaDescripcion,
            value: item.PruebaId
          });
        });
      });
  }
  private getLecciones() {
    this.lecciones = [];
    this.ecuestreService
      .getLecciones(this.eventoId)
      .then(res => {
        this.lecciones = res;
      });
  }
  changePrueba() {
    this.categorias = [];
    this.fases = [];
    this.cronogramas = [];
    this.tabla = [];
    this.lecciones = [];

    this.deporteService
      .getRamas(this.eventoId, this.deporteId, 1, this.pruebaId)
      .then(res => {
        res.forEach(item => {
          this.categorias.push({
            label: item.Nombre,
            value: item.ParametroRamaId
          });
        });
      });
  }

  changeRama() {
    this.getFases();
  }
  changeFase() {
    this.getCronogramas()
  }
  private getFases() {
    this.fases = [];
    this.simpleService
      .GetFasesConjunto(
        this.eventoId,
        this.deporteId,
        this.parametroRamaId,
        this.parametroTipoId
      )
      .then(res => {
        res.forEach(item => {
          this.fases.push({ label: item.Fase, value: item.ParametroFaseId });
        });
      });
  }

  getCronogramas() {
    this.cronogramas = [];
    this.simpleService
      .GetCronogramaConjunto(
        this.eventoId,
        this.deporteId, this.parametroRamaId, 1, this.parametroFaseId, this.pruebaId
      )
      .then(res => {
        res.forEach(item => {
          this.cronogramas.push({
            label:
              item.Fecha + ' ' + item.HoraProgramada + ' ' + item.Instalacion,
            value: item.CronogramaId
          });
        });
      });
  }
  seleccionarCrono() {
    this.getLecciones();

  }
  doSearchEquipos(event) {
    const search = event.query;
    this.simpleService
      .busquedaCompetidorEquipo(search, this.CronogramaId, this.parametroTipoId)
      .then(res => {
        console.log(res);
        this.Equipos = res;
      });
  }
  doSelectSearchEquipo($event) {

    this.competidorId = $event.CompetidorId;
    this.nombre_persona = $event.Equipo;

  }
  guardarRegistro() {
    this.LeccionCompetidorId = 0;
    this.guardarCompeticion();
  }
  guardarCompeticion() {

    let hours = '';
    try {
      hours =
        this.utilidad.lpad('0', 2, String(this.hora.getHours())) +
        ':' +
        this.utilidad.lpad('0', 2, String(this.hora.getMinutes())) +
        ':00';
    } catch (error) {

      this.setMensaje('Error', 'Ocurrio un error al registrar la competición, intente nuevamente', 'error');
    }

    const data = {
      CompetidorId: this.competidorId,
      CronogramaId: this.CronogramaId,
      LeccionId: this.LeccionId,
      LeccionCompetidorId: this.LeccionCompetidorId,
      Hora: hours

    };

    if (this.competidorId > 0 && this.hora !== undefined) {


      this.ecuestreService.saveCompetidor(data).subscribe(res => {


        if (Number(res.json()) === -1) {
          this.setMensaje('Error', 'Ocurrio un error al registrar la competición, intente nuevamente', 'error');
        }
        if (Number(res.json()) === -2) {
          this.setMensaje('Error', 'El competidor ' + this.nombre_persona + ' ya fue registrado', 'error');
        }
        if (Number(res.json()) > 0) {
          this.setMensaje('Mensaje', 'El competidor ' + this.nombre_persona + '  fue registrado', 'success');

          this.cargarTabla();
        }
      });
      this.clean();
    } else {
      this.setMensaje('Error', 'Ocurrio un error al registrar la competición, intente nuevamente', 'error');
    }
  }
  private clean() {
    this.hideBorrar = false;
    this.LeccionCompetidorId = 0;
    this.datoSeleccionado = [];
    $('input').val('');
  }
  private setMensaje(titulo: string, texto: any, accion: any) {
    this.msgs = [];
    this.msgs.push({
      severity: accion,
      summary: titulo,
      detail: texto
    });
  }

  onRowSelect($event) {
    this.datoSeleccionado = [];
    this.datoSeleccionado = $event.data;
    console.log(this.datoSeleccionado);
    this.hideBorrar = true;
    this.cargarData();
  }

  cargarData() {
    const aux = {
      CompetidorId: this.datoSeleccionado.CompetidorId,
      Equipo: this.datoSeleccionado.Nombre
    };
    this._Persona = aux;
    this.doSelectSearchEquipo(aux);
    this.hora = new Date(
      '01/01/2017 ' + this.datoSeleccionado.Hora
    );
    this.LeccionCompetidorId = this.datoSeleccionado.LeccionCompetidorId;
    this.competidorId = this.datoSeleccionado.CompetidorId;

  }
  modificarRegistro() {
    if (this.datoSeleccionado !== undefined && this.datoSeleccionado !== null) {
      this.guardarCompeticion();
    }
  }
  seleccionarLeccion() {
    this.cargarTabla();
  }
  confirmDelete() {
    this.msgs = [];
    if (Number(this.datoSeleccionado.LeccionCompetidorId) > 0) {
      this.confirmationService.confirm({
        message: '¿Esta seguro de eliminar?',
        header: 'Eliminar Competidor',
        icon: 'fa fa-trash',
        accept: () => {
          this.ecuestreService.deleteCompetidor(this.datoSeleccionado.LeccionCompetidorId).subscribe(res => {

            this.setMensaje('Mensaje', 'El competidor ' + this.nombre_persona + '  fue eliminado', 'success');
            this.clean();
            this.cargarTabla();
          });
        }
      });

    } else {
      this.setMensaje('Error', 'El elemento seleccionado, no puede ser eliminado', 'error');

    }


  }
  handleRowDblclick($event) {

  }
}
