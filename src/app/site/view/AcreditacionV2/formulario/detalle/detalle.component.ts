import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { GrupoService } from 'app/site/service/Acreditacion/grupo.service';
import { RolService } from 'app/site/service/Acreditacion/rol.service';
import { PrivilegioService } from 'app/site/service/Acreditacion/privilegio.service';
import { Rol } from 'app/site/domain/Acreditacion/rol';
import { Grupo } from 'app/site/domain/Acreditacion/grupo';
import { Privilegio } from 'app/site/domain/Acreditacion/privilegio';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  providers: [RolService, GrupoService, PrivilegioService],
  encapsulation: ViewEncapsulation.None
})
export class DetalleComponent implements OnInit, OnChanges {
  grupoId: number;
  rolId: number;
  isSelect = false;
  Grupovali = false;
  Rolvali = false;
  dpDisableRol = true;

  _grupos: Grupo[];
  _roles: Rol[];
  _Privilegio: Privilegio[];

  @Input() grupo: Grupo;
  @Input() rol: Rol;

  @Input() PrivilegiosIdsInput?: string[];
  @Input() bandera?: any;
  @Input() clearData = false;
  @Input() EventoId = 1;

  @Output() RolOut = new EventEmitter();
  @Output() GrupoOut = new EventEmitter();
  @Output() restore = new EventEmitter();
  colorStyle: string;

  constructor(
    private http: Http,
    private grupoService: GrupoService,
    private rolService: RolService,
    private activatedRoute: ActivatedRoute,
    private privilegioService: PrivilegioService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const chng = changes['bandera'];
    const banderaValue = JSON.stringify(chng.currentValue);
    if (this.rol) {
      this.dpDisableRol = false;
    }
    if (banderaValue === 'true') {
      if (this.bandera) {
        this.onValid();
      }
    }
    if (this.rol) {
      this.privilegioService.getPrivilegiosRol(this.EventoId, this.rol.RolId)
        .then(res => {
          this._Privilegio = res;
        });
    }

  }

  doGetGrupos() {
    this.grupoService
      .getGrupos(this.EventoId)
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

  handleDropdown(event) {
    this.doGetGrupos();
  }
  handleDropdownRol(event) {
    this.doGetRol();
  }
  onSelectGrupo(event) {
    this.dpDisableRol = false;
  }
  onSelectRol(event) {

    this.privilegioService.getPrivilegiosRol(this.EventoId, this.rol.RolId)
      .then(res => {
        this._Privilegio = res;
      });
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
        this.GrupoOut.emit(this.grupo);
        this.RolOut.emit(this.rol);
      }
    }
  }

}
