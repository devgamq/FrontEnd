import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Equipos } from 'app/site/domain/Conjunto/Equipos';
import { Deporte } from 'app/site/domain/Acreditacion/deporte';

enum DialogType {
  Adicionar,
  Actualizar
}
@Component({
  selector: 'app-equipos',
  templateUrl: './save-equipo.component.html',
  styleUrls: ['./save-equipo.component.css'],
  providers: [DeporteService, ConjuntoService, ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class SaveEquipoComponent implements OnInit {
  tipos: SelectItem[];
  tipo: any;
  delegaciones: SelectItem[];
  deportes: SelectItem[];
  pruebas: SelectItem[];
  categorias: SelectItem[];
  tiposDeportes: SelectItem[];

  deporte: any;
  deporteId: number;
  delegacion: any;
  prueba: any;
  categoria: any;
  eventoId: number;
  tabla: any[];
  hideBorrar = false;
  EquipoId: 0;
  DeporteId: 0;
  disabledelegacion = true;
  disableequipo = true;
  disablesave = true;
  EsIndivudual: number;
  datoSeleccionado: any[];
  PruebaEventoId: number;

  generoOpcion = true;
  tipoOpcion = true;
  pruebaOpcion = true;
  tipoDeporteopcion = true;

  /*datos dropdown*/
  equipodescripcion: any;
  nombrecorto: any;
  display = false;
  msgs: Message[] = [];

  constructor(
    private deporteService: DeporteService,
    private route: ActivatedRoute,
    private conjuntoService: ConjuntoService,
    private router: Router,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private http: Http,
    private activedRoute: ActivatedRoute
  ) {
    this.delegacion = [];

    this.deporte = [];
    this.pruebas = [];
    this.pruebas.push({ label: 'Todas', value: 0 });
    this.categorias = [];
    this.categorias.push({ label: 'Seleccione Categorias', value: null });
    this.tiposDeportes = [];
    this.tiposDeportes.push({ label: 'Seleccione Tipo', value: null });

    this.tipos = [];
    this.tabla = [];

    this.eventoId = this.route.snapshot.params['eventoId'];

    this.prueba = 0;
    this.categoria = 0;
    this.delegacion = 0;
  }

  ngOnInit() {
    this.initDelegacion();
    this.doGetDeportes();
    this.clean();
    this.getData_storage();
  }
  private getData_storage() {
    try {
      const aux_data = JSON.parse(localStorage.getItem('nequipo'));
      this.PruebaEventoId = aux_data.PruebaEventoId;
      this.EquipoId = aux_data.EquipoId;
      this.deporte = aux_data.DeporteId;
      this.opcionDeporte(null);
      this.cargarTabla();
    } catch (error) { }
  }
  doGetDeportes() {
    this.deporteService.getDeportes(this.eventoId).then(res => {
      this.deportes = res.map(item => {
        return {
          value: item.DeporteId,
          label: item.DeporteDescripcion
        };
      });
    });
  }
  GetTipoDeportes() {
    this.tiposDeportes = [];
    this.deporteService.getTipos(this.eventoId, this.deporte).then(res => {
      res.forEach(item => {
        this.tiposDeportes.push({
          label: item.Detalle,
          value: item.EsIndivudual
        });
      });
    });
  }

  getCategorias() {
    this.categorias = [];
    this.deporteService
      .getRamas(this.eventoId, this.deporte, this.EsIndivudual, this.prueba)
      .then(res => {
        res.forEach(item => {
          this.categorias.push({
            label: item.Nombre,
            value: {
              value: item.ParametroRamaId,
              PruebaEventoId: item.PruebaEventoId
            }
          });
          console.log(item);
        });
      });
  }

  getPruebas() {
    this.pruebas = [];
    this.deporteService
      .getPruebas(this.eventoId, this.deporte, this.EsIndivudual)
      .then(res => {
        res.forEach(item => {
          this.pruebas.push({
            label: item.PruebaDescripcion,
            value: item.PruebaId
          });
        });
      });
  }

  opcionDeporte($event) {
    this.pruebaOpcion = true;
    this.tipoOpcion = true;
    this.tipoDeporteopcion = false;
    this.GetTipoDeportes();
    this.tabla = [];
    this.pruebas = [];
    this.categorias = [];
    this.delegacion = "";
    this.equipodescripcion = "";
    this.nombrecorto = "";

  }
  opcionTipo() {
    this.tipoOpcion = false;
    this.PruebaEventoId = this.categoria.PruebaEventoId;
    this.cargarTabla();
  }
  opcionTipoPrueba(event) {
    this.pruebaOpcion = false;
    let tipo = event.value;
    if(tipo === 0)
    {

      this.disabledelegacion = false;
      this.disableequipo = false;
      this.disablesave = false;
  
    }
    else{
    
      this.disabledelegacion = true;
      this.disableequipo= true;
      this.disablesave = true;
    }

    this.getPruebas();
  }
  opcionPrueba() {
    this.generoOpcion = false;
    this.getCategorias();
  }

  private initDelegacion() {
    this.conjuntoService.getDelegaciones(this.eventoId).then(res => {
      this.delegaciones = res
        .map(item => {
          return {
            value: item.DelegacionId,
            label: item.Nombre
          };
        })
        .sort((a, b) => String(a.label).localeCompare(String(b.label)));
    });
  }

  private cargarTabla() {
    this.conjuntoService.getEquiposPrueba(this.PruebaEventoId).then(res => {
      this.tabla = res;
    });
  }

  private save(editar: boolean) {
    if (
      Number(this.PruebaEventoId) > 0 &&
      String(this.equipodescripcion).trim() !== '' &&
      String(this.nombrecorto).trim() !== ''
    ) {
      const data = {
        EquipoId: editar ? this.EquipoId : 0,
        Equipo: this.equipodescripcion,
        Nombre: this.nombrecorto,
        DelegacionId: 0,//this.delegacion,
        PruebaId: this.prueba,
        ParametroRamaId: this.categoria.value,
        EventoId: this.eventoId,
        PruebaEventoId: this.PruebaEventoId
      };

      this.conjuntoService.SaveEquipoFrogDeportes(data).subscribe(res => {
        this.msgs = [];
        const resp = res.ok;
        let mensaje = 'Registro de equipo correcto';
        if (editar) {
          mensaje =
            'Edición de datos del equipo ' + this.EquipoId + ', satisfactoria';
        }

        if (resp) {
          this.msgs.push({
            severity: 'info',
            summary: 'Mensaje:',
            detail: mensaje
          });
          this.EquipoId = 0;
          this.cargarTabla();
          this.clean();
          localStorage.clear();
        } else {
          this.setError('Ocurrio un error en la edición de datos del equipo');
        }
      });
    } else {
      this.setError('Debe completar el formulario para registrar un grupo');
    }
  }

  private setError(texto) {
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: 'Error:',
      detail: texto
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
    this.EquipoId = this.datoSeleccionado['EquipoId'];
    this.equipodescripcion = this.datoSeleccionado['Equipo'];
    this.PruebaEventoId = this.datoSeleccionado['PruebaEventoId'];
    this.delegacion = this.datoSeleccionado['DelegacionId'];
  }
  getDeportes(deporte) {
    const consulta1 = this.deportes.filter(function (c) {
      return c.value === deporte;
    });
    return consulta1[0]['value'];
  }

  getTipos(tipo) {
    const consulta1 = this.tipos.filter(function (c) {
      return c.value === tipo;
    });
    return consulta1[0]['PruebaId'];
  }
  getRamas(rama) {
    const consulta1 = this.categorias.filter(function (c) {
      return c.label === rama;
    });
    return consulta1[0]['DeporteDescripcion'];
  }

  private clean() {
    this.msgs = [];
    this.hideBorrar = false;
    this.equipodescripcion = '';
    this.nombrecorto = '';
    this.tabla = [];
    this.deportes = [];
  }

  handleRowDblclickEquipo($event) {
    this.datoSeleccionado = $event.data;
    console.log(this.datoSeleccionado);

    localStorage.clear();
    localStorage.setItem('nequipo', JSON.stringify($event.data));

    this.router.navigate([
      '/master/inscripcionEquipos/' +
      this.eventoId +
      '/' +
      $event.data.EquipoId +
      '/' +
      $event.data.DeporteId +
      '/' +
      $event.data.DelegacionId
    ]);
  }

  showDialog(typeDialog: DialogType) {
    this.display = true;
  }

  edit() {
    if (Number(this.datoSeleccionado['EquipoId']) > 0) {
      this.datoSeleccionado = [];
      this.save(true);
      this.clean();
    }
  }

  eliminarRegistro() {
    if (Number(this.datoSeleccionado['EquipoId']) > 0) {
      this.confirmationService.confirm({
        message:
          'Desea eliminar el grupo ' + this.datoSeleccionado['Equipo'] + '?',
        accept: () => {
          this.conjuntoService
            .DeleteEquipo(Number(this.datoSeleccionado['EquipoId']))
            .subscribe(res => {
              this.EquipoId = 0;
              this.cargarTabla();
            });
        }
      });
    }
  }

  getDelegaciones(delegacion) {
    const consulta1 = this.delegaciones.filter(function (c) {
      return c.value === delegacion;
    });
    return consulta1[0]['value'];
  }
}
