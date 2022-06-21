import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Equipos } from 'app/site/domain/Conjunto/Equipos';
import { Deporte } from 'app/site/domain/Acreditacion/deporte';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-inscripcionequipos',
  templateUrl: './inscripcion-equipos.component.html',
  styleUrls: ['./inscripcion-equipos.component.css'],
  providers: [DeporteService, ConjuntoService, ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class InscripcionEquiposComponent implements OnInit {
  @Output() NombrePersona = new EventEmitter();
  @Input() servicioMostrar: string;
  @Input() mostrarNombre: boolean;

  @Input() _Persona: any;
  equipo: Equipos;
  deporte: Deporte;
  eventoId: any;
  delegacionId: any;
  posiciones: SelectItem[];
  deportista: any;
  DeporteId: any;
  equipoident: number;
  filteredDeportistas: any[];
  posicion: any;
  tabla: any[];
  nrocamiseta: any;
  NombreEquipo: string;
  name: any;
  deportes: any[];
  EquipoId: any;
  datos:any[];
  msgs: Message[] = [];
  datoSeleccionado: any[];
  hideBorrar = false;
  NombreDeporte: any;
  personaId = 0;
  constructor(
    private deporteService: DeporteService,
    private activedRoute: ActivatedRoute,
    private conjuntoService: ConjuntoService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.delegacionId = +this.activedRoute.snapshot.params['delegacionId'];
    this.eventoId = +this.activedRoute.snapshot.params['eventoId'];
    this.equipo = new Equipos();
    this.equipo.EquipoId = +this.activedRoute.snapshot.params['equipoId'];
    this.equipoident = +this.activedRoute.snapshot.params['equipoId'];
    this.deporte = new Deporte();
    this.deporte.DeporteId = +this.activedRoute.snapshot.params['deporteId'];
    this.tabla = [];
    this.NombreEquipo = this.equipo.Equipo;
  }

  ngOnInit() {
    this.clean();
    this.getPosicionJuego();
    this.posicion = [];
    this.deportes = [];
  this.datos= [];
    this.conjuntoService.getEquipos(this.equipoident).then(res => {
      this.equipo = res;
      this.NombreEquipo = res[0]['Equipo'];
    });
    this.conjuntoService.getDeporteEquipos(this.equipoident).then(res => {
      this.equipo = res;
      this.NombreDeporte = res[0]['Equipo'];
    });

    this.cargarTabla();
  }

  doSearchPersonas(event) {
    const query = event.query;
    this.conjuntoService
      .getDeportista(query, this.eventoId, this.delegacionId)
      .then(res => {
        this.deportista = res;
      });
  }
  doSelectSearchPersona($event) {
    this.NombrePersona.emit($event);
    this.personaId = $event.PersonaId;
  }

  getPosicionJuego() {
    this.posicion = [];

    this.conjuntoService.getPosicion(this.deporte.DeporteId).then(res => {
      if (res.length > 0) {
        this.posicion = res;
        this.name = res[0].value;

      } else {
        this.posicion.push({ label: 'NINGUNO', value: 0 });
      }
    });
  }

  private cargarTabla() {
    this.conjuntoService.getEquiposPersona(this.equipoident).then(res => {
      this.tabla = res.sort((a, b) => {
        if (Number(a.NroCamiseta) > Number(b.NroCamiseta)) {
          return -1;
        } else {
          if (Number(a.NroCamiseta) < Number(b.NroCamiseta)) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    });
  }

  private save(editar: boolean) {
    if (
      String(this.nrocamiseta).trim() !== '' &&
      String(this._Persona).trim() !== '') {
      const data = {
        EquipoId: this.equipoident,
        PersonaId: this.personaId,
        Posicion: this.name,
        NroCamiseta: this.nrocamiseta
        
      };


this.datos = this._Persona;
let NombreCompetidor = this.datos['NombreCompleto'];

      this.conjuntoService.SaveEquipoPersona(data).then(res => {
        this.msgs = [];
        if (res) {
          this.clean();
          this.cargarTabla();
          this.msgs.push({
            severity: 'success',
            summary: 'Mensaje:',
            detail: 'Se registró con éxito a:  '  + NombreCompetidor
          });
        } else {
          this.setError(this._Persona.Paterno + ' ' +
            this._Persona.Materno + ' ' + this._Persona.Nombres + ' ya fue inscrito en el equipo');
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
    this.nrocamiseta = this.datoSeleccionado['NroCamiseta'];
    this._Persona = this.datoSeleccionado['Nombre'];
    this.name = this.datoSeleccionado['Posicion'];
  }
  private clean() {
    this.nrocamiseta = '';
    this.deportista = '';
    this.datoSeleccionado = [];
    this.hideBorrar = false;
    this.msgs = [];
    this.personaId = 0;
    this._Persona = '';
  }

  edit() {
    if (Number(this.datoSeleccionado['EquipoId']) > 0) {
      this.datoSeleccionado = [];
      this.save(true);
      this.clean();
    }
  }

  private eliminarRegistro() {
    if (Number(this.datoSeleccionado['EquipoId']) > 0) {
      this.confirmationService.confirm({
        message:
          'Desea eliminar al deportista ' +
          this.datoSeleccionado['Nombre'] +
          '?',
        accept: () => {
          this.conjuntoService
            .DeleteEquipoPersona(
              Number(this.datoSeleccionado['EquipoId']),
              Number(this.datoSeleccionado['PersonaId'])
            )
            .subscribe(res => {
              this.clean();
              this.cargarTabla();
            });
        }
      });
    }
  }

  regresar() {

   this.router.navigate(['master/nuevoEquipo/' + this.eventoId ]);
  }
}
