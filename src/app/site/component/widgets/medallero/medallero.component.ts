import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { MedalleroService } from '../../../service/conjunto/medallero.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
@Component({
  selector: 'app-medallero',
  templateUrl: './medallero.component.html',
  styleUrls: ['./medallero.component.css'],
  providers: [MedalleroService, DeporteService, ConjuntoService]
})
export class MedalleroComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('panel', { read: ElementRef })
  public panel: ElementRef;
  data: any[];
  cantidad: number;
  @Input() EventoId: number;
  @Input() tipo: number;
  @Input() DeporteId: number;
  @Input() delegacionId: number;
  @Input() Refresh = false;

  titulo: string;
  recargado: any;
  style: any;
  style_titulo: any;
  hilo: any;
  class_panel = '';
  class_tabla = '';
  constructor(
    private medalleroService: MedalleroService,
    private deporteService: DeporteService,
    private conjuntoService: ConjuntoService
  ) {
    this.data = [];
  }

  private getDeporte() {
    this.titulo = '';
    this.deporteService.getDeportes(this.EventoId).then(res => {
      try {
        this.titulo =
          'MEDALLERO ' +
          res
            .filter(
              item => String(item.DeporteId) === String(this.DeporteId)
            )[0]
            .DeporteDescripcion.toUpperCase();
      } catch (error) {
        this.titulo = 'MEDALLERO POR DEPORTE';
      }
    });
  }
  private getDelegacion() {
    this.titulo = '';
    this.conjuntoService.GetDelegaciones(this.EventoId).then(res => {
      try {
        this.titulo =
          'DELEGACIÓN ' +
          res
            .filter(
              item => String(item.DelegacionId) === String(this.delegacionId)
            )[0]
            .Nombre.toUpperCase();
      } catch (error) {
        this.titulo = 'MEDALLERO POR DELEGACIÓN';
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.clear();
    // this.clean();
    this.initData();
    console.log('refresh de datos medallero');
  }
  private initHilo() {
    // this.hilo = setInterval(() => {
    //   this.initData();
    // }, 20000);
  }
  private clean() {
    // clearInterval(this.hilo);
  }
  ngOnInit() {

    console.log(this.EventoId);
    if (this.EventoId === 3) {
      this.class_panel = 'panel_tabla3';
      this.class_tabla = 'tabla3';
    }
    this.initCss();

    // clearTimeout(recarga);

  }

  ngAfterViewInit() {
    this.clean();
    this.initHilo();
  }
  private initCss() {
    switch (this.EventoId) {
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
    switch (Number(this.tipo)) {
      case 1:
        this.titulo = 'MEDALLERO GENERAL';
        this.style = {
          'background-image':
            'url("assets/0' + this.EventoId + '/fondos/bg' + 1 + '.png")'
        };

        break;
      case 2:
        switch (Number(this.DeporteId)) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
            this.style = {
              'background-image':
                'url("assets/0' +
                this.EventoId +
                '/fondos/d' +
                this.DeporteId +
                '.png")'
            };
            break;
          default:
            this.style = {
              'background-image':
                'url("assets/0' + this.EventoId + '/fondos/bg' + 1 + '.png")'
            };
            break;
        }

        break;
      case 3:
        this.style = {
          'background-image':
            'url("assets/0' + this.EventoId + '/fondos/bg' + 1 + '.png")'
        };
        break;

      default:
        console.log('no entro');
    }
  }

  initData() {



    switch (Number(this.tipo)) {
      case 1:


        this.cargarMedallero();
        break;
      case 2:
        this.GetMedalleroDeporte();
        this.getDeporte();

        break;
      case 3:
        this.GetMedalleroDelegacion();
        this.getDelegacion();
        break;

      default:
        console.log('no entro');
    }
  }
  private cargarMedallero() {
    // comentar despues

    this.medalleroService.GetMedalleroGeneral(this.EventoId).then(res => {
      if (res.length > 0) {
        this.data = res;
        this.cantidad = res.length;
      }
    });
  }
  private GetMedalleroDeporte() {
    this.medalleroService
      .GetMedalleroDeporte(this.EventoId, this.DeporteId)
      .then(res => {
        if (res.length > 0) {
          this.data = res;
          this.cantidad = res.length;
        }
      });
  }
  private GetMedalleroDelegacion() {
    this.medalleroService
      .GetMedalleroDelegacion(this.EventoId, this.delegacionId)
      .then(res => {
        if (res.length > 0) {
          this.data = res;
          this.cantidad = res.length;
        }
      });
  }


}
