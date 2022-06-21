import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Delegacion } from '../../../../domain/Acreditacion/delegacion';
import { DelegacionService } from '../../../../service/Acreditacion/delegacion.service';
import { DropdownModule, SelectItem } from 'primeng/primeng';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delegacion-dropdown',
  templateUrl: './delegacion-dropdown.component.html',
  styleUrls: ['./delegacion-dropdown.component.css'],
  providers: [DelegacionService]
})
export class DelegacionDropdownComponent implements OnInit {

  delegaciones: SelectItem[];
  delegacionId: number;
  delegacion: Delegacion[];

  @Input() eventoId: number;
  @Input() todos = false;
  @Output() delegacionSelected = new EventEmitter();


  constructor(
    private delegacionService: DelegacionService,
  ) { }

  ngOnInit() {
    this.doGetDelegaciones();
  }

  doGetDelegaciones() {
    this.delegacionService
      .getDelegaciones(this.eventoId)
      .then(res => {
        this.delegaciones = res.map(item => {
          return {
            label: item.Nombre, value: item.DelegacionId
          };
        });
        if (this.todos) {
          this.delegaciones.unshift({ label: 'Todos', value: '0' });
        }
        this.delegacionSelected.emit({
          delegacionId: this.delegaciones.length > 0 ? this.delegaciones[0].value : 0,
          nombre: this.delegaciones[0].label
        });
      });
  }

  onChangeDelegacion($event) {
    this.delegacionSelected.emit({
      delegacionId: $event.value,
      Nombre: $event.originalEvent.currentTarget.innerText
    });
  }
}
