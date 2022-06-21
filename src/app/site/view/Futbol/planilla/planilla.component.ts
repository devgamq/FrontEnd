import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { BreadcrumbModule, MenuItem, GrowlModule } from 'primeng/primeng';
import { SelectItem, Message } from 'primeng/primeng';
import { Competidor } from '../../../domain/widgets/competidor.type';
import { Encuentro } from '../../../domain/deportes/grupo/v_encuentro';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { PlanillaPersona } from '../../../domain/deportes/grupo/PlanillaPersona';
import { Planilla } from '../../../domain/deportes/grupo/Planilla';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-planilla',
  templateUrl: './planilla.component.html',
  styleUrls: ['./planilla.component.css'],
  providers: [ConfirmationService, ConjuntoService]
})
export class PlanillaComponent implements OnInit {
  crumb: MenuItem[];
  sistemas: SelectItem[];
  public equipoA: Competidor;
  public equipoB: Competidor;
  encuentro: Encuentro;
  PlanillaId: number;
  deporteId: number;
  tipo = 0;
  DataForm: FormGroup;
  msgs: Message[] = [];

  _Arbitro1: any;
  _Arbitro2: any;
  _Arbitro3: any;
  _Arbitro4: any;

  PlanillaForm: FormGroup;
  planilla: Planilla;

  constructor(
    private conjuntoService: ConjuntoService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.equipoA = new Competidor();
    this.equipoB = new Competidor();
    this.encuentro = new Encuentro();
    this.init_planilla_form();
  }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('encuentro'));
    this.PlanillaId = this.route.snapshot.params['PlanillaId'];
    this.deporteId = this.route.snapshot.params['deporteId'];
    this.tipo = this.route.snapshot.params['tipo'];


    this.encuentro = data['data'];
    if (String(this.encuentro) === 'undefined') {
      this.encuentro = data;
    }


    this.setSistemas();
    this.init_formulario();

    this.conjuntoService
      .GetPlanillaPersonasApoyo(0, this.PlanillaId, 0)
      .then(res => {
        // tslint:disable-next-line:no-shadowed-variable
        const data = res;
        if (res.length > 0) {
          const Arbitro1 = data.filter(item => item.ParametroRolId === 6)[0];
          const Arbitro2 = res.filter(item => item.ParametroRolId === 7)[0];
          const Arbitro3 = res.filter(item => item.ParametroRolId === 8)[0];
          const Arbitro4 = res.filter(item => item.ParametroRolId === 9)[0];

          if (Arbitro1 != null) {
            this._Arbitro1 = this.initPersonaApoyo(Arbitro1);
          }
          if (Arbitro2 != null) {
            this._Arbitro2 = this.initPersonaApoyo(Arbitro2);
          }
          if (Arbitro3 != null) {
            this._Arbitro3 = this.initPersonaApoyo(Arbitro3);
          }
          if (Arbitro4 != null) {
            this._Arbitro4 = this.initPersonaApoyo(Arbitro4);
          }
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
      DocumentoIdentidad: persona.Persona.DocumentoIdentidad,
      PlanillaPersonaId: persona.PlanillaPersonaId,
      PlanillaId: persona.PlanillaId
    };
  }
  private setSistemas() {
    this.sistemas = [];
    this.sistemas.push({ label: 'Selec. Alineacion', value: null });
    this.sistemas.push({ label: '4-4-2', value: '4-4-2' });
    this.sistemas.push({ label: '4-3-1-2', value: '4-3-1-2' });
    this.sistemas.push({ label: '4-3-3', value: '4-3-3' });
    this.sistemas.push({ label: '4-2-3-1', value: '4-2-3-1' });
    this.sistemas.push({ label: '3-4-3', value: '3-4-3' });
    this.sistemas.push({ label: '3-5-2', value: '3-5-2' });
    this.sistemas.push({ label: '5-3-2', value: '5-3-2' });
    this.sistemas.push({ label: '5-4-1', value: '5-4-1' });

    this.equipoA = new Competidor();
    this.equipoA.CompetidorId = this.encuentro.CompetidorAId;
    this.equipoA.Equipo = this.encuentro.EquipoA;
    this.equipoA.EquipoId = this.encuentro.EquipoIdA;
    this.equipoA.PlanillaId = this.encuentro.Planilla;
    this.equipoA.PruebaEventoId = this.encuentro.EventoId;
    this.equipoA.EquipoSigla = 'A';

    this.equipoB = new Competidor();
    this.equipoB.CompetidorId = this.encuentro.CompetidorBId;
    this.equipoB.Equipo = this.encuentro.EquipoB;
    this.equipoB.EquipoId = this.encuentro.EquipoIdB;
    this.equipoB.PlanillaId = this.encuentro.Planilla;
    this.equipoB.PruebaEventoId = this.encuentro.EventoId;
    this.equipoB.EquipoSigla = 'B';
  }
  public regresar() {
    this.router.navigate([
      'master/cronograma/' +
      this.encuentro.EventoId +
      '/' +
      this.deporteId + '/' +
      this.tipo
    ]);
  }
  public showDialog() {
    this.planilla = JSON.parse(localStorage.getItem('planilla'));

    const nomina_titulares_A = $(
      '.' + this.encuentro.CompetidorAId + ' table [type=checkbox]:checked'
    ).length;
    const nomina_titulares_B = $(
      '.' + this.encuentro.CompetidorBId + ' table [type=checkbox]:checked'
    ).length;
    console.clear();
    console.log(nomina_titulares_B + '-' + this.encuentro.CompetidorBId + '+' + nomina_titulares_A + '-' + this.encuentro.CompetidorAId)
    if (Number(this.tipo) === 0 && (nomina_titulares_B === 0 || nomina_titulares_A === 0)) {
      this.msgs = [];
      this.msgs.push({
        severity: 'error',
        summary: 'Error!',
        detail: 'Debe registrar la nómina de jugadores'
      });
    } else {
      this.confirmationService.confirm({
        message: 'Desea continuar con el marcador?',
        accept: () => {

          this.planilla = JSON.parse(localStorage.getItem('planilla'));
          this.PlanillaForm.controls['PlanillaId'].setValue(this.PlanillaId);
          this.PlanillaForm.controls['CronogramaId'].setValue(
            this.planilla.CronogramaId
          );
          this.PlanillaForm.controls['Fecha'].setValue(this.planilla.Fecha);
          this.PlanillaForm.controls['HoraFin'].setValue(this.planilla.HoraFin);
          this.PlanillaForm.controls['HoraInicio'].setValue(
            this.planilla.HoraInicio
          );

          this.PlanillaForm.controls['SistemaEquipoA'].setValue(
            this.planilla.SistemaEquipoA
          );
          this.PlanillaForm.controls['SistemaEquipoB'].setValue(
            this.planilla.SistemaEquipoB
          );
          this.PlanillaForm.controls['Estado'].setValue(1);

          this.conjuntoService
            .savePlanilla(this.PlanillaForm)
            .subscribe(res => { });

          this.router.navigate([
            'master/' +
            this.deporteId +
            '/' +
            this.encuentro.CompetidorAId +
            '/' +
            this.encuentro.CompetidorBId +
            '/' +
            this.PlanillaId +
            '/' +
            this.encuentro.EventoId +
            '/' +
            this.deporteId +
            '/' +
            this.tipo
          ]);
        }
      });
    }
  }
  doSelectArbitro($event, id) {
    this.initBuscador();
    this.DataForm.controls['PersonaId'].setValue($event.PersonaId);
    this.DataForm.controls['ParametroRolId'].setValue(id);
    const PlanillaPersonaId = this.getPlanillaPersonaId(id);
    this.DataForm.controls['PlanillaPersonaId'].setValue(PlanillaPersonaId);

    this.conjuntoService.SavePlanillaPersona(this.DataForm).subscribe(res => {
      const resp = res.json();
      if (resp === -1) {
        this.showMessage(
          'Ocurrio un error al agregar el arbitro: ' + $event.NombreCompleto,
          'danger',
          'Error'
        );
      } else {
        this.showMessage(
          'Se ha agregado al arbitro: ' + $event.NombreCompleto,
          'info',
          'Mensaje'
        );
      }
    });
  }
  private getPlanillaPersonaId(parametro: number) {
    switch (parametro) {
      case 6:
        return this._Arbitro1 == null ? 0 : this._Arbitro1.PlanillaPersonaId;
      case 7:
        return this._Arbitro2 == null ? 0 : this._Arbitro2.PlanillaPersonaId;
      case 8:
        return this._Arbitro3 == null ? 0 : this._Arbitro3.PlanillaPersonaId;
      case 9:
        return this._Arbitro4 == null ? 0 : this._Arbitro4.PlanillaPersonaId;
    }
    return 0;
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
  private initBuscador() {
    this.DataForm.controls['PlanillaId'].setValue(this.PlanillaId);
    this.DataForm.controls['CompetidorId'].setValue(0);

    this.DataForm.controls['NumeroCamiseta'].setValue(0);
    this.DataForm.controls['Posicion'].setValue('');
  }
  showMessage(mensaje, color, titulo) {
    this.msgs = [];
    this.msgs.push({ severity: color, summary: titulo, detail: mensaje });
  }
  private init_planilla_form() {
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
}
