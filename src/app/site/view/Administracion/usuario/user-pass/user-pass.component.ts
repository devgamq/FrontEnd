import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../../../service/Shared/usuario.service';
import { Usuario } from '../../../../domain/Shared/usuario.type';


@Component({
  selector: 'app-user-pass',
  templateUrl: './user-pass.component.html',
  styleUrls: ['./user-pass.component.css'],
  providers: [UsuarioService]
})
export class UserPassComponent implements OnInit {
  @Input() DatosPesonalesInput?: string[];
  datos: Usuario;
  _nombre: string;
  _oldpassword_valid: any = false;
  _newpassword_valid: any = false;
  _repassword_valid: any = false;
  _clave_valid: any = false;
  _igualpass: any = false;
  _verificar_oldpass: any = false;
  identificador: number;
  msgs: Message[] = [];


  DatosPesonalesForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private usuarioServicio: UsuarioService) { }

  ngOnInit() {
    this.init_formulario();
    this.loadUsuarioActual();

  }
  loadUsuarioActual() {
    const usuarioActual = JSON.parse(sessionStorage.getItem('resu'));
    this.identificador = usuarioActual.UsuarioId;
    this.usuarioServicio.getUsuarioRegistrado(usuarioActual.UsuarioId).then(res => {
      this.datos = res;
      this._nombre = this.datos.Usuario.toLowerCase().replace('.', ' ');
    });
  }

  onSave() {

    if (this.validar()) {

      this.DatosPesonalesForm.controls['UsuarioId'].setValue(this.identificador);
      this.DatosPesonalesForm.controls['Password'].setValue(this.DatosPesonalesForm.controls['newpassword'].value);

      this.usuarioServicio.verificarPass(
        this.identificador, this.DatosPesonalesForm.controls['oldpassword'].value).then(
        res => {

          this._clave_valid = !res;
          if (!this._clave_valid) {this.setPassword(); }

        });



    }


  }
  setPassword() {
    this.usuarioServicio.setPassword(this.DatosPesonalesForm).subscribe(res => {
      const resp = res.json();
      if (resp === true) {
        this.showMessage();
        // this.DatosPesonalesForm.reset;
        this.DatosPesonalesForm.controls['newpassword'].setValue('');
        this.DatosPesonalesForm.controls['oldpassword'].setValue('');
        this.DatosPesonalesForm.controls['repassword'].setValue('');

      }
    });
  }
  init_formulario() {
    this.DatosPesonalesForm = this.formBuilder.group({
      oldpassword: ['', Validators.compose([Validators.required])],
      newpassword: ['', Validators.compose([Validators.required])],
      repassword: ['', Validators.compose([Validators.required])],
      Password: ['', Validators.compose([Validators.required])],
      UsuarioId: ['', Validators.compose([Validators.required])]
    });
  }
  showMessage() {

    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Contraseña actualizada' });
  }
  validar() {


    this._oldpassword_valid = !this.DatosPesonalesForm.controls['oldpassword'].valid;
    this._newpassword_valid = !this.DatosPesonalesForm.controls['newpassword'].valid;
    this._repassword_valid = !this.DatosPesonalesForm.controls['repassword'].valid;
    const data_newpassword = this.DatosPesonalesForm.controls['newpassword'].value;
    const data_repassword = this.DatosPesonalesForm.controls['repassword'].value;


    if (data_newpassword === data_repassword) {
      this._igualpass = false;
    } else { this._igualpass = true; }

    if (!this._oldpassword_valid && !this._newpassword_valid && !this._repassword_valid && !this._igualpass) {
      return true;
    } else {
      return false;
    }



  }



}
