import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { GrupoService } from '../../../service/Acreditacion/grupo.service';
import { RolService } from '../../../service/Acreditacion/rol.service';
import { DelegacionService } from '../../../service/Acreditacion/delegacion.service';
import { PrivilegioService } from 'app/site/service/Acreditacion/privilegio.service';
import { Rol } from '../../../domain/Acreditacion/rol';
import { Delegacion } from '../../../domain/Acreditacion/delegacion';
import { Grupo } from '../../../domain/Acreditacion/grupo';
import { Privilegio } from 'app/site/domain/Acreditacion/privilegio';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-privilegios-acreditacion',
  templateUrl: './privilegios-acreditacion.component.html',
  styleUrls: ['./privilegios-acreditacion.component.css'],
  providers: [RolService, GrupoService, PrivilegioService,DelegacionService],
  encapsulation: ViewEncapsulation.None
})
export class PrivilegiosAcreditacionComponent implements OnInit, OnChanges {

  // Variables
  //  roles: SelectItem[];
  //  grupos: SelectItem[];
  ///selectedGrupo: string = 'Seleccione';
  grupoId: number;
  rolId: number;
  deleId:number;
  isSelect = false;
  Grupovali = false;
  Rolvali = false;
  dpDisableRol = true;
  dpDisableDele= true;
  _grupos: Grupo[];
  _roles: Rol[];
  _Privilegio: Privilegio[];
  _delegacion: Delegacion[];
  @Input() grupo: Grupo;
  @Input() rol: Rol;
  @Input() dele: Delegacion;
  

  @Input() PrivilegiosIdsInput?: string[];
  @Input() bandera?: any;
  @Input() clearData = false;
  @Input() eventoId?: number;

  @Output() RolOut = new EventEmitter();
  @Output() GrupoOut = new EventEmitter();
  @Output() DeleOut = new EventEmitter();
  @Output() restore = new EventEmitter();
  colorStyle: string;

  constructor(
    private http: Http,
    private grupoService: GrupoService,
    private rolService: RolService,
    private DeleService: DelegacionService,
    private activatedRoute: ActivatedRoute,
    private privilegioService: PrivilegioService
  ) { }

  ngOnInit() {
    this.doGetDelegacion();
  }

  ngOnChanges(changes: SimpleChanges) {
    const chng = changes['bandera'];
    const banderaValue = JSON.stringify(chng.currentValue);
    if (this.rol) {
      this.dpDisableRol = false;
      this.dpDisableDele= false;
    }
    if (this.dele) {
       this.dpDisableDele= false;
    }
    if (banderaValue === 'true') {
      if (this.bandera) {
        this.onValid();
      }
    }
    if (this.rol) {
      this.privilegioService.getPrivilegiosRol(this.eventoId, this.rol.RolId)
        .then(res => {
          this._Privilegio = res;
        });
    }
    
    
    

  }

  doGetGrupos() {
    this.grupoService
      .getGrupos(this.eventoId)
      .then(res => {
        this._grupos = res;
      });
  }

  doGetRol() {
    this.rolService
      .getRol(this.grupo.GrupoId)
      .then(res => {
        this._roles = res;
      });
  }
  doGetDelegacion() {
    this.DeleService
      .getDelegaciones(this.eventoId)
      .then(res => {
        this._delegacion = res;
        console.log('Evento ', this.eventoId)
        console.log('paises: ', res)
      });
  }
  handleDropdown(event) {
    this.doGetGrupos();
  }
  handleDropdownRol(event) {
    this.doGetRol();
  }
  handleDropdownPais(event) {
    this.doGetDelegacion();
  }
  
  onSelectGrupo(event) {
    this.dpDisableRol = false;
  }
  onSelectRol(event) {
    this.dpDisableDele = false;//dpDisableDele
    this.privilegioService.getPrivilegiosRol(this.eventoId, this.rol.RolId)
      .then(res => {
        this._Privilegio = res;
      });
  }
  onSelectPais($event)
    {
        console.log('El elegido es: ',this.dele)
    }
  isSelectDrop() {
    return this.isSelect;
  }

  // Borrar cuando se una al componente
  onValid() {
    if ((!this.rol) && (!this.grupo)) {
      this.restore.emit(false);
    } else {
      if ((!this.rol) || (!this.grupo)) {
        this.restore.emit(false);
      } else {
        if(this.dele)
        {
            this.GrupoOut.emit(this.grupo);
            this.RolOut.emit(this.rol);
            this.DeleOut.emit(this.dele);
            console.log('DAtos de Salida:', this.grupo ,this.rol, this.dele);
        }   
      }
    }
  }
}
