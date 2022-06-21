import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Deporte } from '../../../../domain/Acreditacion/deporte';
import { Card } from '../../../../domain/Acreditacion/card';
import { DeporteService } from '../../../../service/Acreditacion/deporte.service';
import { CardDeporteComponent } from '../card-deporte/card-deporte.component';
import { GrowlModule, Message } from 'primeng/primeng';

@Component({
  selector: 'app-acreditacion-deporte',
  templateUrl: './acreditacion-deporte.component.html',
  styleUrls: ['./acreditacion-deporte.component.css'],
  providers: [DeporteService]
})
export class AcreditacionDeporteComponent implements OnInit, OnChanges {
  deportes: Card[];
  cambio: number = -1;
  value: any;
  @Input() eventoId: number;
  @Input() validate: boolean;
  @Output() deporteId = new EventEmitter();
  msg: Message[] = [];

  constructor(private deporteService: DeporteService) { }

  ngOnInit() {
    this.doGetDeportes();
    this.value = localStorage.getItem('deporteId');
    if (this.value > 0) { this.cambio = Number(this.value); } else { this.cambio = -1; }
  }

  ngOnChanges(changes: SimpleChanges) {
    const chng = changes['validate'];
    const validateValue = JSON.stringify(chng.currentValue);
    if (validateValue === 'true') {
      this.onValid();
    }
  }

  doGetDeportes() {
    this.deporteService
      .getDeportes(this.eventoId)
      .then(res => {
        this.deportes = res.map(item => {
          return {
            id: item.DeporteId, descripcion: item.DeporteDescripcion, icon: ''
          };
        });
      });
  }
  handleClick($event) {
    this.cambio = $event;
    localStorage.setItem('deporteId', $event);
  }
  onValid() {
    if (this.cambio > 0) { this.deporteId.emit(this.cambio); } else {
      this.msg = [];
      this.msg.push({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un deporte' });
      this.deporteId.emit(-1);
    }
  }
}
