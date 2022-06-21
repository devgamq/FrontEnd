import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { Competidor } from '../../../domain/widgets/competidor.type';
import { Jugador } from '../../../domain/widgets/jugador.type';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem, Message } from 'primeng/primeng';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { PlanillaPersona } from '../../../domain/deportes/grupo/PlanillaPersona';
import { SucesoPersona } from '../../../domain/Conjunto/SucesoPersona';


@Component({
  selector: 'app-cambio-jugador',
  templateUrl: './cambio-jugador.component.html',
  styleUrls: ['./cambio-jugador.component.css'],
  providers: [ConfirmationService, ConjuntoService]
})
export class CambioJugadorComponent implements OnInit {
  public equipoA: Competidor;
  @Input() PlanillaId: number;
  @Input() competidorId: number;
  sistemas: SelectItem[];
  @Input() deporteId: number;
  DataForm: FormGroup;
  jugador_seleccionado: Jugador;
  suplente_seleccionado: Jugador;
  recargar = false;
  jugador_valid: any = false;
  suplente_valid: any = false;
  SucesoPersona: SucesoPersona[];

  @Output() cerrar = new EventEmitter();
  @Output() cambio = new EventEmitter();


  constructor(
    private formBuilder: FormBuilder,
    private conjuntoService: ConjuntoService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService) {
    this.equipoA = new Competidor();
    this.sistemas = [];
    this.jugador_seleccionado = new Jugador();
    this.jugador_seleccionado.Id = 0;
    this.suplente_seleccionado = new Jugador();
    this.suplente_seleccionado.Id = 0;
  }

  ngOnInit() {
    /*this.PlanillaId = this.route.snapshot.params['PlanillaId'];
    this.competidorId = this.route.snapshot.params['competidorId'];
    this.deporteId = this.route.snapshot.params['deporteId'];*/

    // localStorage.clear();
    this.initPlanilla();
    this.initEquipo();
    this.init_formulario();
  }
  private init_formulario() {

    this.DataForm = this.formBuilder.group({
      PlanillaId: [''],
      PersonaId: [''],
      CompetidorId: [''],
      NumeroCamiseta: [''],
      Posicion: [''],
      ParametroRolId: [''],
      Capitan: [''],
      PlanillaPersonaId: ['']
    });

  }
  private initEquipo() {
    this.equipoA = new Competidor();
    this.equipoA.CompetidorId = this.competidorId;
    this.equipoA.Equipo = '';
    this.equipoA.EquipoId = 0;
    this.equipoA.PlanillaId = this.PlanillaId;
    this.equipoA.PruebaEventoId = 0;
    this.equipoA.EquipoSigla = 'A';

  }
  private initPlanilla() {
    const foo = {
      PlanillaId: this.PlanillaId,
      CronogramaId: 0,
      Fecha: '',
      HoraFin: '00:00',
      HoraInicio: '00:00',
      SistemaEquipoA: '',
      SistemaEquipoB: '',
      Estado: 0
    };
    localStorage.setItem('planilla', JSON.stringify(foo));
  }
  public seleccion($event) {
    if (Number($event.data.Titular) === 1) { this.jugador_seleccionado = $event.data; } else { this.suplente_seleccionado = $event.data; }
    this.recargar = false;
  }
  public seleccionSuplente($event) {

    this.suplente_seleccionado = $event.data;
    this.recargar = false;
  }
  private clear() {
    this.jugador_seleccionado = new Jugador();
    this.jugador_seleccionado.Id = 0;

    this.suplente_seleccionado = new Jugador();
    this.suplente_seleccionado.Id = 0;
  }
  public save() {
    this.SucesoPersona = [];
    if (this.validar()) {
      this.initPlanillaPersona(this.jugador_seleccionado, 2, 1);
      this.initPlanillaPersona(this.suplente_seleccionado, 1, 2);
      this.cambio.emit(this.SucesoPersona);
      // this.cerrar.emit();
      this.clear();
    }
    /* this.confirmationService.confirm({
               message: 'Desea continuar con el cambio de jugador?',
               accept: () => {
                   if(this.validar()){
                     this.initPlanillaPersona(this.jugador_seleccionado,2);
                     this.initPlanillaPersona(this.suplente_seleccionado,1);
                 }
               }
           });*/
  }
  exit() {
    this.cerrar.emit();
  }
  private validar() {
    this.jugador_valid = Number(this.jugador_seleccionado.Id) === 0;
    this.suplente_valid = Number(this.suplente_seleccionado.Id) === 0;

    if (!this.jugador_valid && !this.suplente_valid) {
      return true;
    } else {
      return false;
    }
  }
  private initPlanillaPersona(persona: any, ParametroRolId, _orden: number) {
    this.DataForm.controls['PlanillaId'].setValue(this.PlanillaId);
    this.DataForm.controls['CompetidorId'].setValue(this.competidorId);

    this.DataForm.controls['NumeroCamiseta'].setValue(persona.Numero);
    this.DataForm.controls['Posicion'].setValue(persona.Posicion);

    this.DataForm.controls['PersonaId'].setValue(persona.PersonaId); // *
    this.DataForm.controls['ParametroRolId'].setValue(ParametroRolId);
    this.DataForm.controls['PlanillaPersonaId'].setValue(persona.PlanillaPersonaId); // *

    this.SucesoPersona.push({ PlanillaPersonaId: persona.PlanillaPersonaId, Orden: _orden });
    this.conjuntoService.SavePlanillaPersona(this.DataForm).subscribe(res => {
      const resp = res.json();
      this.recargar = true;

    });
  }
}