import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CardDeporteComponent } from '../card-deporte/card-deporte.component';
import { Card } from 'app/site/domain/Acreditacion/card';
import { Tipo } from 'app/site/domain/Acreditacion/tipo';
import { DeporteService } from 'app/site/service/Acreditacion/deporte.service';
import { GrowlModule, Message } from 'primeng/primeng';

@Component({
  selector: 'app-acreditacion-tipo',
  templateUrl: './acreditacion-tipo.component.html',
  styleUrls: ['./acreditacion-tipo.component.css'],
  providers: [DeporteService],
})
export class AcreditacionTipoComponent implements OnInit, OnChanges {
  tipos: Card[];
  cambio: number = -1;
  value: any;
  @Input() eventoId = 1;
  @Input() deporteId = 2;
  @Input() validateTipo: boolean;
  @Output() tipoPruebaId = new EventEmitter();
  msg: Message[] = [];

  constructor(
    private deporteService: DeporteService
  ) { }

  ngOnInit() {
    this.doGetTipos();
    this.value = localStorage.getItem('tipoPruebaId');
    if (this.value > -1 && this.value) { this.cambio = Number(this.value); } else { this.cambio = -1; }
  }
  ngOnChanges(changes: SimpleChanges) {
    const chng = changes['validateTipo'];
    const validateValue = JSON.stringify(chng.currentValue);
    if (validateValue === 'true') {
      this.onValid();
    }
  }

  doGetTipos() {
    this.deporteService
      .getTipos(this.eventoId, this.deporteId)
      .then(res => {
        this.tipos = res.map(item => {
          return {
            id: item.EsIndivudual, descripcion: item.Detalle, icon: ''
          };
        });
      });
  }

  handleClick($event) {
    this.cambio = $event;
    localStorage.setItem('tipoPruebaId', $event);
  }

  onValid() {
    if (this.cambio > -1) { this.tipoPruebaId.emit(this.cambio); } else {
      this.msg = [];
      this.msg.push({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar una prueba' });
      this.tipoPruebaId.emit(-1);
    }
  }

}
