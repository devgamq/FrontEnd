import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { MedalleroService } from '../../../service/conjunto/medallero.service';

@Component({
  selector: 'app-alineacion',
  templateUrl: './alineacion.component.html',
  styleUrls: ['./alineacion.component.css'],
  providers: [ConjuntoService, MedalleroService]
})
export class AlineacionComponent implements OnInit {
  deporte = 0;
  evento = 0;
  cronogramaId = 0;
  estadisticas: any[];
  Encuentro: any;
  constructor(
    private route: ActivatedRoute,
    private conjuntoService: ConjuntoService,
    private medalleroService: MedalleroService
  ) {
    this.evento = this.route.snapshot.params['eventoId'];
    this.cronogramaId = this.route.snapshot.params['cronogramaId'];
    this.deporte = this.route.snapshot.params['DeporteId'];
    this.estadisticas = [];
    this.Encuentro = {
      Equipo_A: '',
      Equipo_B: '',
      DelegacionId_A: 0,
      DelegacionId_B: 0,
      Representacion_A: '',
      Representacion_B: '',
      Marca_A: 0,
      Marca_B: 0,
      CronogramaId: 0,
      CompetidorId_A: 0,
      CompetidorId_B: 0
    };
  }

  ngOnInit() {
    this.init_estadisticas(this.cronogramaId, this.deporte);
  }
  private init_estadisticas(cronogramaId: number, deporteId: number) {
    this.medalleroService.GetResultadoEncuentro(this.cronogramaId).then(res => {
      if (res.length > 0) {
        this.Encuentro.Equipo_A = res[0].Equipo_A;
        this.Encuentro.Equipo_B = res[0].Equipo_B;
        this.Encuentro.DelegacionId_A = res[0].DelegacionId_A;
        this.Encuentro.DelegacionId_B = res[0].DelegacionId_B;
        this.Encuentro.Representacion_A = res[0].Representacion_A;
        this.Encuentro.Representacion_B = res[0].Representacion_B;
        this.Encuentro.Marca_A = res[0].Marca_A;
        this.Encuentro.Marca_B = res[0].Marca_B;
        this.Encuentro.CronogramaId = res[0].CronogramaId;
        this.Encuentro.CompetidorId_A = res[0].CompetidorId_A;
        this.Encuentro.CompetidorId_B = res[0].CompetidorId_B;
        this.Encuentro.Fecha = res[0].Fecha;
        this.conjuntoService
          .GetEstadisticoWeb(cronogramaId, deporteId)
          .then(d => {
            this.estadisticas = d;
          });
      }
    });
  }
}
