import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Parametro } from '../../../domain/Conjunto/parametros';

@Component({
  selector: 'app-boton-conjunto',
  templateUrl: './boton-conjunto.component.html',
  styleUrls: ['./boton-conjunto.component.css']
})
export class BotonConjuntoComponent implements OnInit {

  @Input() DatosParametros: Parametro;
  @Output() datoParametros = new EventEmitter();
  private styleNoche: any;
  color: string;
  constructor() { }

  ngOnInit() {
    this.styleNoche = { 'color': 'white', 'background-color': this.DatosParametros.Color };
    this.color = this.styleNoche;
  }

  mostrarMarcador() {
    this.datoParametros.emit(this.DatosParametros);
  }

}
