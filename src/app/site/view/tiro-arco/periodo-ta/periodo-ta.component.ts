import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TiroArcoService } from '../../../service/simple/tiro_arco';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { Periodo } from '../../../domain/Conjunto/periodo';

@Component({
  selector: 'app-periodo-ta',
  templateUrl: './periodo-ta.component.html',
  styleUrls: ['./periodo-ta.component.css'],
  providers: [TiroArcoService, ConfirmationService]
})
export class PeriodoTaComponent implements OnInit {
  @Input() planillaId = 0;
  @Input() cronogramaId = 0;
  @Input() Prueba = '';
  @Output() getPeriodoId = new EventEmitter();
  @Output() closedPeriodo = new EventEmitter();
  @Output() getMensaje = new EventEmitter();

  periodo: any;
  correlativo = 0;
  posicion = 0;
  nombre = '';
  constructor(
    private tiroArcoService: TiroArcoService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.nombre = this.Prueba.includes('ecurvo') ? 'Set' : 'Ronda';
    this.CheckPeriodos(1, this.posicion);
  }

  private CheckPeriodos(sw: number, valor: number) {
    const periodo = { sw: sw, valor: valor, PlanillaId: this.planillaId };

    this.tiroArcoService.CheckPeriodos(periodo).subscribe(res => {
      this.periodo = res.json()[0];
      this.correlativo = this.periodo.Correlativo;
      this.getPeriodoId.emit(this.periodo);
    });
  }
  siguientePeriodo() {
    this.confirmationService.confirm({
      message: 'Desea ir al siguiente periodo?',
      accept: () => {
        this.posicion++;
        this.CheckPeriodos(1, this.posicion);
      }
    });
  }
  anteriorPeriodo() {
    this.posicion = this.correlativo - 2;
    this.CheckPeriodos(0, this.correlativo);
  }
  cerrarPeriodo() {
    const cierre = { PlanillaId: this.planillaId, PeriodoId: this.periodo.PeriodoId };
    this.tiroArcoService.cerrarPeriodo(cierre).subscribe(res => {
      const data = res.json()[0];

      const msm = {
        mensaje: Number(data.Resultado) < 0 ? data.Mensaje : 'Periodo ' + this.correlativo + 'S ha sido cerrado'
        , tipoMensaje: Number(data.Resultado) < 0 ? 'danger' : 'success'
      };
      this.getMensaje.emit(msm);
      this.closedPeriodo.emit(this.periodo);
    });
  }
}
