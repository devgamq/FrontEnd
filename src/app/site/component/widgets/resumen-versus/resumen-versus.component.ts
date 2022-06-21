import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { PodioService } from '../../../service/conjunto/podio.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Util } from '../../../view/Futbol/util';
import { PipeFechaComponent } from '../../../view/reportes/pipe-fecha/pipe-fecha.component';

@Component({
  selector: 'app-resumen-versus',
  templateUrl: './resumen-versus.component.html',
  styleUrls: ['./resumen-versus.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [PodioService, ConjuntoService]
})
export class ResumenVersusComponent implements OnInit, OnChanges, AfterViewInit {
  data: any[];
  datos: any[];
  masterData: any[];
  @Input() eventoId: number;
  @Input() tiempo: number;
  @Input() Refresh = false;
  formato: PipeFechaComponent;
  deporte: string;
  fecha: Date;
  fase: string;

  @Input() deporteId: number;
  style: any;
  private style_fondo: any;
  private style_titulo: any;
  private dia: number;
  @Input() fechas: Date[];
  utilidad: Util;
  private contador: number;
  private limite: number;
  class_jornada = '';
  class_resultado = 'resultado';
  timer: any;
  hilo: any;
  constructor(
    private podioService: PodioService,
    private conjuntoService: ConjuntoService
  ) {
    this.data = [];
    this.datos = [];
    this.masterData = [];
    this.dia = 0;
    this.fechas = [];
    this.deporteId = 3;
    this.utilidad = new Util();
    this.limite = 5;
    this.contador = 0;
    this.deporte = 'CARGANDO....';
    this.formato = new PipeFechaComponent();
  }

  ngOnInit() {
    this.clean();
    this.data = [];
    this.initCss();
    if (this.eventoId === 3) {
      this.class_jornada = 'jornada3';
      this.class_resultado = 'resultado3';
      this.limite = 5;
    }
  }
  clean() {
    console.log('limpio');
    clearInterval(this.timer);
    clearInterval(this.hilo);
  }
  ngAfterViewInit() {
    this.clean();
    this.initHilo();
  }
  private initHilo() {
    this.hilo = setInterval(() => {
      this.initFechas();
    }, 240000);
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.clear();
    this.clean();
    this.initFechas();
  }
  private initFechas() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.masterData = [];
    this.contador = 0;
    this.dia = 0;

    this.LoadFixture(true);
  }
  private initCss() {
    // this.eventoId = 3; // se debe borrar
    this.style = {
      'background-image':
        'url(assets/0' + this.eventoId + '/fondos/d' + this.deporteId + '.png)'
    };

    this.style_fondo = {
      'background-image':
        'url(assets/0' + this.eventoId + '/fondos/fondopodio.png)'
    };
    switch (this.eventoId) {
      case 1:
        this.style_titulo = { color: '#972020' };
        break;
      case 2:
        this.style_titulo = { color: '#012C72' };
        break;
      default:
        this.style_titulo = { color: '#000' };
        break;
    }
  }

  randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  private LoadFixture(iterar: boolean) {
    try {
      // this.eventoId = 2; // se debe borrar
      this.podioService
        .GetJornadaConjunto(
          this.deporteId,
          this.fechas[0],
          //  this.fechas[this.dia],
          this.eventoId
        )
        .then(res => {
          if (res.length > 0) {

            this.data = res.map(item => {
              return {
                BanderaA: `assets/banderas/${item.DelegacionIdA}.png`,
                BanderaB: `assets/banderas/${item.DelegacionIdB}.png`,
                DelegacionIdA: item.FotoA === null
                  ? `assets/banderas/${item.DelegacionIdA}.png`
                  : item.FotoA,
                DelegacionIdB: item.FotoB === null
                  ? `assets/banderas/${item.DelegacionIdB}.png`
                  : item.FotoB,
                CronogramaId: item.CronogramaId,
                EventoId: item.EventoId,
                Fecha: item.Fecha,
                HoraProgramada: item.HoraProgramada,
                Deporte: item.Deporte,
                Rama: item.Rama,
                Fase: item.Fase,
                Estado: item.Estado,
                InstalacionId: item.InstalacionId,
                Instalacion: item.Instalacion,
                EquipoA: item.NombreReducidoEquipoA,
                EquipoB: item.NombreReducidoEquipoB,
                MarcadorEquipoA: item.MarcadorEquipoA,
                MarcadorEquipoB: item.MarcadorEquipoB,
                Representacion_A: item.Representacion_A,
                Representacion_B: item.Representacion_B,
                DelegacionA: item.DelegacionA,
                DelegacionB: item.DelegacionB,
                Grupo: item.Grupo,
                Prueba: item.Prueba,
                FechaLiteral: item.FechaLiteral,
                DeporteId: item.DeporteId,
                css: this.getColor(item.Estado),
                showPuntajes: item.MarcadorEquipoA === null || item.MarcadorEquipoB === null ? false : true,
                GanaA: item.EsGanadorA === true ? 'GANADOR' : '',
                GanaB: item.EsGanadorB === true ? 'GANADOR' : ''
              };
            });
            // console.clear();
            console.log(this.data);
            this.eliminarFechasVacias();
            this.normalizarData();

          }

          if (iterar) {
            this.timer = setInterval(() => {
              if (this.contador >= this.datos.length || this.contador === 0) {
                this.contador = 0;
                this.dia++;
              }
              if (this.dia > this.fechas.length - 1) {
                this.dia = 0;
                /* this.deporteId++;

                if (this.deporteId > 6) {
                  this.deporteId = 3;
                }*/
              }
              // this.LoadFixture(false);
              this.normalizarData();
            }, this.tiempo * 1000);
          }
        });
    } catch (e) { }
  }
  private eliminarFechasVacias() {
    for (let i = 0; i < this.fechas.length; i++) {
      const fecha_actual = new Date(this.fechas[i]);
      const datos = this.data.filter(
        item =>
          item.Fecha ===
          fecha_actual.getFullYear() +
          '-' +
          this.utilidad.lpad('0', 2, String(fecha_actual.getMonth() + 1)) +
          '-' +
          this.utilidad.lpad('0', 2, String(fecha_actual.getDate())) +
          'T00:00:00'
      );
      if (datos.length === 0) {
        this.fechas.splice(this.fechas.indexOf(this.fechas[i]), 1);
        console.log('eliminado ' + this.fechas[i]);
        if (i > 0) {
          i--;
        }
      }
    }
  }
  private normalizarData() {
    const fecha_actual = new Date(this.fechas[this.dia]);

    this.datos = this.data
      // .filter(item => Number(item.DeporteId) === Number(this.deporteId))
      .filter(
        item =>
          item.Fecha ===
          fecha_actual.getFullYear() +
          '-' +
          this.utilidad.lpad('0', 2, String(fecha_actual.getMonth() + 1)) +
          '-' +
          this.utilidad.lpad('0', 2, String(fecha_actual.getDate())) +
          'T00:00:00'
      );

    const aux = this.datos.slice(this.contador, this.contador + this.limite);

    /* console.log('Deporte ' + this.deporteId + ' - ' + this.fechas[this.dia]);
    console.log('contador ' + this.contador + ' - ' + this.datos.length);*/

    this.contador += this.limite;
    if (aux.length > 0) {
      this.deporte = aux[0].Deporte;
      this.masterData = [];
      try {
        let filtrado = aux.filter(encuentro => encuentro.Fase === 'Final');
        if (filtrado.length > 0) {
          this.masterData.push(filtrado);
          this.deporte = filtrado[0].Deporte;
          this.fecha = new Date(filtrado[0].Fecha);
          this.fase = filtrado[0].Fase;
          filtrado = aux.filter(encuentro => encuentro.Fase !== 'Final');
          this.masterData.push(filtrado);
        } else {
          this.masterData.push(aux);
          if (aux.length > 0) {
            this.deporte = aux[0].Deporte;
            this.fecha = new Date(aux[0].Fecha);
            this.fase = aux[0].Fase;
          }
        }
        console.clear()
        console.log(this.masterData)
      } catch (error) { }
    }
  }

  getColor(estado) {
    if (estado === 'Abierto') {
      return 'green';
    } else if (estado === 'Concluido') {
      return '#ed372e';
    } else {
      return 'Orange';
    }
  }
}
