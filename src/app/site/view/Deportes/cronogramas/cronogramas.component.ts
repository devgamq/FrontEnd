import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Util } from '../../../view/Futbol/util';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-cronogramas',
  templateUrl: './cronogramas.component.html',
  styleUrls: ['./cronogramas.component.css'],
  providers: [DeporteService, ConjuntoService],
  encapsulation: ViewEncapsulation.None
})
export class CronogramasComponent implements OnInit {
  tipos: SelectItem[];
  tiposDeportes: SelectItem[];
  instalaciones: SelectItem[];
  areas: SelectItem[];
  deportes: SelectItem[];
  pruebas: SelectItem[];
  categorias: SelectItem[];
  fases: SelectItem[];
  fase: any;
  deporte: any;
  instalacion: any;
  area: any;
  prueba: any;
  categoria: any;
  fecha: Date;
  hora: Date;
  evento: number;
  tipo: any;
  en: any;
  tabla: any[];
  hideBorrar = false;
  utilidad: Util;
  CronogramaId = 0;
  datoSeleccionado: any[];
  tipoDeporte = 0;
  msgs: Message[] = [];
  show_area = false;
  disabletipos = true;
  disablepruebas = true;
  disablecategorias = true;
  observaciones: any;

  constructor(
    private deporteService: DeporteService,
    private route: ActivatedRoute,
    private conjuntoService: ConjuntoService
  ) {
    this.deportes = [];
    this.pruebas = [];
    this.pruebas.push({ label: 'Todas', value: 0 });
    this.categorias = [];
    this.categorias.push({ label: 'Todas', value: 0 });
    this.fases = [];
    this.tipos = [];
    this.areas = [];
    this.tiposDeportes = [];
    this.tabla = [];
    this.evento = this.route.snapshot.params['eventoId'];
    this.utilidad = new Util();
    this.prueba = 0;
    this.categoria = 0;
    this.tipoDeporte = 0;
    this.area = 0;
  }

  ngOnInit() {
    this.getDeportes();
    this.initFases();
    this.initFechas();
    this.initTipos();
    this.initInstalaciones();
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


  private getDeportes() {
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

  getTipoDeporte() {
    this.tiposDeportes = [];
    this.deporteService.getTipos(this.evento, this.deporte).then(res => {
      res.forEach(item => {
        this.tiposDeportes.push({
          label: item.Detalle,
          value: item.EsIndivudual
        });
      });
    });
  }


  getPruebas() {
    this.pruebas = [];
    this.pruebas.push({ label: 'Todas', value: 0 });
    this.deporteService
      .getPruebas(this.evento, this.deporte, this.tipoDeporte)
      .then(res => {
        res.forEach(item => {
          this.pruebas.push({
            label: item.PruebaDescripcion,
            value: item.PruebaId
          });
        });
      });
  }

  getCategorias() {

    this.categorias = [];
    this.categorias.push({ label: 'Todas', value: 0 });
    this.deporteService
      .getRamas(this.evento, this.deporte, this.tipoDeporte, this.prueba)
      .then(res => {
        res.forEach(item => {
          this.categorias.push({
            label: item.Nombre,
            value: item.ParametroRamaId
          });
        });
      });


  }
  private selectedDeporte() {

    this.getTipoDeporte();
    this.getPruebas();
    this.getCategorias();
    this.tabla = [];
    this.disabletipos = false;
    this.disablepruebas = true;
    this.disablecategorias = true;


  }


  private selectTipo() {
    this.disablepruebas = false;
    this.disablecategorias = true;
    this.getPruebas();
  }

  private selectedPrueba() {
    this.disablecategorias = false;
    this.getCategorias();

  }



  private selectedRama() {
    this.cargarTabla();
  }



  private initFases() {
    this.fases = [];
    this.conjuntoService.getParametro(8).then(res => {
      if (res.length > 0) {
        this.fases = res;
        this.fase = res[0].value;
      }
    });
  }
  cargarAreas(seleccionado: number) {


    this.conjuntoService.GetAreas(this.instalacion).then(res => {
      if (res.length > 0) {
        this.areas = res;

        this.area = seleccionado > 0 ? seleccionado : res[0].value;
        this.show_area = true;
      } else {
        this.areas = [];
        this.area = 0;
        this.show_area = false;
      }
    });
  }
  private initTipos() {
    this.tipos = [];
    this.conjuntoService.getParametro(13).then(res => {
      if (res.length > 0) {
        this.tipos = res;
        this.tipo = res[0].value;
      }
    });
  }
  private initInstalaciones() {
    this.instalaciones = [];
    this.conjuntoService.GetInstalaciones().then(res => {
      if (res.length > 0) {
        this.instalaciones = res;
        this.instalacion = res[0].value;
        this.cargarAreas(0);
      }
    });
  }
  private cargarTabla() {


   
    this.CronogramaId = 0;
    this.conjuntoService
      .GetCronogramas(this.evento, this.deporte, this.prueba, this.categoria)
      .then(res => {

        this.tabla = res;
      });
  }

  private save(editar: boolean) {
    let hours = '';
    try {
      hours =
        this.utilidad.lpad('0', 2, String(this.hora.getHours())) +
        ':' +
        this.utilidad.lpad('0', 2, String(this.hora.getMinutes())) +
        ':00';
    } catch (error) {
      this.setError();
    }

    const data = {
      CronogramaId: editar ? this.CronogramaId : 0,
      Fecha: this.fecha,
      HoraProgramada: hours,
      InstalacionId: this.instalacion,
      ParametroFaseId: this.fase,
      ParametroTipoId: this.tipo,
      EventoId: this.evento,
      DeporteId: this.deporte,
      ParametroRamaId: this.categoria,
      PruebaId: this.prueba,
      FaseId: this.fase,
      AreaInstalacionId: this.area,
      Descripcion: this.observaciones,
    };


    console.log(data);



    if (
      this.fase > 0 && this.instalacion > 0 && this.evento > 0 && this.deporte > 0 && this.categoria > 0 && this.prueba > 0 && hours !== ''
    ) {


      this.conjuntoService.SaveCronograma(data).subscribe(res => {
        this.msgs = [];
        const resp = res.ok;

        let mensaje = 'Registro de cronograma correcto';
        if (editar) {
          mensaje =
            'Edición de datos del cronograma ' +
            this.CronogramaId +
            ', satisfactoria';
        }

        if (resp) {
          this.msgs.push({
            severity: 'success',
            summary: 'Mensaje:',
            detail: mensaje
          });
          this.CronogramaId = 0;
          this.cargarTabla();
        } else {
          this.msgs = [];
          this.msgs.push({
            severity: 'error',
            summary: 'Error:',
            detail:
              'Ocurrio un error en la edición de datos del cronograma ' +
              this.CronogramaId
          });
        }
      });
    } else {
      this.setError();
    }
  }

  private setError() {
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: 'Error:',
      detail:
        'No se pudo registrar el cronograma, revice los datos y reintente nuevamente '
    });
  }
  onRowSelect($event) {
    this.datoSeleccionado = [];
    this.hideBorrar = true;
    this.datoSeleccionado = $event.data;
    console.log(this.datoSeleccionado);

    this.cargarData();
  }
  private cargarData() {
    this.fecha = new Date(this.datoSeleccionado['Fecha']);
    this.hora = new Date(
      '01/01/2017 ' + this.datoSeleccionado['HoraProgramada']
    );

    this.instalacion = this.datoSeleccionado['InstalacionId'];

    this.fase = this.getFases(this.datoSeleccionado['Fase']);
    this.tipo = this.getTipos(this.datoSeleccionado['ParametroTipoId']);
    this.categoria = this.getRamas(this.datoSeleccionado['Rama']);
    this.prueba = this.datoSeleccionado['PruebaId'];
    this.CronogramaId = this.datoSeleccionado['CronogramaId'];
    this.area = this.datoSeleccionado['AreaInstalacionId'];
    this.observaciones = this.datoSeleccionado['Observaciones'];
    this.cargarAreas(this.area);
  }
  private clean() {
    this.hideBorrar = false;
    // $('input').val('');
  }
  edit() {
    if (Number(this.datoSeleccionado['CronogramaId']) > 0) {
      this.datoSeleccionado = [];
      this.save(true);
      this.clean();
    }
  }

  eliminarRegistro() {
    this.msgs = [];
    if (Number(this.datoSeleccionado['CronogramaId']) > 0) {
      this.conjuntoService
        .DeleteCronograma(Number(this.datoSeleccionado['CronogramaId']))
        .then(res => {
          const resp = res;
          if (res) {
            this.CronogramaId = 0;
            this.cargarTabla();
            this.msgs.push({
              severity: 'info',
              summary: 'Mensaje:',
              detail: 'El cronograma ha sido eliminado correctamente'
            });

          } else {
            this.msgs.push({
              severity: 'error',
              summary: 'Mensaje:',
              detail: 'El cronograma tiene dependencias no se puede borrar'
            });

          }

        });
    }
  }
  getFases(fase) {
    const consulta1 = this.fases.filter(function (c) {
      return c.label === fase;
    });
    return consulta1[0]['value'];
  }
  getTipos(tipo) {
    const consulta1 = this.tipos.filter(function (c) {
      return c.value === tipo;
    });
    return consulta1[0]['value'];
  }
  getRamas(rama) {
    const consulta1 = this.categorias.filter(function (c) {
      return c.label === rama;
    });
    return consulta1[0]['value'];
  }

}
