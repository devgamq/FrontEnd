import { Component, OnInit,  Input,
  Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {
  SharedModule,
  GrowlModule,
  Message,
  ConfirmDialogModule,
  ConfirmationService,
  MenuItem,
  DataTableModule
} from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Deportista } from '../../../domain/Golf/deportista';
import { DeportistaService } from '../../../service/Golf/deportista.service';
import { CategoriaDropDown } from '../categoria-golf/categoria-dropdown/categoria-dropdown.component';
import { GolfCompetidor } from '../../../domain/Golf/golfCompetidor';
import { PersonaService } from '../../../service/Shared/persona.service';
import { CompetidorService } from '../../../service/Golf/competidor.service';
enum DialogType {
  Insert,
  Update
}

@Component({
  selector: 'app-competidor-golf',
  templateUrl: './competidor-golf.component.html',
  styleUrls: ['./competidor-golf.component.css'],
  providers: [
    DeportistaService,
    ConfirmationService,
    PersonaService,
    CompetidorService
  ]
})
export class CompetidorGolfComponent implements OnInit {

  @Output() NombrePersonas = new EventEmitter();
  @Input() servicioMostrar: string;
  @Input() mostrarNombre: boolean;

  @Input() _NombrePersona: any;
  public deportistaDatos: string[];
  eventoId: number;
  disciplinaId: number;
  deportistas: Deportista[];
  deportista: Deportista;
  competidorForm: FormGroup;
  display = false;
  msgs: Message[] = [];
  categoria: number;
  CompetidorId: number;
  personas: any[];
  persona:any;
  filteredPersonas: any[];
  type = DialogType;
  hideElement = false;
  nombre: string;
  isDisabled = false;
  data: string[];
  accion = 0; // 1 editar, 0 adicionar
  constructor(
    private formBuilder: FormBuilder,
    private http: Http,
    private deportistaService: DeportistaService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private personaService: PersonaService,
    private competidorService: CompetidorService,
    // private _sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.cleanForm();
  }

  ngOnInit() {
    this.eventoId = +this.route.snapshot.params['eventoId'];
    this.disciplinaId = +this.route.snapshot.params['disciplinaId'];
    this.doGetCompetidores();
    this.isDisabled = true;
  }

  doGetCompetidores() {
    this.deportistaService
      .getDeportistas(this.eventoId, this.disciplinaId)
      .then(res => {
        this.deportistas = res;
      });
  }

  doGetCompetidor() {
    this.deportistaService
      .getDeportista(this.deportista.PersonaId)
      .then(res => {
        this.deportistaDatos = res;
        this.doSetFormCompetidor(this.deportistaDatos[0]);
      });
  }

  doSetFormCompetidor($event) {
    this.nombre = $event.Nombres + ' ' + $event.Paterno + ' ' + $event.Materno;
    this.competidorForm.controls['PersonaId'].setValue($event.PersonaId);
    this.competidorForm.controls['DatoPersona'].setValue(this.nombre);
    this.competidorForm.controls['CompetidorId'].setValue($event.CompetidorId);
    this.competidorForm.controls['Handicap'].setValue($event.Handicap);
    this.competidorForm.controls['Club'].setValue($event.Club);
    this.categoria = $event.CategoriaId;
    this.isDisabled = false;
    this.display = true;
  }

  doSetCompetidor($event: any, typeDialog: DialogType) {
   // debugger;
    this.competidorForm.controls['CategoriaId'].setValue(this.categoria);
    this.competidorForm.controls['EventoDeportivoId'].setValue(this.eventoId);
    this.competidorForm.controls['DisciplinaId'].setValue(this.disciplinaId);
    
    this.competidorForm.controls['PersonaId'].setValue(
      this.competidorForm.controls['DatoPersona'].value['PersonaId']
    );
    this.competidorForm.controls['DatoPersona'].setValue(
      this.competidorForm.controls['DatoPersona'].value['NombreCompleto']
    );
    this.competidorForm.controls['Accion'].setValue(this.accion);
    if (this.competidorForm.valid) {
      this.competidorService
        .setGolfCompetidor(this.competidorForm)
        .subscribe(res => {
          const resp = res.json();
          if (resp === true) {
            this.doGetCompetidores();
            this.display = false;
            this.showMessage();
          } else {
            alert('error');
          }
        });
    } else {
      alert('error');
    }
  }

  showSalidas($event) {
    this.categoria = $event.categoriaId;
  }

  cleanForm() {
    this.competidorForm = this.formBuilder.group({
      Handicap: ['', Validators.required],
      Club: ['', Validators.required],
      // nombrePersona:[""],
      PersonaId: [''],
      DatoPersona: [''],
      CompetidorId: [''],
      CategoriaId: [''],
      EventoDeportivoId: [''],
      Accion: [''],
      DisciplinaId: ['']
    });
    this.isDisabled = true;
  }

  showDialog(typeDialog: DialogType) {
    this.cleanForm();
    if (typeDialog === DialogType.Update) {
      this.accion = 1;
      this.doGetCompetidor();
    } else {
      this.accion = 0;
      this.display = true;
    }
  }

  showMessage() {
    this.msgs = [];
    this.msgs.push({
      severity: 'success',
      summary: 'Exito!',
      detail: 'Competidor Guardado'
    });
  }

  // filterPersona(event) {
  //   const query = event.query;

  //   this.personaService.getPersonas(this.eventoId).then(personas => {
  //     this.filteredPersonas = this.filter(query, personas);
  //   });
  //}
  selectCompetidor(event) {
    this.competidorForm.controls['CompetidorId'].setValue(event.CompetidorId);
  }
  // filter(query, personas: any[]): any[] {
  //   const filtered: any[] = [];
  //   for (let i = 0; i < personas.length; i++) {
  //     const persona = personas[i];
  //     if (
  //       persona.NombreCompleto.toLowerCase().indexOf(query.toLowerCase()) === 0
  //     ) {
  //       filtered.push(persona);
  //     }
  //   }
  //   return filtered;
  // }



  doSearchPersonas(event) {
    const query = event.query;
      this.personaService.SearchCompetidores_Golf(this.eventoId , query )
          .then(res => {
            this.persona= res;
  
          });
    
   
  }
  doSelectSearchPersona($event) {
   
    this.NombrePersonas.emit($event);
  }

  onRowDblclickGrupo($event) {
    this.router.navigate([
      '/master/GolfDetalleCompetidor',
      $event.data.PersonaId,
      this.eventoId,
      this.disciplinaId
    ]);
  }

  onRowSelect($event) {
    this.hideElement = true;
  }

  isAutoComplete() {
    return this.isDisabled;
  }
  doGetCompetidorDelete() {
    this.deportistaService
      .getDeportista(this.deportista.PersonaId)
      .then(res => {
        this.deportistaDatos = res;
        this.confirmDelete(this.deportistaDatos[0]);
      });
  }
  confirmDelete($event) {
    // tslint:disable-next-line:no-unused-expression
    this.deportistaService;

    const data = $event.CompetidorId;
    this.confirmationService.confirm({
      message:
        '¿Esta seguro de eliminar al competidor:' +
        this.deportista.Nombres +
        ' ' +
        this.deportista.Paterno +
        ' ' +
        this.deportista.Materno +
        ' ?',
      header: 'Eliminar Competidor: ',
      icon: 'fa fa-trash',
      accept: () => {
        this.competidorService.deleteGolfCompetidor(data).subscribe(res => {
          const resp = res.json();
          this.msgs = [];
          if (resp === true) {
            this.doGetCompetidores();
            this.msgs.push({
              severity: 'success',
              summary: 'Exito!',
              detail: 'Competidor Eliminado'
            });
          } else {
            this.msgs.push({
              severity: 'error',
              summary: 'Error!',
              detail:
                'El competidor tiene grupo asignado, no puede ser eliminado'
            });
          }
        });
      }
    });
  }
}
