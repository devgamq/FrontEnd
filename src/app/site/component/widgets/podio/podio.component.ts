import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { PodioService } from '../../../service/conjunto/podio.service';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';

@Component({
  selector: 'app-podio',
  templateUrl: './podio.component.html',
  styleUrls: ['./podio.component.css'],
  providers: [PodioService, DeporteService],
  encapsulation: ViewEncapsulation.None
})
export class PodioComponent implements OnInit, OnChanges {
  @Input() eventoId: number;
  @Input() deporteId: number;
  @Input() parametroRamaId: number;
  @Input() grupoid = 0;
  @Input() tiempo: number;
  @Input() scrolling = true;
  @Input() Refresh = false;

  titulo: string;
  @ViewChild('panel', { read: ElementRef })
  public panel: ElementRef;

  data: any[];
  grupos: any[];
  grupos_aux: any[];
  keys: string[];
  cantidad: number;
  grupo: String = '';
  detenerScroll: boolean;
  style: any;
  style_titulo: any;
  timerScroll: any;
  timerEspera: any;
  timerInverso: any;
  timerEsperaScroll: any;
  timer: any;
  clase_panel = '';
  titulo_grupo = '';

  constructor(
    private podioService: PodioService,
    private deporteService: DeporteService
  ) {
    this.detenerScroll = false;
    this.data = [];
    this.grupos = [];
    this.keys = [];
    this.grupos_aux = [];
  }

  ngOnInit() {
    this.cleanHilos();
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
  ngOnChanges(changes: SimpleChanges) {
    this.cleanHilos();

    clearInterval(this.timer);
    if (this.deporteId !== 15) {
      this.deporteId =
        this.deporteId < 3 || this.deporteId > 6 ? 4 : this.deporteId;
    }
    try {
      const event = changes['deporteId'];
      const validateDeporte = Number(JSON.stringify(event.currentValue));
      if (validateDeporte > 0) {
        this.cargarCss();
      }
    } catch (error) { }
    this.cargarPodio();
  }
  cargarCss() {
    if (this.eventoId === 3) {
      this.clase_panel = 'panel_posiciones3';
    }
    switch (Number(this.deporteId)) {
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
            this.eventoId +
            '/fondos/d' +
            this.deporteId +
            '.png")'
        };
        break;
      default:
        this.style = {
          'background-image':
            'url("assets/0' + this.eventoId + '/fondos/bg' + 1 + '.png")'
        };
        break;
    }
  }

  private cleanHilos() {
    clearInterval(this.timerScroll);
    clearInterval(this.timerEspera);
    clearInterval(this.timerInverso);
    clearInterval(this.timerEsperaScroll);
    this.timerScroll = null;

    this.panel.nativeElement.scrollTop = 0;
  }
  private getDeporte(parametroRamaId: number, deporte: string) {
    this.titulo = '';
    let auxParametro = '';

    switch (Number(parametroRamaId)) {
      case 1:
        auxParametro = ' VARONES';
        break;
      case 2:
        auxParametro = ' DAMAS';
        break;
      default:
        auxParametro = '';
        break;
    }

    try {
      this.titulo = 'TABLA DE POSICIONES ' + deporte + ' ' + auxParametro;
    } catch (error) {
      this.titulo = 'TABLA DE POSICIONES POR DEPORTE';
    }
  }
  private clean_data() {
    this.grupos = [];
    this.data = [];
    this.keys = [];
    this.grupos_aux = [];
  }
  private cargarPodio() {

    this.podioService
      .GetTablaPosicion(this.eventoId, this.deporteId, 0, 0)
      .then(res => {
        this.clean_data();
        if (res.length > 0) {
          this.normalizarHeader(Object.keys(res[0]));

          const data = res;
          res.forEach(item => {
            if (item.Grupo !== this.grupo) {
              this.titulo_grupo = String(item.Grupo).includes('rupo') ? '' : 'GRUPO ';
              this.grupos_aux.push({
                grupo: item.Grupo,
                ParametroRamaId: item.ParametroRamaId,
                parametroNombre: ''
              });
              this.grupo = item.Grupo;
            }
          });

          this.cantidad = res.length;
          this.grupo = '';
          this.scroll();
          let ramaid = 1;

          this.setData(data, ramaid);

          this.timer = setInterval(() => {
            ramaid++;
            if (ramaid >= 3) {
              ramaid = 1;
            }
            this.setData(data, ramaid);

            this.cleanHilos();
            this.scroll();
          }, this.tiempo * 1000);
        }
      });
  }
  private setData(data: any, ramaid: number) {
    this.grupos = this.grupos_aux.filter(
      item => item.ParametroRamaId === ramaid
    );
    this.data = data.filter(item => item.ParametroRamaId === ramaid);
    this.getDeporte(ramaid, data[0].Deporte);
  }
  private normalizarHeader(lista: string[]) {
    this.keys = [];
    lista.forEach(element => {
      if (element.length === 2) {
        this.keys.push(element.toUpperCase());
      }
    });
  }
  public getGrupoDatos(g, parametro) {
    return this.data
      .filter(item => item.Grupo === g && item.ParametroRamaId === parametro)
      .sort((a, b) => {
        if (a.PT > b.PT) {
          return -1;
        } else {
          if (a.PT < b.PT) {
            return 1;
          } else {
            return 0;
          }
        }
      });
  }

  scroll() {
    let top = 0;
    this.timerScroll = setInterval(() => {
      if (this.detenerScroll) {
        clearInterval(this.timerScroll);
      }
      this.panel.nativeElement.scrollTop += 1;

      if (top < this.panel.nativeElement.scrollTop) {
        top = this.panel.nativeElement.scrollTop;
      } else if (top === this.panel.nativeElement.scrollTop) {
        clearInterval(this.timerScroll);

        this.espera();
      }
    }, 25);
  }
  espera() {
    let c = 0;
    this.timerEspera = setInterval(() => {
      if (this.detenerScroll) {
        clearInterval(this.timerEspera);
      }
      if (c === 300) {
        clearInterval(this.timerEspera);

        this.scroll_inverso(top);
      } else {
        c++;
      }
    }, 10);
  }
  espera_scroll() {
    let c = 0;
    this.timerEsperaScroll = setInterval(() => {
      if (this.detenerScroll) {
        clearInterval(this.timerEsperaScroll);
      }
      if (c === 300) {
        clearInterval(this.timerEsperaScroll);
        this.scroll();
      } else {
        c++;
      }
    }, 10);
  }
  scroll_inverso(top) {
    this.timerInverso = setInterval(() => {
      this.panel.nativeElement.scrollTop -= 1;
      if (this.detenerScroll) {
        clearInterval(this.timerInverso);
      }
      if (this.panel.nativeElement.scrollTop === 0) {
        clearInterval(this.timerInverso);
        this.espera_scroll();
      }
    }, 45);
  }
}
