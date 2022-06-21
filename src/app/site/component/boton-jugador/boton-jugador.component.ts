import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Jugador } from '../../domain/Conjunto/Jugador';

@Component({
  selector: 'app-boton-jugador',
  templateUrl: './boton-jugador.component.html',
  styleUrls: ['./boton-jugador.component.css']
})
export class BotonJugadorComponent implements OnInit {
  @Input() datosJugador: Jugador;
  @Input() colorTipo: string;
  @Input() tecnico: boolean;

  @Output() devolverDatosJugador = new EventEmitter();
  styleNoche: any;
  color: string;
  numero: number;
  apellido: string;
  noestecnico = true;
  tecnicoTipo: string;

  constructor() {
  }
  ngOnInit() {
    if (this.datosJugador) {
      this.numero = this.datosJugador.Numero;
      if (this.tecnico) {
        this.apellido = this.datosJugador.Nombre + ' ' + this.datosJugador.Apellido;
        this.noestecnico = false;
        this.tecnicoTipo = this.datosJugador.Posicion;
      } else {
        this.apellido = this.datosJugador.Apellido;
        this.noestecnico = true;
      }

    }

  }
  onclickDevolverDatos() {
    this.devolverDatosJugador.emit(this.datosJugador);
  }

}
