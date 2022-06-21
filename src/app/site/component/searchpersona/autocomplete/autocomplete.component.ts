import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectItem, Message } from 'primeng/primeng';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { CompetidorPersona } from '../../../domain/Conjunto/CompetidorPersona';
import { Persona } from '../../../domain/shared/Persona';



@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  providers: [ConjuntoService]
})

export class AutocompleteComponent implements OnInit, OnChanges {

  @Output() NombrePersona = new EventEmitter();
  @Input() servicioMostrar: string;
  @Input() mostrarNombre: boolean;

  @Input() competidorId: number;
  @Input() planillaId: number;
  @Input() limpiar: boolean;
  @Input() eventoId: number;


  @Input() _Persona: any;
  Personas: any[];
  lista_personas: any[];
  constructor(private conjuntoService: ConjuntoService) {
    this.Personas = [];
  }
  doSearchPersonas(event) {
    const query = event.query;
    switch (this.servicioMostrar) {
      case 'getSearchPersona':
        this.conjuntoService.getSearchPersona(this.competidorId, this.planillaId, query)
          .then(res => {
            this.Personas = res;

          });
        break;
      default:
        confirm('no existe esa opcion');
    }
  }
  doSelectSearchPersona($event) {
    if (!this.mostrarNombre) {
      // tslint:disable-next-line:no-construct
      $event.NombreCompleto = new String(' ');
    }
    this.NombrePersona.emit($event);
  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    try {
      const evento = changes['limpiar'];
      const validateRama = JSON.stringify(evento.currentValue);

      if (validateRama === 'true') { this._Persona = ''; }
    } catch (error) { }
  }

}
