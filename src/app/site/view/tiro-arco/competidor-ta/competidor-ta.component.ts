import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { TiroArcoService } from '../../../service/simple/tiro_arco';
import { Persona } from '../../..//domain/tiro_arco/persona';
import { RadioButtonModule } from 'primeng/primeng';
@Component({
  selector: 'app-competidor-ta',
  templateUrl: './competidor-ta.component.html',
  styleUrls: ['./competidor-ta.component.css'],
  providers: [TiroArcoService],
  encapsulation: ViewEncapsulation.None
})
export class CompetidorTaComponent implements OnInit {
  @Input() cronogramaId: number;
  @Input() CompetidorId: number;
  @Input() planillaId: number;
  @Input() grupo: string;
  @Output() getPersonaId = new EventEmitter();

  lista: Persona[];
  selectedValue: any;
  constructor(private tiroArcoService: TiroArcoService) {
    this.lista = [];
  }

  ngOnInit() {
    this.getPersonal();
  }

  private getPersonal() {

    this.tiroArcoService
      .GetPersonal(this.cronogramaId, this.CompetidorId)
      .then(res => {
        this.lista = res;
        if (this.lista.length > 0) {
          this.selectedValue = this.lista[0].PersonaId;
          this.getPersonaId.emit(this.selectedValue);
        }
      });
  }

  onRowSelect($event) {
    console.log($event.data);
    this.getPersonaId.emit($event.data);
  }
}
