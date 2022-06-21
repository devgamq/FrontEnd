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
import { SplitButtonModule, MenuItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-cronograma-conjunto',
  templateUrl: './cronograma-conjunto.component.html',
  styleUrls: ['./cronograma-conjunto.component.css'],
  providers: [ConjuntoService, ConfirmationService, JasperService, DeporteService]
})
export class CronogramaConjuntoComponent implements OnInit {
  language: any;
  encuentros: Cronograma[];
  elex:Cronograma;
  fecha: Date;
  minDate: Date;
  maxDate: Date;
  vista: Encuentro[];
  
  cronogramaaux: any[];
  encuentroSeleccionado: Encuentro;
  planillaaux: any[];

  planilla: Planilla;
  @Input() deporteId: number;
  public disableComboDeportes = false;
  PlanillaId: number;
  evento: Evento;
  mostrarResumen: boolean;
  @Input() eventoId: number;
  cronogramaId: number;
  PlanillaForm: FormGroup;
  vButton = false;
  currentData: any;
  url: any[];
  tipo = 0;
  nombreDeporte = '';
  disabledplanilla = true;
  mostrarDialogoPush: boolean = false;
  dataPush: any;
  msgs: Message[] = [];
  TitlePush: any;
  constructor(
    private conjuntoService: ConjuntoService,
    private JasperService: JasperService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private deporteService: DeporteService,
    private formBuilder: FormBuilder
  ) {

    this.fecha = new Date();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.planilla = new Planilla();
    this.evento = new Evento();
    this.language = config.es;
    this.encuentros = [];
    this.vista = [];
    this.cronogramaaux = [];
    this.url = [];

    this.encuentroSeleccionado = new Encuentro();

    router.events.forEach((event: NavigationEvent) => {

      if (event instanceof NavigationStart) {
        this.url = [];
        this.url = event.url.split('/');
        if (this.url.length > 4) {
          if (this.url[2] === 'cronograma') {
            const pagina = this.url[2];
            this.eventoId = this.url[3];
            this.deporteId = this.url[4];
            this.tipo = this.url[5];
            this.initValores();
          }
        }
      }
    });
    this.dataPush = { title: '', body: '' };
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
    this.init_formulario();
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

    //debugger;

    this.conjuntoService
      .GetProgramacionConjunto(this.eventoId, deporteId, this.fecha, 0)
      .then(res => {
        this.encuentros = res;
        console.log(res)
        
        this.vista = res.map(item => {
          return {

            Hora:
              this.lpad(
                '0',
                2,
                String(new Date('1968-11-16T' + item.HoraProgramada).getHours())
              ) +
              ':' +
              this.lpad(
                '0',
                2,
                String(
                  new Date('1968-11-16T' + item.HoraProgramada).getMinutes()
                )
              ),
            EquipoA: item.EquipoA == null ? '' : item.EquipoA,
            EquipoB: item.EquipoB == null ? '' : item.EquipoB,
            Escenario: item.Instalacion,
            // Estado:
            //   item.MarcadorEquipoA == null || item.MarcadorEquipoB == null
            //     ? 'Abierto'
            //     : item.Estado,
            Estado:item.Estado,
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
            Fase: item.Fase,
            Descripcion: item.Descripcion,
            Area:item.Area
          };
        });
      });


  }

  GetGenero(id) {
    return this.conjuntoService.GetCategoria(3).then(q => {
      return q[0].Categoria;
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
        // this.handleRowDblclick(this.currentData);
        this.handleRowDblclick(this.currentData);
      }
    } catch (error) { }
  }





  MostrarPlanilla($event) {

    this.encuentroSeleccionado = $event;
    const data = JSON.stringify($event);
    localStorage.setItem('encuentro', data);
    this.conjuntoService
      .getPlanilla(this.encuentroSeleccionado.CronogramaId)
      .then(res => {
        const auxPlanilla = res[0];

        if (auxPlanilla == null) {

          this.disabledplanilla = true;

        } else {

          this.disabledplanilla = false;
          this.planilla = auxPlanilla;
          this.encuentroSeleccionado.PlanillaEstado = this.planilla.Estado;

          if (this.encuentroSeleccionado.PlanillaEstado === 0) {

            const json = this.getJSONPlanilla();
            const dataPlanilla = JSON.stringify(json);

            localStorage.setItem('planilla', dataPlanilla);

            this.router.navigate([
              'master/planilla/' +
              this.eventoId +
              '/' +
              this.deporteId +
              '/' +
              this.planilla.PlanillaId +
              '/' +
              this.tipo
            ]);

          } else {
            const json = this.getJSONPlanilla();
            const dataPlanilla = JSON.stringify(json);
            localStorage.setItem('planilla', dataPlanilla);
            this.router.navigate(['master/planilla/' + this.eventoId + '/' + this.deporteId + '/' + this.planilla.PlanillaId
              + '/' + this.tipo]);
          }
        }
      });


  }

  handleRowDblclick($event) {

    this.encuentroSeleccionado = $event.data;
    const data = JSON.stringify($event);
    console.log('datos a guardar',$event)
    localStorage.setItem('encuentro', data);
    let cc: number;
    cc= $event.data.CronogramaId;
    console.log('Elegido es',cc);
/////////////////////////////////////
    this.elex=this.encuentros.find(Cro=> Cro.CronogramaId==cc);
    const datas = JSON.stringify(this.elex);
    console.log('Elegido',this.elex)
    localStorage.setItem('elegido',datas);
/////////////////////////////////////    
    this.conjuntoService
      .getPlanilla(this.encuentroSeleccionado.CronogramaId)
      .then(res => {
        const auxPlanilla = res[0];

        if (auxPlanilla == null) {
          this.confirmationService.confirm({
            message: 'Desea crear la plantilla?',
            accept: () => {
              this.save(this.encuentroSeleccionado, data);
            }
          });
        } else {
          this.planilla = auxPlanilla;
          this.encuentroSeleccionado.PlanillaEstado = this.planilla.Estado;
          if (this.encuentroSeleccionado.PlanillaEstado === 0) {
            const json = this.getJSONPlanilla();
            const dataPlanilla = JSON.stringify(json);
            localStorage.setItem('planilla', dataPlanilla);
            this.router.navigate([
              'master/planilla/' +
              this.eventoId +
              '/' +
              this.deporteId +
              '/' +
              this.planilla.PlanillaId +
              '/' +
              this.tipo
            ]);
          } else {
            this.router.navigate([
              'master/' +
              this.deporteId +
              '/' +
              this.encuentroSeleccionado.CompetidorAId +
              '/' +
              this.encuentroSeleccionado.CompetidorBId +
              '/' +
              this.planilla.PlanillaId +
              '/' +
              this.encuentroSeleccionado.EventoId +
              '/' +
              this.deporteId +
              '/' +
              this.tipo
            ]);
          }
        }
      });
  }

  private cargarPersonalApoyo() {
    this.conjuntoService
      .GetPlanillaPersonasApoyo(
        this.encuentroSeleccionado.CompetidorAId,
        this.planilla.PlanillaId,
        0
      )
      .then(res => {
        if (res.length > 0) {
          const asistente = res.filter(item => item.ParametroRolId === 3)[0];
          const log = this.initPersonaApoyo(asistente);
          localStorage.setItem(
            '3' + this.encuentroSeleccionado.CompetidorAId,
            JSON.stringify(log)
          );
        }
      });
  }
  private initPersonaApoyo(persona: PlanillaPersona) {
    return {
      PersonaId: persona.PersonaId,
      NombreCompleto: persona.Persona.NombreCompleto,
      Paterno: persona.Persona.Paterno,
      Materno: persona.Persona.Materno,
      Nombres: persona.Persona.Nombres,
      DocumentoIdentidad: persona.Persona.DocumentoIdentidad
    };
  }
  private lpad(caracter: string, length: number, texto: string) {
    while (texto.length < length) {
      texto = caracter + texto;
    }
    return texto;
  }
  private getJSONPlanilla() {
    return {
      PlanillaId: this.planilla.PlanillaId,
      CronogramaId: this.planilla.CronogramaId,
      Fecha: this.planilla.Fecha,
      HoraFin: this.planilla.HoraFin,
      HoraInicio: this.planilla.HoraInicio,
      SistemaEquipoA: this.planilla.SistemaEquipoA,
      SistemaEquipoB: this.planilla.SistemaEquipoB,
      Estado: this.planilla.Estado
    };
  }
  private initPlanilla(encuentro: Encuentro) {
    this.planilla.CronogramaId = this.encuentroSeleccionado.CronogramaId;
    const mes = this.fecha.getMonth() + 1;
    const fechaStr =
      this.fecha.getFullYear() + '/' + mes + '/' + this.fecha.getDate();
    this.planilla.Fecha = this.fecha;
    this.planilla.HoraFin = this.encuentroSeleccionado.HoraFin;
    this.planilla.HoraInicio = this.encuentroSeleccionado.HoraInicio;
    this.planilla.SistemaEquipoA = '';
    this.planilla.SistemaEquipoB = '';
    this.planilla.Estado = 0;

    const foo = this.getJSONPlanilla();
    return foo;
  }
  private init_formulario() {
    this.PlanillaForm = this.formBuilder.group({
      PlanillaId: [''],
      CronogramaId: [''],
      Fecha: [''],
      HoraFin: [''],
      HoraInicio: [''],
      SistemaEquipoA: [''],
      SistemaEquipoB: [''],
      Estado: ['']
    });
  }
  private save(encuentro: Encuentro, data: string) {
    this.PlanillaForm.controls['PlanillaId'].setValue('0');
    this.PlanillaForm.controls['CronogramaId'].setValue(
      this.encuentroSeleccionado.CronogramaId
    );
    this.PlanillaForm.controls['Fecha'].setValue(this.fecha);
    this.PlanillaForm.controls['HoraFin'].setValue(
      this.encuentroSeleccionado.HoraFin
    );
    this.PlanillaForm.controls['HoraInicio'].setValue(
      this.encuentroSeleccionado.HoraInicio
    );
    this.PlanillaForm.controls['SistemaEquipoA'].setValue('');
    this.PlanillaForm.controls['SistemaEquipoB'].setValue('');
    this.PlanillaForm.controls['Estado'].setValue(0);

    this.conjuntoService.savePlanilla(this.PlanillaForm).subscribe(res => {
      this.planilla.PlanillaId = Number(res.json());

      const auxPlanilla = this.initPlanilla(this.encuentroSeleccionado);
      const dataPlanilla = JSON.stringify(auxPlanilla);

      localStorage.setItem('encuentro', data);
      localStorage.setItem('planilla', dataPlanilla);
      this.router.navigate([
        'master/planilla/' +
        this.eventoId +
        '/' +
        this.deporteId +
        '/' +
        this.planilla.PlanillaId +
        '/' +
        this.tipo
      ]);
    });
  }

  programacionDia() {
    const fecha_actual =
      this.fecha.getFullYear() +
      '-' +
      (this.fecha.getMonth() + 1) +
      '-' +
      this.fecha.getDate();
    this.JasperService.getProgramacion(
      this.eventoId,
      this.deporteId,
      fecha_actual
    ).then(res => {
      window.open(URL.createObjectURL(res));
    });
  }

  resumenPartido() {
    this.JasperService.getResumenPartido(
      this.eventoId,
      this.deporteId,
      this.cronogramaId
    ).then(res => {
      window.open(URL.createObjectURL(res));
    });
  }

  tablaPosiciones() {
    this.JasperService.getTablaPosicion(this.eventoId, this.deporteId).then(
      res => {
        window.open(URL.createObjectURL(res));
      }
    );
  }

  tablaMedallero() {
    this.JasperService.getMedalleroGeneral(this.eventoId).then(res => {
      window.open(URL.createObjectURL(res));
    });
  }
  tablaMedalleroEvento() {
    const fecha_actual =
      this.fecha.getFullYear() +
      '-' +
      (this.fecha.getMonth() + 1) +
      '-' +
      this.fecha.getDate();
    this.JasperService.getMedalleroEvento(this.eventoId, fecha_actual).then(
      res => {
        window.open(URL.createObjectURL(res));
      }
    );
  }
  getColor(estado) {
    if (estado === 'Abierto') {
      return 'green';
    } else if (estado === 'Concluido') {
      return 'red';
    } else if (estado === 'Suspendido') {
      return 'indigo';
    } else {
      return 'Orange';
    }
  }

  mostrarBotonResumen($event) {
    this.cronogramaId = $event.data.CronogramaId;
    this.mostrarResumen = true;

    const userAgent = navigator.userAgent || navigator.vendor;

    this.currentData = $event;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.vButton = true;
    } else {
      this.vButton = false;
    }
  }
  DialogoPush(car) {
    console.log(car);
    const data = {
      title: `${this.nombreDeporte} - ${car['Genero']}`,
      body: `${car['EquipoA']}  [${car['Puntuacion']}]  ${car['EquipoB']}`
    };
    this.dataPush = data;
    this.TitlePush = data.body;
    this.mostrarDialogoPush = true;
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
