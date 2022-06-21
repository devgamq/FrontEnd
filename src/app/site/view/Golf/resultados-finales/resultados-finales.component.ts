import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultadosServices } from '../../../service/Golf/ResultadosFinales';
import { JornadaDropDown } from '../jornada-golf/jornada-dropdown/jornada-dropdown.component';
import { GolfService } from '../../../service/Golf/golf.service';

@Component({
  selector: 'app-resultados-finales',
  templateUrl: './resultados-finales.component.html',
  styleUrls: ['./resultados-finales.component.css'],
  providers: [ResultadosServices, GolfService]
})
export class ResultadosFinalesComponent implements OnInit, AfterViewInit {
  categoriaId: number;
  eventoId: number;
  TotalesTorneo: string[];
  cols: any[] = [];
  categoria: string;
  constructor(
    private ResultadosServices: ResultadosServices,
    private activedRoute: ActivatedRoute,
    private golfService: GolfService
  ) {
    this.eventoId = +this.activedRoute.snapshot.params['eventoId'];
  }

  ngOnInit() {
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    if (this.categoriaId) {
      this.doLoadResultadosFinales();
    }
  }

  onChangeCategoria($event) {
    this.categoriaId = $event.categoriaId;
    this.categoria = $event.descripcion;
    if (this.categoriaId) {
      this.doLoadResultadosFinales();
    }
  }

  doLoadResultadosFinales() {
    this.ResultadosServices.getGolfTotalesTorneo(
      this.eventoId,
      this.categoriaId
    ).then(resultado => {
      this.TotalesTorneo = resultado;

      this.cols = [];

      // tslint:disable-next-line:forin
      for (const key in resultado['0']) {
        this.cols.push({ field: key, header: key });
      }
      for (let i = 0; i < resultado.length; i++) {
        const x = resultado[`${i}`]['Score'];
        if (x > 0) {
          resultado[`${i}`]['Score'] = `+${x}`;
        }

      }
      this.TotalesTorneo = resultado;

    });
  }

  doReporte() {
    this.golfService
      .GetResultadosFinales(this.categoriaId, this.eventoId, this.categoria)
      .then(res => {
        // let url = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
        window.open(URL.createObjectURL(res));
      });
  }
  doOpenVisor() {
    window.open(`#/visor-jornada/${this.eventoId}`);
  }
}
