import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation, SimpleChanges
} from '@angular/core';
import { Injectable } from '@angular/core';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem, Message } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { SimpleService } from '../../../service/simple/simple.service';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { JasperService } from '../../../service/Conjunto/jasper.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { InputMaskModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { Competidor } from '../../../domain/widgets/competidor.type';
import { Jugador } from '../../../domain/widgets/jugador.type';
import { OrderListModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { SortMeta } from 'primeng/primeng';
import { Planilla } from '../../../domain/deportes/grupo/Planilla';
import { PlanillaPersona } from '../../../domain/deportes/grupo/PlanillaPersona';
import { RadioButtonModule } from 'primeng/primeng';
import { Util } from '../../../view/Futbol/util';


@Component({

  selector: 'app-nuevocronogramaindividual',
  templateUrl: './nuevo-cronograma-individual.component.html',
  styleUrls: ['./nuevo-cronograma-individual.component.css'],
  providers: [SimpleService, DeporteService, ConfirmationService, JasperService, ConjuntoService]
})
export class NuevoCronogramaIndividualComponent implements OnInit {

  @Output() NombrePersona = new EventEmitter();
  @Output() cronograma_seleccionado = new EventEmitter();
  @Input() servicioMostrar: string;
  @Input() mostrarNombre: boolean;
  @Input() Persona: any;
  @Input() _Persona: any;
  @Input() is_inscripcion = true;

  medallaId: number;
  medallaValor: any;
  NombreCompetidor: any;
  NombrePrueba: any;
  NombreRama: any;
  NombreDeporte: any;
  deportista: any;
  eventoId: number;
  setmarca: any;
  datoSeleccionado: any[];
  medallas: SelectItem[];
  isDisabled: Boolean;
  DatosGanadoresForm: FormGroup;
  Competidor: number;
  pruebas: SelectItem[];
  estados: SelectItem[];
  CronogramaId = 0;
  msgs: Message[] = [];
  selectedItems: any[];
  /*datos dropdown*/
  deporteId: number;
  EsIndivudual: number;
  estadoId: any;
  ParametroSucesoId: number;
  estiloauto = 'inputInsertar';
  seleccionganador: any[];
  seleccionrecord: any[];
  parametroRolId = 2;
  deportes: any[];
  cronogramaId: number;
  listaCronograma: any[];
  selectedValue: string;
  public medalla: SelectItem[];
  parametroestado: any[];
  esRecord: boolean;
  parametromedallaId: number;
  eselGanador: number;
  /*equipos*/
  Personas: any[];
  clasificatorias: string[];
  setTiempo: any;
  ganadores: any[];
  hideBorrar = false;
  competidorId: number;
  ganador: any[];
  record: any[];
  estadorecuperado: string;

  tipo_seleccion: string;
  Tiempo: string;

  constructor(
    private simpleService: SimpleService,
    private deporteService: DeporteService,
    private conjuntoService: ConjuntoService,
    private JasperService: JasperService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.eventoId = this.route.snapshot.params['eventoId'];
    this.deporteId = this.route.snapshot.params['deporteId'];
    this.cronogramaId = this.route.snapshot.params['CronogramaId'];
    this.NombrePrueba = this.route.snapshot.params['Prueba'];
    this.NombreRama = this.route.snapshot.params['Rama'];
    this.estadoId = this.route.snapshot.params['Estado'];





    this.init_formulario();

  }

  ngOnInit() {

    this.getMedallas();
    this.init_formulario();
    this.doGetDeportes();
    this.getListaGanadores();
    this.deportes = [];
    this.isDisabled = true;
    this.GetEstados();

  }

  getMedallas() {
    this.medallas = [];
    this.medallas.push({ label: 'NINGUNO', value: 'NINGUNO' });
    this.medallas.push({ label: 'ORO', value: 'ORO' });
    this.medallas.push({ label: 'PLATA', value: 'PLATA' });
    this.medallas.push({ label: 'BRONCE', value: 'BRONCE' });


  }

  doGetDeportes() {
    this.deporteService
      .getDeportes(this.eventoId)
      .then(res => {

        this.deportes = res;
        if (res.length > 0) {
          const nombre = res.filter(
            a => Number(a.DeporteId) === Number(this.deporteId)
          );
          this.NombreDeporte = nombre.length > 0 ? nombre[0].DeporteDescripcion : '';
        }
      });
  }


  UpdateEstado() {

    this.msgs = [];
    this.simpleService
      .UpdateEstadoCronograma(this.cronogramaId, this.estadoId)
      .subscribe(res => {
        const resp = res.json();
        if (resp) {
          this.msgs.push({
            severity: 'success',
            summary: 'Exito!',
            detail: 'modificado con exito'
          });
          this.hideBorrar = false;
          this.isDisabled = true;
          this.getListaGanadores();
        } else {
          this.msgs.push({
            severity: 'danger',
            summary: 'Exito!',
            detail: 'error al modificar'
          });
        }
      });
    this.isDisabled = true;
  }

  cambioValor(event, op) {


    console.log("eve", event);
    if (this.is_inscripcion) {
      this.msgs = [];
      // tslint:disable-next-line:prefer-const
      const competidorId = event.CompetidorId;
      const personaId = event.PersonaId;
      const posicion = event.Posicion;
      const sembrado = event.Sembrado;
      const tiempo = event.Tiempo;
      const marca = event.Marca;

      if (String(event.Medalla) === 'NINGUNO') {
        this.parametromedallaId = 0;
      }
      if (String(event.Medalla) === '') {
        this.parametromedallaId = 0;
      }

      if (String(event.Medalla) === 'ORO') {
        this.parametromedallaId = 1;
      }

      if (String(event.Medalla) === 'PLATA') {
        this.parametromedallaId = 2;
      }

      if (String(event.Medalla) === 'BRONCE') {
        this.parametromedallaId = 3;
      }


      if (op === 1) {
        if (Number(event.EsGanador) === 1) {
          this.eselGanador = 0;
        } else {
          this.eselGanador = 1;
        }

        this.esRecord = event.EsRecord;
      }
      else {
        if (Boolean(event.EsRecord) === false) {
          this.esRecord = true;
        } else {
          this.esRecord = false;
        }
        this.eselGanador = event.EsGanador;
      }



      if (String(event.Marca) === "null") {
        this.setmarca = Number(event.Marca);
      }
      else {
        this.setmarca = event.Marca;
      }



      this.simpleService
        .SaveMedallero(
          this.cronogramaId,
          competidorId,
          posicion,
          this.parametromedallaId,
          sembrado,
          tiempo,
          this.setmarca,
          this.eselGanador,
          this.esRecord
        )
        .subscribe(res => {
          const resp = res.json();
          if (resp) {
            this.msgs.push({
              severity: 'success',
              summary: 'Exito',
              detail: 'Se agrego correctamente el registro'
            });
            this.getListaGanadores();
          } else {
            this.msgs.push({
              severity: 'danger',
              summary: 'Error',
              detail: 'Error al guardar el registro'
            });
          }
        });
    } else {
      this.cronograma_seleccionado.emit(event);
    }
  }
  private normalizarMedalla(medalla: string) {
    switch (medalla) {
      case 'ORO': this.medallaId = 1; break;
      case 'PLATA': this.medallaId = 2; break;
      case 'BRONCE': this.medallaId = 3; break;
      default: this.medallaId = 0; break;
    }
  }
  guardarIndivisual(event, c) {

    this.msgs = [];
    const posicion = event.Posicion;
    const competidorId = event.CompetidorId;
    this.Competidor = this.competidorId;
    const sembrado = event.Sembrado;
    const tiempo = event.Tiempo;
    const marca = event.Marca;
    const esganador = event.EsGanador;
    const essrecord = event.EsRecord;


    if (String(event.Medalla) === 'NINGUNO') {
      this.parametromedallaId = 0;
    }
    if (String(event.Medalla) === '') {
      this.parametromedallaId = 0;
    }

    if (String(event.Medalla) === 'ORO') {
      this.parametromedallaId = 1;
    }

    if (String(event.Medalla) === 'PLATA') {
      this.parametromedallaId = 2;
    }

    if (String(event.Medalla) === 'BRONCE') {
      this.parametromedallaId = 3;
    }


    if (c === 1) {
      if (Number(event.EsGanador) === 1) {
        this.eselGanador = 0;
      } else {
        this.eselGanador = 1;
      }

      this.esRecord = event.EsRecord;
    } else {
      if (Boolean(event.EsRecord) === false) {
        this.esRecord = true;
      } else {
        this.esRecord = false;
      }
      this.eselGanador = event.EsGanador;
    }


    if (String(event.Marca) === "null") {
      this.setmarca = Number(event.Marca);
    } else {
      this.setmarca = event.Marca;
    }

    if (String(event.Tiempo) === "null") {
      this.setTiempo = "00:00:00.000";
    } else {
      this.setTiempo = event.Tiempo;
    }


    this.guardarCompetidorCronograma(
      this.cronogramaId,
      competidorId,
      posicion,
      this.parametromedallaId,
      sembrado,
      tiempo,
      this.setmarca,
      esganador,
      essrecord
    );


  }



  guardarCompetidorCronograma(
    cronogramaId,
    competidorId,
    posicion,
    parametromedallaId,
    sembrado,
    tiempo,
    marca,
    esGanador,
    esRecord
  ) {
    this.simpleService
      .SaveMedallero(
        this.cronogramaId,
        competidorId,
        posicion,
        parametromedallaId,
        sembrado,
        tiempo,
        marca,
        esGanador,
        esRecord
      )
      .subscribe(res => {
        const resp = res.json();
        if (resp) {
          this.msgs.push({
            severity: 'success',
            summary: 'Exito',
            detail: 'Se agrego correctamente el registro'
          });






        } else {
          this.msgs.push({
            severity: 'danger',
            summary: 'Error',
            detail: 'Error al guardar el registro'
          });
        }
      });
  }


  GetEstados() {

    const parametro = 11;
    this.deporteService.getEstados(parametro).then(res => {

      this.estados = res.map(item => {
        return {
          value: item.ParametroId,
          label: item.ParametroDescripcion,

        };

      });

    });
  }


  doSearchPersonas(event) {
    const search = event.query;
    this.simpleService.busquedaCompetidorSimple(search, this.cronogramaId).then(res => {
      console.log(this.CronogramaId);
      this.Personas = res;
    });

  }


  doSelectSearchPersona($event) {
    this.competidorId = $event.CompetidorId;
    this.Persona = this._Persona;
  }


  init_formulario() {
    this.DatosGanadoresForm = this.formBuilder.group({
      SearchPersona: ['', Validators.compose([Validators.required])],
      Posicion: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      Marca: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      Sembrado: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      Tiempo: [''],
      EsGanador: [false],
      EsRecord: [''],
      ParametroMedallaId: [''],
    });
  }





  getCronogramaId() {
    this.getListaGanadores();
  }

  private clean() {
    this.medallaId = 0;
    this.medallaValor = '';
  }

  guardarGanadoresConjunto() {
    this.normalizarMedalla(this.medallaValor);
    this.msgs = [];

    const ganador = {
      CronogramaId: this.cronogramaId,
      CompetidorId: this.competidorId,
      Posicion: this.DatosGanadoresForm.controls['Posicion'].value,
      Puntaje: 0,
      Marca: this.DatosGanadoresForm.controls['Marca'].value,
      Tiempo: this.DatosGanadoresForm.controls['Tiempo'].value,
      EsGanador: this.DatosGanadoresForm.controls['EsGanador'].value,
      ParametroMedallaId: this.medallaId,
      Sembrado: this.DatosGanadoresForm.controls['Sembrado'].value


    };

    if (ganador.EsGanador === undefined) {
      this.eselGanador = 0;
    }
    if (ganador.EsGanador === true) {
      this.eselGanador = 1;
    }
    if (ganador.EsGanador === false) {
      this.eselGanador = 0;
    }


    ganador.EsGanador = this.eselGanador;

    const tamañocadena = ganador.Tiempo.length;
    let tiempoactual = '';
    const cadena = ganador.Tiempo;
    for (let i = 0; i < tamañocadena; i++) {
      const caracter = cadena.charAt(i);

      if (caracter !== '_') {
        tiempoactual = tiempoactual + caracter;
      } else {

        tiempoactual = tiempoactual + '0';

      }

    }

    ganador.Tiempo = tiempoactual;


    if (this.competidorId === undefined || String(ganador.Posicion) === '') {

      this.msgs.push({
        severity: 'information',
        summary: 'Error!',
        detail: 'Competidor y Puesto son requeridos'
      });


    } else {

      this.simpleService.guardarGanador(ganador).subscribe(res => {
        const resp = res.json();

        if (resp) {

          this.msgs.push({
            severity: 'success',
            summary: 'Exito!',
            detail: 'Registrado con Exito'
          });
          this.getListaGanadores();
        } else {
          this.msgs.push({
            severity: 'danger',
            summary: 'Error!',
            detail: 'Error al registrar verifique los campos'
          });
        }
        this.clean();
      });
    }
    this.init_formulario();

  }

  getListaGanadores() {
    const newClasificatorias = [];
    this.simpleService.getListaGanadores(this.cronogramaId).then(res => {
      this.clasificatorias = res;
      this.clasificatorias.forEach(item => {

        const row1: any = Object.assign(
          {},
          {
            CronogramaId: item['CronogramaId'],
            CompetidorId: item['CompetidorId'],
            PersonaId: item['PersonaId'],
            Nombre: item['Nombre'],
            Delegacion: item['Delegacion'],
            Posicion: item['Posicion'],
            Medalla: item['Medalla'],
            Tiempo: item['Tiempo'],
            Marca: item['Marca'],
            isInscripcion: this.is_inscripcion,
            Sembrado: item['Sembrado'],
            EsGanador: item['EsGanador'],
            EsRecord: item['EsRecord'],
            Estado: item['Estado']


          }
        );
        newClasificatorias.push(row1);


      });
      this.ganadores = newClasificatorias;

      if (this.is_inscripcion) {
        this.tipo_seleccion = 'multiple';
        this.seleccionganador = this.ganadores.filter(function (c) {
          return c.EsGanador === 1;
        });
        this.ganador = this.seleccionganador.map(item => {
          return '' + item.EsGanador;
        });
      } else {
        this.tipo_seleccion = 'single';
        this.seleccionganador = [];
      }

      if (this.is_inscripcion) {
        this.tipo_seleccion = 'multiple';
        this.seleccionrecord = this.ganadores.filter(function (c) {
          return c.EsRecord === true;
        });


        this.record = this.seleccionrecord.map(item => {
          return '' + item.EsRecord;
        });
      } else {
        this.tipo_seleccion = 'single';
        this.seleccionrecord = [];

      }

    });
  }

  HabilitarEstado() {
    this.isDisabled = false;
  }

  handleRowDblclick($event) {

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


    this.NombreCompetidor = $event.data.Nombre;
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

  confirmDelete(event) {
    let Cronogramas = event.CronogramaId;
    let Competidores = event.CompetidorId;



    this.msgs = [];
    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar? ',
      header: 'Eliminar Competidor ',
      icon: 'fa fa-trash',
      accept: () => {
        this.simpleService
          .eliminarGanador(Cronogramas, Competidores)
          .subscribe(res => {
            const resp = res.json();
            if (resp) {
              this.msgs.push({
                severity: 'success',
                summary: 'Exito!',
                detail: 'eliminado con exito'
              });
              this.getListaGanadores();
              this.hideBorrar = false;
              this.getListaGanadores();
            } else {
              this.msgs.push({
                severity: 'danger',
                summary: 'Exito!',
                detail: 'error al eliminar'
              });
              this.getListaGanadores();
            }
          });
      },
      reject: () => {
        this.hideBorrar = false;
        // this.hideBorrar = false;
      }
    });
  }
  atras() {

    this.router.navigate(['master/individual/' + this.eventoId + '/' + this.deporteId]);
  }
}
