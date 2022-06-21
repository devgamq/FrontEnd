import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { PodioService } from '../../../service/conjunto/podio.service';
import { Podio } from '../../../domain/deportes/grupo/podio';
import { Util } from '../../../view/Futbol/util';
import { MedalleroService } from '../../../service/conjunto/medallero.service';

@Component({
  selector: 'app-podio-deporte',
  templateUrl: './podio-deporte.component.html',
  styleUrls: ['./podio-deporte.component.css'],
  providers: [PodioService, MedalleroService]
})
export class PodioDeporteComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() eventoId = 1;
  @Input() deporteId = 4;
  @Input() pruebaId = 1;
  @Input() parametroRamaId = 1;
  @Input() tiempo = 10;
  @Input() Refresh = false;

  deporte: string;
  Prueba: string;
  RamaDeporte: string;
  oro: Podio;
  plata: Podio[];
  bronce: Podio[];
  data: any[];
  re1s: any[];
  respuesta: any[];
  re2s: any[];
  pruebas: any[];
  marcas: any[];
  show: boolean;
  conjunto = true;
  marca_contador = 0;
  style: any;
  style_fondo: any;
  style_titulo: any;
  contador: number;
  utilidad: Util;
  cont_medallas = 0;
  timer: any;
  marcas_timer: any;
  records: any;

  clase_panel = '';
  constructor(
    private podioService: PodioService,
    private medalleroService: MedalleroService
  ) {
    this.pruebas = [];
    this.data = [];
    this.oro = new Podio();
    this.plata = [];
    this.utilidad = new Util();
    this.show = true;
    this.re2s = [];
  }
  ngAfterViewInit() {
    this.clean();
    console.log('cleaner')
  }
  ngOnInit() { }
  private clean() {
    clearInterval(this.marcas_timer);
    clearInterval(this.timer);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.clean();
    try {
      const event = changes['deporteId'];
      const validateDeporte = Number(JSON.stringify(event.currentValue));
      if (validateDeporte > 0) {
        this.initCss();
      }
    } catch (error) { }
    clearInterval(this.marcas_timer);
    clearInterval(this.timer);
    this.timer = null;
    this.marcas_timer = null;

    this.cargarPodio();
    this.getMarcas();
  }
  private initCss() {
    if (this.eventoId === 3) {
      this.clase_panel = 'panel_posiciones4P';
    }
    this.style_fondo = {
      'background-image':
        'url("assets/0' + this.eventoId + '/fondos/fondopodio.png")'
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
    this.style = {
      'background-image':
        'url("assets/0' +
        this.eventoId +
        '/fondos/bg1.png")'
    };
  }
  private getMarcas() {
    this.medalleroService
      .GetIndividualeMarcas(0, 0, this.deporteId, this.eventoId)
      .then(res => {
        // console.clear();
        console.log(res);
        if (res.length > 0) {
          this.marcas = res;
        } else {
          this.marcas = [];
        }
      });
  }
  private cargarPodio() {
    this.data = [];
    this.pruebas = [];
    this.deporte = '';
    this.Prueba = '';
    this.RamaDeporte = '';
    this.pruebaId = 0;
    this.parametroRamaId = 0;
    this.re1s = [];
    this.re2s = [];
    this.show = true;

    this.podioService
      .GetPodio(this.eventoId, this.deporteId, 0, 0)
      .then(res => {
        if (res.length > 0) {
          this.data = res
            .map(item => {
              return {
                PruebaEventoId: item.PruebaEventoId,
                Fecha: item.Fecha,
                HoraProgramada: item.HoraProgramada,
                Deporte: item.Deporte,
                Prueba: item.Prueba,
                RamaDeporte: item.RamaDeporte,
                Marca: item.Marca,
                Puntaje: item.Puntaje,
                Tiempo: item.Tiempo,
                Equipo: item.Equipo,
                Delegacion: item.Delegacion,
                Record: this.getRecord(item.EsRecord),
                Medalla: this.utilidad.capitalize(
                  String(item.Medalla).toLowerCase()
                ),
                ParametroMedallaId: item.ParametroMedallaId,
                Representacion: item.Representacion,
                posicion:
                  item.ParametroMedallaId === 2
                    ? 1
                    : item.ParametroMedallaId === 1 ? 2 : 3,
                FotoUrl: item.FotoUrl
                  ? item.FotoUrl
                  : 'assets/0' + this.eventoId + '/logos/podio.png',
                DelegacionId: item.DelegacionId,
                revisado: 0,
                puntos:
                  item.Marca > 0
                    ? item.Marca
                    : item.Puntaje > 0 ? item.Puntaje : item.Tiempo
              };
            })
            .sort((a, b) =>
              String(a.Prueba + ' ' + a.RamaDeporte).localeCompare(
                String(b.Prueba + ' ' + b.RamaDeporte)
              )
            );


          this.data.forEach(element => {
            if (
              this.pruebas.indexOf(
                element.Prueba + '|' + element.RamaDeporte
              ) === -1
            ) {
              this.pruebas.push(element.Prueba + '|' + element.RamaDeporte);
            }
          });
          this.setdata(0);
          this.contador = 0;




          this.timer = setInterval(() => {
            this.contador++;
            this.show = true;
            if (this.contador > this.pruebas.length - 1) {
              this.contador = 0;
            }
            this.setdata(this.contador);

            this.marcas_timer = setInterval(() => {
              this.setmarcas(this.contador);
              if (this.re2s.length > 0) {
                this.show = false;
              }
              clearInterval(this.marcas_timer);
            }, this.tiempo + 15 * 500);
          }, this.tiempo + 15 * 1000);
        }
      });
  }

  private setdata(indice: number) {

    try {
      this.Prueba = this.pruebas[indice].split('|')[0];
      this.RamaDeporte = this.pruebas[indice].split('|')[1];
      const aux = this.data
        .filter(item => String(item.Prueba) === String(this.Prueba))
        .filter(item => String(item.RamaDeporte) === String(this.RamaDeporte))
        .sort((a, b) => {
          if (b.posicion > a.posicion) {
            return -1;
          } else {
            if (b.posicion < a.posicion) {
              return 1;
            } else {
              return 0;
            }
          }
        });


      if (aux.length < 4) {
        this.re1s = aux;
      } else {

        for (let index = 0; index < aux.length; index++) {

          if (Number(aux[index].revisado) === 0) {
            aux[index].posicion = aux[index].posicion === 2 ? 1 : aux[index].posicion === 1 ? 2 : 3;
            aux[index].revisado = 1;
          }

        }
        this.re1s = aux.sort((a, b) => {
          if (b.posicion > a.posicion) {
            return -1;
          } else {
            if (b.posicion < a.posicion) {
              return 1;
            } else {
              return 0;
            }
          }
        });
      }

      this.deporte = this.re1s[0].Deporte;
      this.cont_medallas = this.re1s.length;

    } catch (error) { }
  }
  private setmarcas(indice: number) {
    try {
      this.Prueba = this.pruebas[indice].split('|')[0];
      this.RamaDeporte = this.pruebas[indice].split('|')[1];

      this.re2s = this.marcas
        .filter(item => String(item.Prueba) === String(this.Prueba))
        .filter(item => String(item.RamaDeporte) === String(this.RamaDeporte));
      this.re2s = this.re2s.slice(0, 11);
    } catch (error) { }
  }

  getRecord(record)
  {
    if(record === true)
    {
      return "RECORD SURAMERICANO";
    }
    else{

      return "";
    }
  }
}
