import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { MenuItem, DataTableModule, SharedModule, GrowlModule, Message, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute } from '@angular/router';
import { GolfJornada } from '../../../domain/Golf/jornada';
import { JornadaService } from '../../../service/Golf/jornada.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as urls from '../../../domain/Shared/global';
enum DialogType { Insert, Update }

@Component({
  selector: 'app-jornada-golf',
  templateUrl: './jornada-golf.component.html',
  styleUrls: ['./jornada-golf.component.css'],
  providers: [JornadaService, ConfirmationService]
})
export class JornadaGolfComponent implements OnInit {
  type = DialogType;
  jornadaForm: FormGroup;
  myForm: FormGroup;
  jornadas: GolfJornada[];
  jornada: GolfJornada;
  display = false;
  eventoId: number;
  jornadaId: number;
  private sub: any;
  msgs: Message[] = [];
  hideElement = false;
  cols: any[] = [];
  es: any;
  constructor(private formBuilder: FormBuilder,
    private http: Http,
    private jornadaService: JornadaService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService) {
    this.cleanForm();
  }
  cleanForm() {
    this.jornadaForm = this.formBuilder.group({
      Fecha: ['', Validators.required],
      Descripcion: ['', Validators.required],
      NombreCorto: ['', Validators.required],
      EventoDeportivoId: ['', Validators.required],
      UsuarioId: ['', Validators.required],
      JornadaId: [''],
      FechaRegistro: ['']
    });
  }
  ngOnInit() {
    this.eventoId = +this.route.snapshot.params['eventoId'];
    this.es = urls.es;
    this.doGetJornadas();
  }
  showDialog(typeDialog: DialogType) {
    this.cleanForm();
    if (typeDialog === DialogType.Update) {
      this.doGetJornada(this.jornadaId);
    } else {
      this.display = true;
    }
  }

  doGetJornada(jornadaId: number) {
    this.jornadaService
      .getJornada(jornadaId)
      .subscribe(res => {
        this.jornada = res;
        this.jornadaForm.controls['Fecha'].setValue(new Date(this.jornada.Fecha));
        this.jornadaForm.controls['Descripcion'].setValue(this.jornada.Descripcion);
        this.jornadaForm.controls['NombreCorto'].setValue(this.jornada.NombreCorto);
        this.jornadaForm.controls['FechaRegistro'].setValue(new Date(this.jornada.FechaRegistro));
        this.jornadaForm.controls['JornadaId'].setValue(this.jornada.JornadaId);
        this.jornadaForm.controls['UsuarioId'].setValue(this.jornada.UsuarioId);
        this.jornadaForm.controls['EventoDeportivoId'].setValue(this.jornada.EventoDeportivoId);
        this.display = true;

      });
  }

  doGetJornadas() {
    this.jornadaService
      .getJornadasList(this.eventoId)
      .then(res => {
        this.jornadas = res;
        // tslint:disable-next-line:forin
        for (const key in res[0]) {
          this.cols.push({ field: key, header: key });
        }
        this.hideElement = false;
      });
  }
  doSetJornada(event: any) {
    this.jornadaForm.controls['EventoDeportivoId'].setValue(this.eventoId);
    this.jornadaForm.controls['UsuarioId'].setValue(28);
    if (this.jornadaForm.valid) {
      this.jornadaService.setJornada(this.jornadaForm).subscribe(res => {
        const resp = res.json();
        if (resp === true) {
          this.doGetJornadas();
          this.display = false;
          this.showMessage();
        }
      });
    } else {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error', detail: 'LLenar todos los campos correctamente.' });
    }
  }
  onRowSelect(event) {
    this.hideElement = true;
    this.jornadaId = event.data.JornadaId;
  }

  onRowUnselect(event) {
    alert(123);
  }
  showMessage() {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Jornada Guardada' });
  }
  confirmDelete() {
    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar la jornada?',
      header: 'Eliminar Jornada',
      icon: 'fa fa-trash',
      accept: () => {
        this.jornadaService.deleteJornada(this.jornadaId).subscribe(res => {
          const resp = res.json();
          this.msgs = [];
          if (resp === true) {
            this.doGetJornadas();
            this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Jornada Eliminada' });
          } else {
            this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'Ocurrio un error Inesperado' });
          }
        });
      }
    });
  }
}
