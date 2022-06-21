import { Component, OnInit, Input, Output } from '@angular/core';
import { BreadcrumbModule, MenuItem } from 'primeng/primeng';
import { UsuarioService } from '../../../../service/Shared/usuario.service';
import { Usuario } from '../../../../domain/Shared/usuario.type';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Persona } from 'app/site/domain/shared/persona';
import { AcreditacionPersonaService } from '../../../../service/Acreditacion/acreditacion-persona.service';
import { Message, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-usuario-registro',
  templateUrl: './usuario-registro.component.html',
  providers: [AcreditacionPersonaService, UsuarioService]
})
export class UsuarioRegistroComponent implements OnInit {
  DatosPesonalesForm: FormGroup;
  @Input() Persona: Persona;

  _Persona: any;
  Personas: Persona[];
  cuenta = '';
  password = '';
  usuario: Usuario;

  msgs: Message[] = [];

  // validacion
  _usuario_valid: any = false;
  _Password_valid: any = false;

  constructor(private router: Router,
    private activedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private AcrePerso: AcreditacionPersonaService,
    private UsuarioService: UsuarioService) { }

  ngOnInit() {
    this.init_formulario();
    this.Persona = new Persona();
  }

  init_formulario() {

    this.DatosPesonalesForm = this.formBuilder.group({
      SearchPersona: ['', Validators.compose([Validators.required])],
      Usuario: ['', Validators.compose([Validators.required])],
      Username: [''],
      IsActivo: ['1'],
      OficinaId: ['0'],
      Password: ['', Validators.compose([Validators.required])],
      PersonaId: ['0']
    });
  }

  doSearchPersonas(event) {
    this.Persona = new Persona();
    const query = event.query;
    this.AcrePerso.getSearchPersona(query)
      .then(res => {
        this.Personas = res;
      });
  }
  doSelectSearchPersona($event) {
    this.Persona = this._Persona;
    this.cuenta = this.devolverPrimerNombre(this.Persona.Nombres) + '.' + this.Persona.Paterno;
    this.password = 'Cochabamba2018';
  }

  devolverPrimerNombre(nombre) {
    const primerNombre = nombre.split(' ');
    return primerNombre[0];

  }

  validar() {
    this._usuario_valid = !this.DatosPesonalesForm.controls['Usuario'].valid;
    this._Password_valid = !this.DatosPesonalesForm.controls['Password'].valid;
    if (!this._usuario_valid && !this._Password_valid) {
      return true;
    } else { return false; }
  }
  doSetUsuario(event: any) {
    if (this.validar()) {
      this.DatosPesonalesForm.controls['Username'].setValue(this.DatosPesonalesForm.controls['Usuario'].value);
      this.UsuarioService.getLogin(this.cuenta, this.password)
        .then(res => {
          console.log(res);
          if (res.Usuario) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error', detail: 'El usuario ya esta registrado' });
            setTimeout(() => { this.msgs = []; }, 2500);
          } else {

            // tslint:disable-next-line:no-shadowed-variable
            this.UsuarioService.setUsuario(this.DatosPesonalesForm).subscribe(res => {
              const resp = res.json();
              if (resp === true) {

                this.UsuarioService.getLogin(this.cuenta, this.password)
                  // tslint:disable-next-line:no-shadowed-variable
                  .then(res => {
                    this.usuario = res;
                    if (this.usuario.UsuarioId > 0) {
                      this.router.navigate(['master/detalle-usuario/' + this.usuario.UsuarioId]);
                    } else {
                      this.msgs = [];
                      this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Error de autentificación' });
                      setTimeout(() => { this.msgs = []; }, 2500);
                    }
                  }).catch(
                  error => {
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Error de conexión con el servidor' });
                    setTimeout(() => { this.msgs = []; }, 2500);
                  });
              }
            });


          }


        });
    }

  }

  regresar() {
    this.router.navigate(['master/userList/']);
  }

}
