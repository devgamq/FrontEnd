import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { SimpleService } from '../../../service/simple/simple.service';
import { Suceso } from '../../../domain/deportes/grupo/Suceso';
import { CheckboxModule } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { DataTableModule, SharedModule, DataTable } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ButtonModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { MenuItem, GrowlModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'app-deportes-individual',
  templateUrl: './deportes-individual.component.html',
  styleUrls: ['./deportes-individual.component.css'],
  providers: [SimpleService, ConfirmationService, DeporteService]
})
export class DeportesIndividualComponent implements OnInit {
  DatosGanadoresForm: FormGroup;
  pruebas: SelectItem[];
  tipos: SelectItem[];
  categorias: SelectItem[];
  medallas: SelectItem[];
  fases: SelectItem[];
  _Persona: any;
  ganadores: any[];
  hideBorrar = false;
  msgs: Message[] = [];
  @Input() Persona: any;

  competidorId: number;
  CronogramaId = 0;
  selectedfases: number;
  selectedpruebas: number;
  selectedcategorias: number;

  clasificatorias: string[];
  datoSeleccionado: any[];
  eventoId: number;
  deporteId: number;
  deportes: any[];
  nombreDeporte: string;
  pruebaId: number;
  estiloauto = 'inputInsertar';

  selectedmedalla: string;
  url: any[];
  Personas: any[];

  muestraRegistro = true;

  constructor(private simpleService: SimpleService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private deporteService: DeporteService, private activedRoute: ActivatedRoute) {
    this.url = [];
    this.getMedallas();
    this.init_formulario();

    router.events.forEach((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.url = [];
        this.url = event.url.split('/');
        if (this.url.length > 4) {
          if (this.url[2] === 'individual') {
            const pagina = this.url[2];
            this.eventoId = this.url[3]
            this.deporteId = this.url[4];
            this.initValores();
          }

        }
      }
    });
  }
  private initValores() {
    this.clean();
    this.getPruebas();
    this.doGetDeportes();

  }
  ngOnInit() {
    this.eventoId = this.route.snapshot.params['eventoId'];
    this.deporteId = this.route.snapshot.params['deporteId'];

    this.initValores();
  }
  private clean() {
    this.ganadores = [];
    this.categorias = [];
    this.pruebas = [];
  }
  init_formulario() {

    this.DatosGanadoresForm = this.formBuilder.group({
      SearchPersona: ['', Validators.compose([Validators.required])],
      Posicion: ['', Validators.compose([Validators.required])],
      Marca: [''],
      Tiempo: [''],
      EsGanador: [''],
      ParametroMedallaId: ['']
    });
  }

  /*Nombre deporte */

  doGetDeportes() {
    this.deporteService
      .getDeportes(this.eventoId)
      .then(res => {

        this.deportes = res;
        if (res.length > 0) {
          const nombre = res.filter(
            a => Number(a.DeporteId) === Number(this.deporteId)
          );
          this.nombreDeporte = nombre.length > 0 ? nombre[0].DeporteDescripcion : '';
        }
      });
  }

  getPruebas() {
    this.pruebas = [];
    this.deporteService.getPruebas(this.eventoId, this.deporteId, 1).then(res => {
      res.sort((a, b) =>
        String(a.PruebaDescripcion).localeCompare(
          String(b.PruebaDescripcion)
        )
      ).forEach(item => {
        this.pruebas.push({ label: item.PruebaDescripcion, value: item.PruebaId });
      });
    });
  }

  seleccionarPrueba() {
    this.pruebaId = this.selectedpruebas;
    this.getCategorias();
  }

  getTipos() {
    this.tipos = [];
    this.tipos.push({ label: 'Individual', value: 1 });
  }

  getCategorias() {
    this.categorias = [];
    this.deporteService.getRamas(this.eventoId, this.deporteId, 1, this.pruebaId).then(res => {
      res.forEach(item => {
        this.categorias.push({ label: item.Nombre, value: item.ParametroRamaId });
      });
    });

  }

  seleccionarCategorias() {
    this.getFases();
  }

  getFases() {
    this.fases = [];
    this.deporteService.getRamaFases(this.eventoId, this.pruebaId, this.selectedcategorias).then(res => {
      res.forEach(item => {
        const f = new Date(item.Fecha);
        this.fases.push({
          label: item.Fase + ' ' + f.getDate() + '/' + (f.getMonth() + 1) + '/' +
            f.getFullYear() + ' ' + item.HoraProgramada, value: item.CronogramaId
        });
      });
    });

  }

  getMedallas() {
    this.medallas = [];
    this.medallas.push({ label: 'NINGUNO', value: 0 });
    this.medallas.push({ label: 'ORO', value: 1 });
    this.medallas.push({ label: 'PLATA', value: 2 });
    this.medallas.push({ label: 'BRONCE', value: 3 });

    this.selectedmedalla = 'NINGUNO';
  }

  doSearchPersonas(event) {
    const search = event.query;
    this.simpleService.busquedaCompetidorSimple(search, this.CronogramaId).then(res => {
      console.log(this.CronogramaId);
      this.Personas = res;
    });

  }
  doSelectSearchPersona($event) {
    this.competidorId = $event.CompetidorId;
    this.Persona = this._Persona;
  }

  getListaGanadores() {
    const newClasificatorias = [];
    this.simpleService.getListaGanadores(this.CronogramaId).then(res => {
      this.clasificatorias = res;
      this.clasificatorias.forEach(item => {
        const row1: any = Object.assign({}, {
          'CronogramaId': item['CronogramaId'],
          'CompetidorId': item['CompetidorId'],
          '"PersonaId': item['PersonaId'],
          'Nombre': item['Nombre'],
          'CI': item['CI'],
          'Delegacion': item['Delegacion'],
          'Representacion': item['Representacion'],
          'Posicion': item['Posicion'],
          'Medalla': item['Medalla'],
          'Tiempo': item['Tiempo'],
          'Marca': item['Marca'],
          'EsGanador': item['EsGanador'] === 0 ? 'No' : 'Si'
        });
        newClasificatorias.push(row1);
      });

      this.ganadores = newClasificatorias;
    });

  }

  onRowSelect($event) {
    this.datoSeleccionado = [];
    this.hideBorrar = true;
    this.competidorId = $event.data.CompetidorId;
    this.datoSeleccionado = $event.data;
    this.DatosGanadoresForm.controls['SearchPersona'].setValue('');
    this.DatosGanadoresForm.controls['ParametroMedallaId'].setValue(0);
    this.DatosGanadoresForm.controls['Posicion'].setValue('');
    this.DatosGanadoresForm.controls['Tiempo'].setValue('');
    this.DatosGanadoresForm.controls['Marca'].setValue('');
    this.DatosGanadoresForm.controls['EsGanador'].setValue(false);

  }

  confirmDelete() {
    this.msgs = [];
    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar?',
      header: 'Eliminar Ganador',
      icon: 'fa fa-trash',
      accept: () => {

        this.simpleService.eliminarGanador(this.CronogramaId, this.competidorId).subscribe(res => {
          const resp = res.json();
          if (resp) {
            this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'eliminado con exito' });
            this.hideBorrar = false;
            this.getListaGanadores();
          } else {
            this.msgs.push({ severity: 'danger', summary: 'Exito!', detail: 'error al eliminar' });
          }
        });
      }
    });
  }
  doSetUsuario() {
    this.msgs = [];
    const ganador = {
      CronogramaId: this.CronogramaId,
      CompetidorId: this.competidorId,
      Posicion: this.DatosGanadoresForm.controls['Posicion'].value,
      Puntaje: 0,
      Marca: this.DatosGanadoresForm.controls['Marca'].value,
      Tiempo: this.DatosGanadoresForm.controls['Tiempo'].value,
      EsGanador: this.DatosGanadoresForm.controls['EsGanador'].value,
      ParametroMedallaId: this.DatosGanadoresForm.controls['ParametroMedallaId'].value
    };

    this.simpleService.guardarGanador(ganador).subscribe(res => {
      const resp = res.json();
      if (resp) {
        this.DatosGanadoresForm.controls['Marca'].setValue('');
        this.DatosGanadoresForm.controls['Tiempo'].setValue('');
        this.DatosGanadoresForm.controls['EsGanador'].setValue('');
        this.DatosGanadoresForm.controls['Posicion'].setValue('');
        this.DatosGanadoresForm.controls['SearchPersona'].setValue('');
        this.DatosGanadoresForm.controls['ParametroMedallaId'].setValue(0);

        this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Registrado con Exito' });
        this.getListaGanadores();
      } else {
        this.msgs.push({ severity: 'danger', summary: 'Error!', detail: 'Error al registrar verifique los campos' });
      }
    });

  }

  seleccionarFase() {
    this.CronogramaId = this.selectedfases;
    this.getListaGanadores();
  }

  modificarRegistro() {

    this.DatosGanadoresForm.controls['SearchPersona'].setValue(this.datoSeleccionado['Nombre']);
    this.DatosGanadoresForm.controls['ParametroMedallaId'].setValue(this.devolverMedallla(this.datoSeleccionado['Medalla']));
    this.DatosGanadoresForm.controls['Posicion'].setValue(this.datoSeleccionado['Posicion']);
    this.DatosGanadoresForm.controls['Tiempo'].setValue(this.datoSeleccionado['Tiempo']);
    this.DatosGanadoresForm.controls['Marca'].setValue(this.datoSeleccionado['Marca']);
    this.DatosGanadoresForm.controls['EsGanador'].setValue(this.devolverGanador(this.datoSeleccionado['EsGanador']));

  }

  devolverMedallla(medalla) {
    if (medalla === 'ORO') {
      return 1;
    } else
      if (medalla === 'PLATA') {
        return 2;
      } else
        if (medalla === 'BRONCE') {
          return 3;
        } else {
          return 0;
        }
  }
  devolverGanador(ganador) {
    if (ganador === 'Si') {
      return true;
    } else {
      return false;
    }
  }

}
