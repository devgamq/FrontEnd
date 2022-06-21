import { Component, OnInit } from '@angular/core';
import { Rol } from 'app/site/domain/Acreditacion/rol';
import { Grupo } from 'app/site/domain/Acreditacion/grupo';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  Rol: Rol;
  Grupo: Grupo;
  banderaStep2 = false;
  clearDataStep2 = false;
  constructor() { }

  ngOnInit() {
  }
  HandleRol($event) {

  }
  HandleGrupo($event) {
    this.Grupo = $event;
  }
  hanldeRestoreStep2($event) {
    this.banderaStep2 = $event;
}
}
