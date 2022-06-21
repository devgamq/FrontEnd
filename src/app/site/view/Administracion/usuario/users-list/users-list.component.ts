import { Component, OnInit } from '@angular/core';
import { BreadcrumbModule, MenuItem, Message, ConfirmationService, DataTableModule, SharedModule, GrowlModule, ConfirmDialogModule } from 'primeng/primeng';
import { UsuarioService } from '../../../../service/Shared/usuario.service';
import { Usuario } from '../../../../domain/Shared/usuario.type';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
enum DialogType { Adicionar, Actualizar }
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  providers: [UsuarioService, ConfirmationService]
})
export class UsersListComponent implements OnInit {
  datasource: Usuario[];
  lista: Usuario[];
  totalRecords: number;
  crumb: MenuItem[];
  user_seleccionado: Usuario;
  display = false; 
  display2 = false; 
  tipo = DialogType;
  DatosPesonalesForm: FormGroup; 
  DatosPesonalesForm2: FormGroup;
  usuario: Usuario;  
  type = DialogType;
  hideElement=false;
  msgs: Message [] = [];
  usuarioId:number;
  cols: any[] = [];
  eventoId:number;
  //validacion
  _usuario_valid: any = false;
  _Password_valid: any = false;
  
  
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private usuarioServicio: UsuarioService,
    private http: Http, private activedRoute: ActivatedRoute,private confirmationService:ConfirmationService) {  

  }

  ngOnInit() {
    this.eventoId = +this.route.snapshot.params['eventoId'];   
    this.loadCrumb();
    this.loadUsuarios();
    this.init_formulario();
    this.doGetUsuarios();
    
  }

  loadUsuarios() {
      this.usuarioServicio.getUsuariosRegistrados().then(res => {
      this.lista = res;
      this.totalRecords = this.lista.length;
    });
  }
  loadCrumb() {
    this.crumb = [];
    this.crumb.push({ label: 'Administración' });
    this.crumb.push({ label: 'Listado de Usuarios' });   
  }

  handleRowDblclickUsuario($event) {
    this.user_seleccionado = $event.data;
    this.router.navigate(['/master/detalle-usuario/' + $event.data['UsuarioId']]);
  }
  //editar
  showDialog(typeDialog: DialogType) {
    this. init_formulario();
   if (typeDialog === DialogType.Actualizar) {
      this.doGetUsuario(this.usuarioId);
    } else {
      this.display2 = true;     
    }
  }
    init_formulario() {
    this.DatosPesonalesForm = this.formBuilder.group({
      Usuario: ['', Validators.compose([Validators.required])],
      Username: [''],
      IsActivo: ['1'],
      OficinaId: ['0'],
      Password: ['', Validators.compose([Validators.required])],
      PersonaId: ['0']
    });
   this.DatosPesonalesForm2 = this.formBuilder.group({
      Usuario: ['', Validators.compose([Validators.required])],
      Username: [''],
      IsActivo: ['1'],
      OficinaId: ['0'],
      Password: ['', Validators.compose([Validators.required])],
      PersonaId: ['0'],
      FechaRegistro:[''],
      UsuarioId: ['', Validators.compose([Validators.required])]
     
    });
  }
  doGetUsuario(usuarioId: number) 
  {    
   this.usuarioServicio      
   .getUsuarioreg(usuarioId)         
    .then(res =>{    
      this.usuario = res;
      this.DatosPesonalesForm2.controls['UsuarioId'].setValue(this.usuario.UsuarioId);      
      this.DatosPesonalesForm2.controls['Usuario'].setValue(this.usuario.Usuario);      
      this.DatosPesonalesForm2.controls['IsActivo'].setValue((this.usuario.IsActivo));       
      this.display2 = true;         
    });
  }

  //obtener usuarios
  doGetUsuarios() {
    this.usuarioServicio
   .getUsuariosRegistrados()
      .then(res => {
        this.lista = res;
        // tslint:disable-next-line:forin
        for (const key in res[0]) {
          this.cols.push({ field: key, header: key });
        }       
      });
      this.hideElement=false;
  }   
  asociarUsuario() {
    this.router.navigate(['/master/usuario-registro/']);
  }  
  validar() {
    this._usuario_valid = !this.DatosPesonalesForm.controls['Usuario'].valid;
    this._Password_valid = !this.DatosPesonalesForm.controls['Password'].valid;   
    if (!this._usuario_valid && !this._Password_valid) {
      return true;
    } else { return false; }
  }
 doSetUsuario(event: any) {
    this.DatosPesonalesForm.controls['Username'].setValue(this.DatosPesonalesForm.controls['Usuario'].value);
    if (this.DatosPesonalesForm.valid) {
      this.usuarioServicio.setUsuario(this.DatosPesonalesForm).subscribe(res => {
        const resp = res.json();
        if (resp === true) {
          this.doGetUsuarios();       
          this.display = false;      
          this.showMessage();       
         
        }
      });
    } else {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error', detail: 'LLenar todos los campos correctamente.' });
    }
  }
  
  doUpdate(event: any) {
    
    this.DatosPesonalesForm2.controls['Username'].setValue(this.DatosPesonalesForm2.controls['Usuario'].value);
    if (this.DatosPesonalesForm2.valid) {
      this.usuarioServicio.updateUser(this.DatosPesonalesForm2).subscribe(res => {
        const resp = res.json();
        if (resp === true) {
          this.doGetUsuarios();       
          this.display2 = false;      
          this.showMessage();       
         
        }
      });
    } else {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: 'Error', detail: 'LLenar todos los campos correctamente.' });
    }
  }
  
  //columnas datatable
  onRowSelect(event) {
    this.hideElement = true;
    this.usuarioId = event.data.UsuarioId;
       
  }
  onRowUnselect(event) {
    
      this.hideElement = false;    
  } 
  EditUsuario()
  {
    this.router.navigate(['/master/detalle-usuario/' + this.usuarioId]);
  }
  showMessage()
  {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Usuario Guardado' });
  }
 //Elimiar usuario
 confirmDelete()
  {    
     this.confirmationService.confirm({      
      message: '¿Esta seguro de eliminar el Usuario?',
      header: 'Eliminar Usuario',
      icon: 'fa fa-trash',
      accept: () => {       
        this.usuarioServicio.deleteUsuario(this.usuarioId).subscribe(res => {
          const resp = res.json();
          this.msgs = [];
          if (resp === true) {
            this.doGetUsuarios();
            this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Usuario Eliminado' });
          } else {
            this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'Ocurrio un error Inesperado' });            
          }
         
        });
      
     }
   });
   
 }
}


