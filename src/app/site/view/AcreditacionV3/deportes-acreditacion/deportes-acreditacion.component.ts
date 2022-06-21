import { Component, OnInit } from '@angular/core';
import {DropdownModule} from 'primeng/primeng';
import { GrupoService } from '../../../service/Acreditacion/grupo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RolService } from '../../../service/Acreditacion/rol.service';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import {MultiSelectModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {DataGridModule} from 'primeng/primeng';
import { DetallePersonaService } from '../../../service/Acreditacion/detalle-persona.service';
@Component({
  selector: 'app-deportes-acreditacion',
  templateUrl: './deportes-acreditacion.component.html',
  styleUrls: ['./deportes-acreditacion.component.css'],
  providers: [DetallePersonaService,RolService,GrupoService, DeporteService]
})

export class DeportesAcreditacionComponent implements OnInit {
  eventoId: number;
  grupos:any[];
  GrupoId:number;
  roles:any[];
  RolId:number;
  deportes:any[];
  DeporteId:number;
  pruebas: any[];
  pruebasId: any[];
  pruebaSelecionada: any[];
  mostrarDialogoRama=false;
  mostrarDialogoPersona=false;
  ramasSeleccion:any[];
  delegacionId: number;
  listaCompetidores:any[];
  constructor(private rolService: RolService,
              private grupoService: GrupoService,
              private detallePersonaService: DetallePersonaService,
              private route: ActivatedRoute,
              private activedRoute: ActivatedRoute,
              private deporteService: DeporteService) { 
    this.eventoId = this.activedRoute.snapshot.params['eventoId'];
  }

  ngOnInit() {
    this.delegacionId = 0;
    this.doGetGrupos();
    this.doGetInscripcionEventoDelegacion();
  }

  doGetGrupos() {
    this.grupos = [];
    this.grupos.push({label:'Seleccione Grupo', value:null});
    this.grupoService
      .getGrupos(this.eventoId)
      .then(res => {
        const aux = res;
        aux.forEach(element => {
          this.grupos.push({ label: element.GrupoDescripcion, value: element.GrupoId });
        });

      });
  }

  seleccionarGrupo(){
    this.doGetRol();
  }

  doGetRol() {
    this.roles = [];
    this.roles.push({label:'Seleccione Rol', value:null});
    this.rolService
      .getRol(this.GrupoId)
      .then(res => {
        const aux = res;
        aux.forEach(element => {
          this.roles.push({ label: element.RolDescripcion, value: element.RolId });
        });
      });
  }
  seleccionarRol(){
    this.doGetDeportes();
  }
  doGetDeportes() {
    this.deportes = [];
    this.deportes.push({label:'Seleccione Deporte', value:null});
    this.deporteService
      .getDeportes(this.eventoId)
      .then(res => {
        const aux = res;
        aux.forEach(element => {
          this.deportes.push({ label: element.DeporteDescripcion, value: element.DeporteId });
        });
      });
  }
  seleccionarDeporte(){
    this.doGetPruebas();
  }
  doGetPruebas() {
    this.pruebas = [];
    this.deporteService.getPruebas(this.eventoId, this.DeporteId, 1).then(res => {
      res.forEach(item => {
        this.pruebas.push({ label: item.PruebaDescripcion, value: item.PruebaId });
      });
    });
  }
  registrarRamas(){
    this.pruebaSelecionada = [];
    this.pruebasId.forEach(item => {
     var consulta2 = this.pruebas.filter(function (c) {
      return c.value==item; 
    });
    this.pruebaSelecionada.push(consulta2[0]);
    this.mostrarDialogoRama=true;
    });
    
  }
  registrarCompetidor(){
    this.mostrarDialogoPersona=true;
  }
  cerrarDialogoRama(){
    this.mostrarDialogoRama=false;
  }
  colocarRamas($event){
    this.ramasSeleccion=$event;
    this.mostrarDialogoRama=false;
  }
  doGetInscripcionEventoDelegacion() {
    this.listaCompetidores = [];
    this.detallePersonaService
      .getDetalleInscripcionEnventoDelegacion(this.eventoId, this.delegacionId)
      .then(res => {
        console.log(res);
        this.listaCompetidores=res;
      });
  }

}
