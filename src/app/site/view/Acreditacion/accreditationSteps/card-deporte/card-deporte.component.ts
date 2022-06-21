import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../../domain/Acreditacion/card';
@Component({
  selector: 'app-card-deporte',
  templateUrl: './card-deporte.component.html',
  styleUrls: ['./card-deporte.component.css']
})
export class CardDeporteComponent implements OnInit {

  @Input() card: Card;
  @Input() cambio: number;
  @Output() OnClick = new EventEmitter();
  cantidad: number;

  constructor() { }
  ngOnInit() {
  }

  clickSport(id: number) {
    if (this.cambio === this.card.id) {
      this.OnClick.emit(-1);
    } else {
      this.OnClick.emit(this.card.id);
    }
  }
}
