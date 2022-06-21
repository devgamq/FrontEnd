import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CardDeporteComponent } from '../card-deporte/card-deporte.component';
import { Card } from 'app/site/domain/Acreditacion/card';
import { Sexo } from 'app/site/domain/Acreditacion/sexo';
import { DeporteService } from 'app/site/service/Acreditacion/deporte.service';
import { GrowlModule, Message } from 'primeng/primeng';

@Component({
  selector: 'app-acreditacion-sexo',
  templateUrl: './acreditacion-sexo.component.html',
  styleUrls: ['./acreditacion-sexo.component.css'],
  providers: [DeporteService]
})
export class AcreditacionSexoComponent implements OnInit, OnChanges {
  ramas: Card[];
  cambio: number = -1;
  @Input() eventoId = 1;
  @Input() deporteId = 7;
  @Input() esIndividual = 1;
  @Input() pruebaId = 18;
  @Input() validateRama: boolean;
  @Output() ramaId = new EventEmitter();
  value: any;
  msg: Message[] = [];

  constructor(
    private deporteService: DeporteService
  ) { }

  ngOnInit() {
    this.doGetRamas();
    this.value = localStorage.getItem('ramaId');
    if (this.value > 0) { this.cambio = Number(this.value); } else { this.cambio = 0; }

  }
  // Method variables eventoId, deporteId, esIndividual, pruebaId
  doGetRamas() {
    this.deporteService
      .getRamas(this.eventoId, this.deporteId, this.esIndividual, this.pruebaId)
      .then(res => {
        this.ramas = res.map(item => {
          return {
            id: item.ParametroRamaId, descripcion: item.Nombre, icon: ''
          };
        });
      });
  }

  handleClick($event) {
    this.cambio = $event;
    localStorage.setItem('ramaId', $event);
  }

  ngOnChanges(changes: SimpleChanges) {
    const chan = changes['validateRama'];
    const validateRama = JSON.stringify(chan.currentValue);
    if (validateRama === 'true') { this.onValid(); }
  }
  onValid() {
    if (this.cambio > 0) { this.ramaId.emit(this.cambio); } else {
      this.msg = [];
      this.ramaId.emit(-1);
      this.msg.push({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccion una rama' });
    }
  }
}
