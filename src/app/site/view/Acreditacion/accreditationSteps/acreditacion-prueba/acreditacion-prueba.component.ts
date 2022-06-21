import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { Prueba } from 'app/site/domain/Acreditacion/prueba';
import { Card } from 'app/site/domain/Acreditacion/card';
import { DeporteService } from 'app/site/service/Acreditacion/deporte.service';
import { CardDeporteComponent } from '../card-deporte/card-deporte.component';
import { GrowlModule, Message } from 'primeng/primeng';

@Component({
  selector: 'app-acreditacion-prueba',
  templateUrl: './acreditacion-prueba.component.html',
  styleUrls: ['./acreditacion-prueba.component.css'],
  providers: [DeporteService]
})
export class AcreditacionPruebaComponent implements OnInit, OnChanges {
  pruebas: Card[];
  cambio: number = -1;
  value: any;
  msg: Message[] = [];
  @Input() eventoId = 1;
  @Input() deporteId = 2;
  @Input() esIndividual = 1;
  @Input() validatePrueba: boolean;
  @Output() pruebaId = new EventEmitter();

  constructor(private DeporteService: DeporteService) { }

  ngOnInit() {
    this.doGetPruebas();
    this.value = localStorage.getItem('pruebaId');
    if (this.value > -1) { this.cambio = Number(this.value); } else { this.cambio = -1; }
  }

  ngOnChanges(changes: SimpleChanges) {
    const chng = changes['validatePrueba'];
    const validateValue = JSON.stringify(chng.currentValue);
    if (validateValue === 'true') {
      this.onValid();
    }
  }
  doGetPruebas() {

    this.DeporteService.getPruebas(this.eventoId, this.deporteId, this.esIndividual)
      .then(res => {
        this.pruebas = res.map(item => {

          return {
            id: item.PruebaId, descripcion: item.PruebaDescripcion, icon: ''
          };
        });
      });
  }

  handleClick($evento) {
    this.cambio = $evento;
    localStorage.setItem('pruebaId', $evento);
  }

  onValid() {
    if (this.cambio > 0) { this.pruebaId.emit(this.cambio); } else {
      this.msg = [];
      this.pruebaId.emit(-1);
      this.msg.push({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar una prueba' });
    }
  }
}
