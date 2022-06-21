import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { TiroArcoService } from '../../../service/simple/tiro_arco';

@Component({
  selector: 'app-set-total-ta',
  templateUrl: './set-total-ta.component.html',
  styleUrls: ['./set-total-ta.component.css'],
  providers: [TiroArcoService],
  encapsulation: ViewEncapsulation.None
})
export class SetTotalTaComponent implements OnInit, OnChanges {
  @Input() PeriodoId = 0;
  @Input() PlanillaId = 0;
  @Input() PuntoId = 0;
  @Input() Prueba = '';
  cols: any[] = [];
  lista: any[];
  nombreTotal = '';
  nombreTotalGeneral = '';
  constructor(private tiroArcoService: TiroArcoService) {
    this.lista = [];
  }

  ngOnInit() {
    this.nombreTotal = this.Prueba.includes('ecurvo') ? 'Sum.' : 'SubTotal';
    this.nombreTotalGeneral = this.Prueba.includes('ecurvo') ? 'Ptos.Set' : 'Total';
  }

  private initDatosPuntaje() {
    this.cols = [];
    this.tiroArcoService
      .GetPuntosSet(this.PlanillaId, this.PeriodoId)
      .then(res => {
        console.log(res);
        // tslint:disable-next-line:forin
        for (const key in res['0']) {
          if (!isNaN(Number(key))) {
            this.cols.push({ field: key, header: key });
          }
        }
        // tslint:disable-next-line:forin
        for (const i in res) {
          // tslint:disable-next-line:forin
          for (const j in res[i]) {
            const valor = res[i][j];
            if (!isNaN(valor) && Number(valor) < 0) {
              const num = Number(valor) * -1;
              res[i][j] = num + '*';
            }
          }
        }

        this.lista = res;
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    const periodo =
      changes['PeriodoId'] === undefined
        ? 0
        : Number(changes['PeriodoId'].currentValue);
    const PuntoId =
      changes['PuntoId'] === undefined
        ? 0
        : Number(changes['PuntoId'].currentValue);

    if (this.PeriodoId > 0) {
      this.initDatosPuntaje();
    }
  }
}
