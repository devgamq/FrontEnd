import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MedalleroService } from '../../../service/conjunto/medallero.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Console } from '@angular/core/typings/src/console';
import { JasperService } from '../../../service/Conjunto/jasper.service';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';

@Component({
  selector: 'app-resumen-partido',
  templateUrl: './resumen-partido.component.html',
  styleUrls: ['./resumen-partido.component.css'],
  providers: [MedalleroService, ConjuntoService, JasperService, DeporteService],
  encapsulation: ViewEncapsulation.None
})
export class ResumenPartidoComponent implements OnInit {
  Encuentro: any;
  Delegacion_B: string;
  deporte: any;
  nombreDeporte: any;
  evento: any;
  cronogramaId: any;
  planillaA: any[];
  planillaB: any[];
  suplentesA: any[];
  suplentesB: any[];
  ResultadosVoley: any[];
  ResultadosBaloncesto: any[];

  personalTecnicoA: any[];
  personalTecnicoB: any[];

  anotacionesB: any[];
  anotacionesA: any[];

  FaltasA: any[];
  FaltasB: any[];

  estadisticas: any[];
  arbitros: any[];

  planillaBaloncestoA: any[];
  planillaBaloncestoB: any[];

  GolesA: any;
  GolesB: any;

  constructor(
    private medalleroService: MedalleroService,
    private conjuntoService: ConjuntoService,
    private jasperService: JasperService,
    private route: ActivatedRoute,
    private deporteService: DeporteService,
  ) {
    this.evento = this.route.snapshot.params['eventoId'];
    this.cronogramaId = this.route.snapshot.params['cronogramaId'];
    this.deporte = this.route.snapshot.params['deporte'];
    this.planillaA = [];
    this.planillaB = [];

    this.suplentesA = [];
    this.suplentesB = [];

    this.personalTecnicoA = [];
    this.personalTecnicoB = [];

    this.anotacionesA = [];
    this.anotacionesB = [];

    this.FaltasA = [];
    this.FaltasB = [];

    this.estadisticas = [];
    this.ResultadosVoley = [];
    this.ResultadosBaloncesto = [];
    this.arbitros = [];

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
    this.initCabecera();
    this.getNombreDeporte();
  }
  private getNombreDeporte() {
    this.deporteService.getDeportes(this.evento).then(res => {
      console.log(res)
      if (res.length > 0) {
        this.nombreDeporte = res.filter(
          item => Number(item.DeporteId) === Number(this.deporte)
        )[0].DeporteDescripcion;
      }
    });
  }
  private initCabecera() {
    this.medalleroService.GetResultadoEncuentro(this.cronogramaId).then(res => {
      if (res.length > 0) {
        // console.clear();
        console.log(res);
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

        this.initJugadores(
          this.cronogramaId,
          this.Encuentro.CompetidorId_A, 1, 1
        );
        this.initJugadores(
          this.cronogramaId,
          this.Encuentro.CompetidorId_B, 2, 1
        );
        this.initJugadores(
          this.cronogramaId,
          this.Encuentro.CompetidorId_A, 1, 2
        );
        this.initJugadores(
          this.cronogramaId,
          this.Encuentro.CompetidorId_B, 2, 2
        );
        this.initPTA(this.cronogramaId, this.Encuentro.CompetidorId_A, 3, 0);
        this.initPTB(this.cronogramaId, this.Encuentro.CompetidorId_B, 3, 0);

        this.initAnotacionesA(
          this.cronogramaId,
          this.Encuentro.CompetidorId_A,
          this.deporte
        );
        this.initAnotacionesB(
          this.cronogramaId,
          this.Encuentro.CompetidorId_B,
          this.deporte
        );
        this.initFaltasB(
          this.cronogramaId,
          this.Encuentro.CompetidorId_B,
          this.deporte
        );
        this.initFaltasA(
          this.cronogramaId,
          this.Encuentro.CompetidorId_A,
          this.deporte
        );

        this.init_estadisticas(this.cronogramaId, this.deporte);
        this.getResultadosWeb(this.cronogramaId, this.deporte);
        this.GetResultadosBaloncesto(this.cronogramaId);
        this.initArbitraje(this.cronogramaId);
        this.GetPlanillaBaloncestoA(
          this.cronogramaId,
          this.Encuentro.CompetidorId_A
        );
        this.GetPlanillaBaloncestoB(
          this.cronogramaId,
          this.Encuentro.CompetidorId_B
        );
      }
    });
  }
  private initJugadores(
    cronogramaId: number,
    competidor,
    indice: number,
    parametro: number
  ) {
    this.conjuntoService
      .getPlanilla(cronogramaId)
      .then(res => {

        if (res.length > 0) {
          const planillaId = Number(res[0].PlanillaId);

          this.conjuntoService
            .GetPlanillas(competidor, planillaId, '', parametro)
            .then(item => {
              const jugadores = item.map(p => {
                return {
                  NumeroCamiseta: p.NumeroCamiseta,
                  Posicion: p.Posicion,
                  NombreJugador: p.Persona.NombreCompleto,
                  FotoUrl: p.FotoUrl
                };
              });
              if (parametro === 1) {
                if (indice === 1) {
                  this.planillaA = jugadores;
                } else { this.planillaB = jugadores; }
              } else {
                if (indice === 1) {
                  this.suplentesA = jugadores;
                } else { this.suplentesB = jugadores; }
              }
            });

        }

      });


  }


  private initPTA(
    cronogramaId: number,
    competidor,
    parametro: number,
    deporte: number
  ) {
    this.conjuntoService
      .getJugadores(cronogramaId, competidor, parametro, deporte)
      .then(res => {
        this.personalTecnicoA = res;
      });
  }
  private initPTB(
    cronogramaId: number,
    competidor,
    parametro: number,
    deporte: number
  ) {
    this.conjuntoService
      .getJugadores(cronogramaId, competidor, parametro, deporte)
      .then(res => {
        this.personalTecnicoB = res;
      });
  }
  private initAnotacionesB(cronogramaId: number, competidor, deporte: number) {
    this.conjuntoService
      .getGoles(cronogramaId, competidor, deporte)
      .then(res => {
        this.anotacionesB = res.sort((a, b) => {
          if (b.Tiempo > a.Tiempo) {
            return -1;
          } else {
            if (b.Tiempo < a.Tiempo) {
              return 1;
            } else {
              return 0;
            }
          }
        });
        this.GolesB = this.anotacionesB.length;
      });
  }
  private initAnotacionesA(cronogramaId: number, competidor, deporte: number) {
    this.conjuntoService
      .getGoles(cronogramaId, competidor, deporte)
      .then(res => {
        this.anotacionesA = res.sort((a, b) => {
          if (b.Tiempo > a.Tiempo) {
            return -1;
          } else {
            if (b.Tiempo < a.Tiempo) {
              return 1;
            } else {
              return 0;
            }
          }
        });
        this.GolesA = this.anotacionesA.length;
      });
  }
  private initFaltasA(cronogramaId: number, competidor, deporte: number) {
    this.conjuntoService
      .getAmonestaciones(cronogramaId, competidor, deporte)
      .then(res => {
        this.FaltasA = res;
      });
  }
  private initFaltasB(cronogramaId: number, competidor, deporte: number) {
    this.conjuntoService
      .getAmonestaciones(cronogramaId, competidor, deporte)
      .then(res => {
        this.FaltasB = res;
      });
  }

  private init_estadisticas(cronogramaId: number, deporteId: number) {
    this.conjuntoService
      .GetEstadisticoWeb(cronogramaId, deporteId)
      .then(res => {
        this.estadisticas = res;
      });
  }
  private getResultadosWeb(cronogramaId: number, deporteId: number) {
    this.conjuntoService.GetResultadosWeb(cronogramaId, deporteId).then(res => {
      this.ResultadosVoley = res;
    });
  }
  private GetResultadosBaloncesto(cronogramaId: number) {
    this.conjuntoService.GetResultadosBaloncesto(cronogramaId).then(res => {
      this.ResultadosBaloncesto = res;
    });
  }
  private GetPlanillaBaloncestoA(cronogramaId: number, competidorId: number) {
    this.conjuntoService
      .GetPlanillaBaloncesto(cronogramaId, competidorId)
      .then(res => {
        this.planillaBaloncestoA = res;
      });
  }
  private GetPlanillaBaloncestoB(cronogramaId: number, competidorId: number) {
    this.conjuntoService
      .GetPlanillaBaloncesto(cronogramaId, competidorId)
      .then(res => {
        this.planillaBaloncestoB = res;
      });
  }

  private initArbitraje(cronogramaId: number) {
    this.conjuntoService.GetPlanillaArbitraje(cronogramaId).then(res => {
      this.arbitros = res;
    });
  }
  imprimir() {
    this.jasperService
      .getResumenPartido(this.evento, this.deporte, this.cronogramaId)
      .then(res => {
        window.open(URL.createObjectURL(res));
      });
  }
}
