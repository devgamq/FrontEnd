import { Injectable } from '@angular/core';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { Competidor } from '../../../domain/widgets/competidor.type';
import { Jugador } from '../../../domain/widgets/jugador.type';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem, Message } from 'primeng/primeng';
import { OrderListModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { SortMeta } from 'primeng/primeng';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Planilla } from '../../../domain/deportes/grupo/Planilla';
import { PlanillaPersona } from '../../../domain/deportes/grupo/PlanillaPersona';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { Util } from '../../../view/Futbol/util';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-inscripcion-jugadores',
  templateUrl: './inscripcion-jugadores.component.html',
  styleUrls: ['./inscripcion-jugadores.component.css'],
  providers: [ConjuntoService, ConfirmationService]
})
export class InscripcionJugadoresComponent implements OnInit, OnChanges {
  @Output() jugador_seleccionado = new EventEmitter();
  @Output() getCount = new EventEmitter();

  @Input() competidor: Competidor;
  @Input() sistemas: SelectItem[];
  @Input() PlanillaId: number;
  @Input() deporteId: number;
  @Input() is_inscripcion = true;
  @Input() ParametroId = 0;
  @Input() titulo: string;
  @Input() recargar = false;
  @Input() contar = false;
  @Input() eventoId: number;
  @Input() grupo: string;
  
  @Input() tipo: number;

  util: Util;
  data: Jugador[];
  listaEquipo: any[];
  public display: boolean;
  multiSortMeta: SortMeta[];
  busqueda: string;
  DataForm: FormGroup;
  PlanillaForm: FormGroup;
  nombre = '';
  msgs: Message[] = [];
  public posicionJuego: SelectItem[];
  conjunto = true;

  _DT: any;
  _Asistente: any;
  _Delegado: any;

  planilla: Planilla;
  selectedValue: string;
  personaPlantilla: any;

  seleccionTitulares: any[];
  titulares: any[];
  mensaje: Message[] = [];

  listaCapitan: any[];
  parametroRolId = 2;

  tipo_seleccion: string;

  /*logo de equipo*/
  logoA = '/assets/erpHammer/images/logoB.png';

  capitan: any[];
  JugadorCapitan: string;

  constructor(
    private conjuntoService: ConjuntoService,
    private formBuilder: FormBuilder,
    private activedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {
    this.competidor = new Competidor();
    this.planilla = new Planilla();
    this.data = [];
    this.eventoId = this.activedRoute.snapshot.params['eventoId'];
    this.listaEquipo = [];
    this.multiSortMeta = [];
    this.multiSortMeta.push({ field: 'Titular', order: -1 });
    this.multiSortMeta.push({ field: 'Nombre', order: 1 });
    this.display = false;
    this.busqueda = 'getSearchPersona';

  }
  ngOnInit() {
    this.planilla = JSON.parse(localStorage.getItem('planilla'));
    this.obtenerIdDelegacion(this.competidor.CompetidorId);

    this.conjuntoService
      .GetPlanillaPersonasApoyo(
        this.competidor.CompetidorId,
        this.planilla.PlanillaId,
        0
      )
      .then(res => {
        const data = res;
        if (res.length > 0) {
          const Delegado = data.filter(
            item => Number(item.ParametroRolId) === 5
          )[0];
          const dTecnico = res.filter(
            item => Number(item.ParametroRolId) === 3
          )[0];
          const Asistente = res.filter(
            item => Number(item.ParametroRolId) === 4
          )[0];

          if (dTecnico !== null) {
            this._DT = this.initPersonaApoyo(dTecnico);
          }
          if (Asistente != null) {
            this._Asistente = this.initPersonaApoyo(Asistente);
          }
          if (Delegado != null) {
            this._Delegado = this.initPersonaApoyo(Delegado);
          }
        }
      });

    this.listaCapitan = [
      { label: 'Si', value: 'Si' },
      { label: 'No', value: 'No' }
    ];

    this.selectedValue =
      String(this.competidor.EquipoSigla) === 'A'
        ? this.planilla.SistemaEquipoA
        : this.planilla.SistemaEquipoB;
    this.doGetPlanillaEquipo(this.competidor.CompetidorId);
    this.getPosicionJuego();
    this.doGetPlanilla(this.competidor.CompetidorId, this.PlanillaId, '');

    this.init_formulario();
  }
  private initPersonaApoyo(persona: PlanillaPersona) {
    return {
      PersonaId: persona.PersonaId,
      NombreCompleto: persona.Persona.NombreCompleto,
      Paterno: persona.Persona.Paterno,
      Materno: persona.Persona.Materno,
      Nombres: persona.Persona.Nombres,
      DocumentoIdentidad: persona.Persona.DocumentoIdentidad,
      PlanillaPersonaId: persona.PlanillaPersonaId,
      PlanillaId: persona.PlanillaId
    };
  }
  private init_formulario() {
    this.DataForm = this.formBuilder.group({
      PlanillaId: [''],
      PersonaId: ['', Validators.compose([Validators.required])],
      CompetidorId: [''],
      NumeroCamiseta: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]+$')
        ])
      ],
      Posicion: ['', Validators.compose([Validators.required])],
      ParametroRolId: [''],
      Capitan: [''],
      PlanillaPersonaId: ['']
    });
    this.PlanillaForm = this.formBuilder.group({
      PlanillaId: [''],
      CronogramaId: [''],
      Fecha: [''],
      HoraFin: [''],
      HoraInicio: [''],
      SistemaEquipoA: [''],
      SistemaEquipoB: ['']
    });
  }
  doGetPlanilla(competidorId, planillaId, search) {
    this.conjuntoService
      .GetPlanillaPersonas(competidorId, planillaId, search)
      .then(res => {
        this.data = res.map(item => {
          const i = 0;
          let escapitan;
          if (item.Capitan) {
            escapitan = 'Si';
          } else {
            escapitan = 'No';
          }
          return {
            Nombre: item.Persona.NombreCompleto,
            Orden: i + 1,
            Numero: item.NumeroCamiseta,
            Id: item.PlanillaPersonaId,
            Titular: item.Parametros.ParametroId,
            Posicion: item.Posicion,
            isInscripcion: this.is_inscripcion,
            PersonaId: item.PersonaId,
            PlanillaPersonaId: item.PlanillaPersonaId,
            Capitan: escapitan
          };
        });
        if (this.ParametroId > 0) {
          this.data = this.data.filter(
            item => Number(item.Titular) === Number(this.ParametroId)
          );
        }
        if (this.is_inscripcion) {
          this.tipo_seleccion = 'multiple';
          this.seleccionTitulares = this.data.filter(function (c) {
            return c.Titular === 1;
          });




          this.titulares = this.seleccionTitulares.map(item => {
            return '' + item.PersonaId;
          });
          this.capitan = this.data.filter(function (c) {
            return String(c.Capitan) === 'Si';
          });
          
          if (this.capitan[0]) {
            this.JugadorCapitan = 'radio' + this.capitan[0].PersonaId;
          }
        } else {
          this.tipo_seleccion = 'single';
          this.seleccionTitulares = [];
        }
      });
  }

  doGetPlanillaEquipo(competidorId) {
    this.conjuntoService.GetPlanillas(competidorId,this.PlanillaId,"",1).then(res => {
      this.listaEquipo = res.map(item => {
        const i = 0;
        return {
          Nombre: item.Persona.Nombres + ' ' + item.Persona.Paterno + ' ' + item.Persona.Materno,
          Numero: item.Persona.NroCamiseta,
          Posicion: item.Posicion,
          PersonaId: item.PersonaId,
          EquipoId:  item.PlanillaPersonaId  //equip item.CompetidorId
         };
      });
      console.log(this.listaEquipo);
    });
  }

  rowStyle(rowData: any, rowIndex: number): string {
    let estilo = '';
    console.log(rowData);
    if (Number(rowData.Titular) === 2) {
      estilo = 'colum-orange';
    } else if (Number(rowData.Titular) === 1) {
      console.log('entra');
      estilo = 'colum-white';
    }

    console.log(estilo);
    return estilo;
  }

  showDialog() {
    this.display = true;
  }
  reload($event) {
    this.display = false;
    this.doGetPlanilla(this.competidor.CompetidorId, this.PlanillaId, '');
  }
  actualizar() {
    this.doGetPlanilla(this.competidor.CompetidorId, this.PlanillaId, '');
  }
  doSelectDT($event) {
    this.initBuscador();
    this.DataForm.controls['PersonaId'].setValue($event.PersonaId);
    this.DataForm.controls['ParametroRolId'].setValue(3);
    this.DataForm.controls['PlanillaPersonaId'].setValue(
      this.getPlanillaPersonaId(3)
    );
    this.conjuntoService.SavePlanillaPersona(this.DataForm).subscribe(res => {
      const resp = res.json();
      if (Number(resp) === -1) {
        this.showMessage(
          'Ocurrio un error al agregar el DT: ' + $event.NombreCompleto,
          'danger',
          'Error'
        );
      } else {
        this.showMessage(
          'Se ha agregado al DT: ' + $event.NombreCompleto,
          'info',
          'Mensaje'
        );
      }
    });
  }
  doSelectAsistente($event) {
    this.initBuscador();
    this.DataForm.controls['PersonaId'].setValue($event.PersonaId);
    this.DataForm.controls['ParametroRolId'].setValue(4);
    this.DataForm.controls['PlanillaPersonaId'].setValue(
      this.getPlanillaPersonaId(4)
    );
    this.conjuntoService.SavePlanillaPersona(this.DataForm).subscribe(res => {
      const resp = res.json();
      if (Number(resp) === -1) {
        this.showMessage(
          'Ocurrio un error al agregar al Asistente: ' + $event.NombreCompleto,
          'danger',
          'Error'
        );
      } else {
        this.showMessage(
          'Se ha agregado al Asistente: ' + $event.NombreCompleto,
          'info',
          'Mensaje'
        );
      }
    });
  }
  doSelectDelegado($event) {
    this.initBuscador();
    this.DataForm.controls['PersonaId'].setValue($event.PersonaId);
    this.DataForm.controls['ParametroRolId'].setValue(5);
    this.DataForm.controls['PlanillaPersonaId'].setValue(
      this.getPlanillaPersonaId(5)
    );

    this.conjuntoService.SavePlanillaPersona(this.DataForm).subscribe(res => {
      const resp = res.json();
      if (Number(resp) === -1) {
        this.showMessage(
          'Ocurrio un error al agregar al Delegado: ' + $event.NombreCompleto,
          'danger',
          'Error'
        );
      } else {
        this.showMessage(
          'Se ha agregado al Delegado: ' + $event.NombreCompleto,
          'info',
          'Mensaje'
        );
      }
    });
  }
  private getPlanillaPersonaId(parametro: number) {
    switch (parametro) {
      case 3:
        return this._DT == null ? 0 : this._DT.PlanillaPersonaId;
      case 4:
        return this._Asistente == null ? 0 : this._Asistente.PlanillaPersonaId;
      case 5:
        return this._Delegado == null ? 0 : this._Delegado.PlanillaPersonaId;
    }
    return 0;
  }
  private initBuscador() {
    this.DataForm.controls['PlanillaId'].setValue(this.PlanillaId);
    this.DataForm.controls['CompetidorId'].setValue(
      this.competidor.CompetidorId
    );

    this.DataForm.controls['NumeroCamiseta'].setValue(0);
    this.DataForm.controls['NumeroCamiseta'].setValue('');
  }
  showMessage(mensaje, color, titulo) {
    this.msgs = [];
    this.msgs.push({ severity: color, summary: titulo, detail: mensaje });
  }
  onChangePlantilla($event) {
    this.planilla = JSON.parse(localStorage.getItem('planilla'));

    this.PlanillaForm.controls['PlanillaId'].setValue(this.PlanillaId);
    this.PlanillaForm.controls['CronogramaId'].setValue(
      this.planilla.CronogramaId
    );
    this.PlanillaForm.controls['Fecha'].setValue(this.planilla.Fecha);
    this.PlanillaForm.controls['HoraFin'].setValue(this.planilla.HoraFin);
    this.PlanillaForm.controls['HoraInicio'].setValue(this.planilla.HoraInicio);

    if (String(this.competidor.EquipoSigla) === 'A') {
      this.planilla.SistemaEquipoA = $event.value;
      this.PlanillaForm.controls['SistemaEquipoA'].setValue($event.value);
      this.PlanillaForm.controls['SistemaEquipoB'].setValue(
        this.planilla.SistemaEquipoB
      );
    } else {
      this.planilla.SistemaEquipoB = $event.value;
      this.PlanillaForm.controls['SistemaEquipoB'].setValue($event.value);
      this.PlanillaForm.controls['SistemaEquipoA'].setValue(
        this.planilla.SistemaEquipoA
      );
    }

    this.conjuntoService.savePlanilla(this.PlanillaForm).subscribe(res => {
      const dataPlanilla = JSON.stringify(this.initPlanilla());
      localStorage.setItem('planilla', dataPlanilla);
    });
  }
  private initPlanilla() {
    const foo = {
      PlanillaId: this.PlanillaId,
      CronogramaId: this.planilla.CronogramaId,
      Fecha: this.planilla.Fecha,
      HoraFin: this.planilla.HoraFin,
      HoraInicio: this.planilla.HoraInicio,
      SistemaEquipoA: this.planilla.SistemaEquipoA,
      SistemaEquipoB: this.planilla.SistemaEquipoB,
      Estado: this.planilla.Estado
    };
    return foo;
  }
  onRowSelect($event) {
    this.personaPlantilla = $event.data;
    this.jugador_seleccionado.emit($event);
  }
  ngOnChanges(changes: SimpleChanges) {
    try {
      const eventoTipo = changes['tipo'];
      this.conjunto = Number(eventoTipo.currentValue) === 0 ? true : false;
    } catch (error) { }

    try {
      const iniciarEvent = changes['recargar'];
      const validateRama = JSON.stringify(iniciarEvent.currentValue);
      if (String(validateRama) === 'true') {
        this.ngOnInit();
      }
    } catch (error) { }

    try {
      const iniciarEvent = changes['contar'];
      const validateRama = JSON.stringify(iniciarEvent.currentValue);
      // if (validateRama === "true")
      // this.getCount.emit(data.);
    } catch (error) { }
  }

  eliminar($event) {
    this.confirmationService.confirm({
      message:
        'Desea eliminar de la plantilla al jugador: <br><b>' +
        this.personaPlantilla.Nombre +
        '</b>',
      accept: () => {
        this.DataForm.controls['PlanillaPersonaId'].setValue(
          this.personaPlantilla.PlanillaPersonaId
        );
        this.conjuntoService
          .DeletePlanillaPersona(this.DataForm)
          .subscribe(res => {
            const resp = res.json();
            if (Number(resp) === -1) {
              this.showMessage(
                'Ocurrio un error al eliminar al jugador: ' +
                this.personaPlantilla.Nombre,
                'danger',
                'Error'
              );
            } else {
              this.showMessage(
                'Se ha eliminado al jugador: ' + this.personaPlantilla.Nombre,
                'info',
                'Mensaje'
              );
              this.doGetPlanilla(
                this.competidor.CompetidorId,
                this.PlanillaId,
                ''
              );
            }
          });
      }
    });
  }
  cambioValor(event) {
    console.log(event);
    if (this.is_inscripcion) {
      this.msgs = [];
      // tslint:disable-next-line:prefer-const
      let capitan;
      const personaId = event.PersonaId;
      const posicion = event.Posicion;
      const numero = event.Numero;
      const planillaPersonaId = event.PlanillaPersonaId;
      if (Number(event.Titular) === 2) {
        this.parametroRolId = 1;
      } else {
        this.parametroRolId = 2;
      }

      const jugModif = this.listaEquipo.filter(function (c) {
        return Number(c.PersonaId) === Number(personaId);
      });
      const equipoId = jugModif[0].EquipoId;
      this.conjuntoService
        .SavePosicionNumero(
          equipoId,
          personaId,
          posicion,
          numero,
          planillaPersonaId,
          this.parametroRolId,
          capitan
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
    } else {
      this.personaPlantilla = event.data;
      this.jugador_seleccionado.emit(event);
    }
  }

  getPosicionJuego() {
    this.posicionJuego = [];
    this.conjuntoService.getPosicion(this.deporteId).then(res => {
      this.posicionJuego = res;
      console.log(this.posicionJuego);
    });
  }

  guardarIndivisual(event, c) {
    this.msgs = [];
    let capitan;
    const personaId = event.PersonaId;
    const posicion = event.Posicion;
    const numero = event.Numero;
    const planillaPersonaId = event.PlanillaPersonaId;

    // tslint:disable-next-line:no-shadowed-variable
    const jugModif = this.listaEquipo.filter(function (c) {
      return Number(c.PersonaId) === Number(personaId);
    });
    const equipoId = jugModif[0].EquipoId;
    if (Number(c) === 1) {
      capitan = 1;
      this.capitan.forEach(item => {
        this.guardarPosicionNumeroCapitan(
          equipoId,
          item.PersonaId,
          item.Posicion,
          item.Numero,
          item.PlanillaPersonaId,
          0
        );
      });
    } else {
      capitan = 0;
    }
    this.guardarPosicionNumeroCapitan(
      equipoId,
      personaId,
      posicion,
      numero,
      planillaPersonaId,
      capitan
    );
  }

  guardarPosicionNumeroCapitan(
    equipoId,
    personaId,
    posicion,
    numero,
    planillaPersonaId,
    capitan
  ) {
    this.conjuntoService
      .SavePosicionNumero(
        equipoId,
        personaId,
        posicion,
        numero,
        planillaPersonaId,
        this.parametroRolId,
        capitan
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

  obtenerIdDelegacion(idCompetidor) {
    this.conjuntoService
      .obtenerIdDelegacion(idCompetidor, this.eventoId)
      .then(res => {
        this.logoA = res.length > 0 ? '/assets/banderas/' + res[0].DelegacionId + '.png' : '/assets/banderas/usr.png';
      });
  }
}
