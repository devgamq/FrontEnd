import { Component, OnInit } from '@angular/core';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem, Message } from 'primeng/primeng';
import { SimpleService } from '../../../service/simple/simple.service';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { JasperService } from '../../../service/Conjunto/jasper.service';
@Component({
  selector: 'app-medallero-conjunto',
  templateUrl: './medallero-conjunto.component.html',
  styleUrls: ['./medallero-conjunto.component.css'],
  providers: [SimpleService, DeporteService, ConfirmationService, JasperService]
})
export class MedalleroConjuntoComponent implements OnInit {
  eventoId: number;
  deportes: SelectItem[];
  categorias: any[];
  tipos: any[];
  datoSeleccionado: any[];
  medallas: SelectItem[];
  fases: SelectItem[];
  DatosGanadoresForm: FormGroup;
  cronogramas: SelectItem[];
  pruebas: SelectItem[];
  tiposDeportes: SelectItem[];
  parametroSucesos: SelectItem[];
  CronogramaId = 0;
  generoOpcion = true;
  tipoOpcion = true;
  faseOpcion = true;
  pruebaOpcion = true;
  cronogramaOpcion = true;
  tipoDeporteopcion = true;
  mostrarSuceso = false;
  msgs: Message[] = [];
  /*datos dropdown*/
  deporteId: number;
  parametroRamaId: number;
  parametroTipoId: number;
  parametroFaseId: number;
  pruebaId: number;
  EsIndivudual: number;
  ParametroSucesoId: number;
  estiloauto = 'inputInsertar';
  medalla: any;
  marca: any;
  puesto: any;
  ganador: any;
  tiempo: any;
  editar:any;
  /*equipos*/

  Equipos: any[];
  _Persona: any;
  clasificatorias: string[];
  ganadores: any[];
  hideBorrar = false;
  competidorId: number;
  mostrarDialogoPush: boolean = false;
  dataPush: any;
  lengthGrid: number;
  TitlePush: string;
  constructor(
    private simpleService: SimpleService,
    private deporteService: DeporteService,
    private JasperService: JasperService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.eventoId = this.route.snapshot.params['eventoId'];
    this.dataPush = { title: '', body: '' };
    this.editar = 0;
  }


  ngOnInit() {
    this.doGetDeportes();
    this.getMedallas();
    this.init_formulario();
    this.getTipos();

    this.fases = [];
    this.categorias = [];
    this.cronogramas = [];
    this.tiposDeportes = [];

    // this.getFases();
  }
  getCategorias() {
    this.categorias = [];
    this.deporteService
      .getRamas(this.eventoId, this.deporteId, this.EsIndivudual, this.pruebaId)
      .then(res => {
        res.forEach(item => {
          this.categorias.push({
            label: item.Nombre,
            value: item.ParametroRamaId
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
  }

  getTipos() {
    this.tipos = [];
    this.tipos.push({ label: 'Versus', value: 0 });
    this.tipos.push({ label: 'Medalla', value: 1 });
  }

  getFases() {
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
        this.deporteId,
        this.parametroRamaId,
        this.parametroTipoId,
        this.parametroFaseId,
        this.pruebaId
      )
      .then(res => {
        console.clear()
        console.log(res)
        res.forEach(item => {
          this.cronogramas.push({
            label:
              item.Fecha + ' ' + item.HoraProgramada + ' ' + item.Instalacion + ' ' + item.Descripcion,
            value: item.CronogramaId
          });
        });
      });
  }

  getPruebas() {
    this.pruebas = [];
    this.deporteService
      .getPruebas(this.eventoId, this.deporteId, this.EsIndivudual)
      .then(res => {
        res.forEach(item => {
          this.pruebas.push({
            label: item.PruebaDescripcion,
            value: item.PruebaId
          });
        });
      });
  }

  GetTipoDeportes() {
    this.tiposDeportes = [];

    this.deporteService.getTipos(this.eventoId, this.deporteId).then(res => {
      res.forEach(item => {
        this.tiposDeportes.push({
          label: item.Detalle,
          value: item.EsIndivudual
        });

      });
    });
  }

  GetParametrosSuceso() {
    this.parametroSucesos = [];
    this.parametroSucesos.push({ label: 'Seleccione Suceso', value: null });
    this.deporteService.getSucesosDeporte(this.deporteId).then(res => {
      res.forEach(item => {
        this.parametroSucesos.push({
          label: item.Parametro,
          value: item.ParametroSucesoId
        });
      });
    });
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


  doSelectSearchEquipo($event) {
    this.competidorId = $event.CompetidorId;
  }

  opcionDeporte() {
    this.getTipos();
    this.pruebaOpcion = true;
    this.tipoOpcion = true;
    this.faseOpcion = true;
    this.cronogramaOpcion = true;
    this.tipoDeporteopcion = false;
    this.generoOpcion = true;
    this.ganadores = [];
    this.pruebas = [];
    this.categorias = [];
    this.fases = [];
    this.cronogramas = [];


    this.GetTipoDeportes();
  }

  opcionTipoPrueba() {
    this.pruebaOpcion = false;
    // this.GetTipoDeportes;
    this.getPruebas();
  }
  opcionPrueba() {
    this.generoOpcion = false;
    this.getCategorias();
  }
  opcionTipo() {
    this.tipoOpcion = false;
    this.faseOpcion = true;
    this.cronogramaOpcion = true;
    this.ganadores = [];
    this.cronogramas = [];


    //this.getListaGanadores();
    this.GetParametrosSuceso();
  }
  opcionFases() {
    this.faseOpcion = false;
    this.cronogramaOpcion = true;
    this.getFases();
  }
  opcionCronograma() {
    this.cronogramaOpcion = false;
    this.getCronogramas();
  }
  opcionSucesoDeporte() {
    this.mostrarSuceso = true;
  }
  getCronogramaId() {
    this.getListaGanadores();
  }

  guardarGanadoresConjunto() {
    this.msgs = [];
    debugger;

    const ganador = {
      CronogramaId: this.CronogramaId,
      CompetidorId: this.competidorId,
      Posicion: this.DatosGanadoresForm.controls['Posicion'].value,
      Puntaje: 0,
      Marca: this.DatosGanadoresForm.controls['Marca'].value,
      Tiempo: this.DatosGanadoresForm.controls['Tiempo'].value,
      EsGanador: this.getGanador(this.DatosGanadoresForm.controls['EsGanador'].value),
      ParametroMedallaId: this.DatosGanadoresForm.controls['ParametroMedallaId'].value
    };



    this.simpleService.guardarGanador(ganador).subscribe(res => {
      const resp = res.json();
      if (resp) {


        this.DatosGanadoresForm.controls['EsGanador'].setValue('');
        this.DatosGanadoresForm.controls['Posicion'].setValue('');
        this.DatosGanadoresForm.controls['Marca'].setValue('');
        this.DatosGanadoresForm.controls['Tiempo'].setValue('');
        this.DatosGanadoresForm.controls['SearchPersona'].setValue('');
        this.DatosGanadoresForm.controls['ParametroMedallaId'].setValue(0);

   if(this.editar === 1){
    this.msgs.push({
      severity: 'success',
      summary: 'Exito!',
      detail: 'Se Editó con Exito'
    });

    this.editar = 0;
   }
   else{
    this.msgs.push({
      severity: 'success',
      summary: 'Exito!',
      detail: 'Registrado con Exito'
    });

    this.editar = 0;
   }
      

        this.getListaGanadores();
      
      } else {
        this.msgs.push({
          severity: 'danger',
          summary: 'Error!',
          detail: 'Error al registrar verifique los campos'
        });
      }
  
    });
  }

  private getGanador(valor) {

    if (valor === true) {
      return 1;

    }
    else {
      return 0;
    }

  }
  getListaGanadores() {
    const newClasificatorias = [];
    this.simpleService.getListaGanadores(this.CronogramaId).then(res => {

      this.clasificatorias = res;
      this.clasificatorias.forEach(item => {
        const row1: any = Object.assign(
          {},
          {
            CronogramaId: item['CronogramaId'],
            CompetidorId: item['CompetidorId'],
            '"PersonaId': item['PersonaId'],
            Nombre: item['Nombre'],
            CI: item['CI'],
            Delegacion: item['Delegacion'],
            Representacion: item['Representacion'],
            Posicion: item['Posicion'],
            Medalla: item['Medalla'],
            Tiempo: item['Tiempo'],
            Marca: item['Marca'],
            EsGanador: item['EsGanador'] === 0 ? 'No' : 'Si'
          }
        );
        newClasificatorias.push(row1);
      });

      this.ganadores = newClasificatorias;
      this.lengthGrid = this.ganadores.length;
    });
  }

  onRowSelect($event,c) {
debugger;
   this.editar = c;
    console.log($event.data)
    this.datoSeleccionado = [];
    this.hideBorrar = true;
    this.competidorId = $event.data.CompetidorId;
    this.datoSeleccionado = $event.data;

    this.cargarData();

  }

  private cargarData() {

    this._Persona = this.datoSeleccionado['Nombre'];

    this.medalla = this.devolverMedallla(this.datoSeleccionado['Medalla']);
    this.puesto = this.datoSeleccionado['Posicion'];
    this.tiempo = this.datoSeleccionado['Tiempo']
    this.marca = this.datoSeleccionado['Marca'];
    this.ganador = this.devolverGanador(this.datoSeleccionado['EsGanador']);




  }
  // this.DatosGanadoresForm.controls['SearchPersona'].setValue('');
  // this.DatosGanadoresForm.controls['ParametroMedallaId'].setValue(0);
  // this.DatosGanadoresForm.controls['Posicion'].setValue('');
  // this.DatosGanadoresForm.controls['Tiempo'].setValue('');
  // this.DatosGanadoresForm.controls['Marca'].setValue('');
  // this.DatosGanadoresForm.controls['EsGanador'].setValue(false);


  confirmDelete() {
    this.msgs = [];
    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar?',
      header: 'Eliminar Ganador',
      icon: 'fa fa-trash',
      accept: () => {
        this.simpleService
          .eliminarGanador(this.CronogramaId, this.competidorId)
          .subscribe(res => {
            const resp = res.json();
            if (resp) {
              this.msgs.push({
                severity: 'success',
                summary: 'Exito!',
                detail: 'eliminado con exito'
              });
              this.hideBorrar = false;
              this.getListaGanadores();
              this.editar = 0;
            } else {
              this.msgs.push({
                severity: 'danger',
                summary: 'Exito!',
                detail: 'error al eliminar'
              });
              this.editar = 0;
            }
          });

        this.DatosGanadoresForm.controls['SearchPersona'].setValue('');
        this.DatosGanadoresForm.controls['ParametroMedallaId'].setValue(0);
        this.DatosGanadoresForm.controls['Posicion'].setValue('');
        this.DatosGanadoresForm.controls['Tiempo'].setValue('');
        this.DatosGanadoresForm.controls['Marca'].setValue('');
        this.DatosGanadoresForm.controls['EsGanador'].setValue(false);


      }
    });
  }

  imprimirIndividuales() {
    this.JasperService.getIndividuales(
      this.eventoId,
      this.CronogramaId,
      this.deporteId,
      this.pruebaId,
      this.parametroRamaId
    ).then(res => {
      window.open(URL.createObjectURL(res));
    });
  }

  imprimirMedallero() {
    this.JasperService.getMedalleroDeporte(this.eventoId, this.deporteId).then(
      res => {
        window.open(URL.createObjectURL(res));
      }
    );
  }

  getPdfParametroSuceso() {
    this.JasperService.getPdfParametroSuceso(
      this.eventoId,
      this.deporteId,
      this.pruebaId,
      this.parametroRamaId,
      this.ParametroSucesoId
    ).then(res => {
      window.open(URL.createObjectURL(res));
    });
  }

  modificarRegistro() {
    this.DatosGanadoresForm.controls['SearchPersona'].setValue(
      this.datoSeleccionado['Nombre']
    );
    this.DatosGanadoresForm.controls['ParametroMedallaId'].setValue(
      this.devolverMedallla(this.datoSeleccionado['Medalla'])
    );
    this.DatosGanadoresForm.controls['Posicion'].setValue(
      this.datoSeleccionado['Posicion']
    );
    this.DatosGanadoresForm.controls['Tiempo'].setValue(
      this.datoSeleccionado['Tiempo']
    );
    this.DatosGanadoresForm.controls['Marca'].setValue(
      this.datoSeleccionado['Marca']
    );
    debugger;
    this.DatosGanadoresForm.controls['EsGanador'].setValue(
      this.devolverGanador(this.datoSeleccionado['EsGanador'])
    );
  }

  devolverMedallla(medalla) {
    if (medalla === 'ORO') {
      return 1;
    } else if (medalla === 'PLATA') {
      return 2;
    } else if (medalla === 'BRONCE') {
      return 3;
    } else {
      return 0;
    }
  }

  devolverGanador(ganador) {
    debugger;
    if (ganador === 'Si') {
      return 1;
    } else {
      return 0;
    }
  }

  getDatosNelson() {
    this.JasperService.getDatosNelson(
      this.eventoId,
      this.CronogramaId,
      this.deporteId,
      this.pruebaId,
      this.parametroRamaId
    ).then(res => {
      window.open(URL.createObjectURL(res));
    });
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

  DialogoPush() {
    try {
      const deporte = this.deportes.filter(item => Number(item.value) === Number(this.deporteId));
      const prueba = this.pruebas.filter(item => Number(item.value) === Number(this.pruebaId));
      const categoria = this.categorias.filter(item => Number(item.value) === Number(this.parametroRamaId));
      let winner = '';
      this.TitlePush = deporte[0].label;
      this.ganadores.forEach(ganador => {
        if (ganador.Medalla !== '' && ganador.Medalla !== null) {
          if (ganador.Delegacion === ganador.Nombre) {
            winner += `-${ganador.Medalla}: ${ganador.Delegacion} \n`;
          } else {
            winner += `-${ganador.Medalla}: ${ganador.Nombre} [${ganador.Delegacion}] \n`;
          }
        }
      });
      const data = {
        title: `${deporte[0].label} - ${prueba[0].label} - ${categoria[0].label}`,
        body: winner
      };
      this.dataPush = data;
      this.mostrarDialogoPush = true;
    } catch (error) {
      this.mostrarDialogoPush = true;
      this.TitlePush = 'Enviar Notificación';
    }
  }
  responseDialog($event) {
    switch ($event) {
      case -1:
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Información', detail: 'Llene los campos correctamente.' });
        break;
      case 0:
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Información', detail: 'Ocurrio un error al enviar el mensaje.' });
        break;
      case 1:
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Información', detail: 'Mensaje enviado correctamente.' });
        this.mostrarDialogoPush = false;
        break;
      case 2:
        this.mostrarDialogoPush = false;
        break;
    }
  }
}
