import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { SimpleService } from '../../../service/simple/simple.service';


@Component({
  selector: 'app-marcas-jornada',
  templateUrl: './marcas-jornada.component.html',
  styleUrls: ['./marcas-jornada.component.css'],
  providers: [SimpleService, DeporteService, ConjuntoService]

})
export class MarcasJornadaComponent implements OnInit, OnChanges {
  pruebas: any[];
  @Input() eventoId: number;
  @Input() deporteId: number;
  @Input() tiempo: number;
  @Input() Refresh = false;
  @Input() fechas: Date[];
  categoriaId = 0;
  data: any[];
  vista: any[];
  style: any;
  style_titulo: any;
  class_panel = '';
  class_tabla = '';
  timerScroll: any;
  timer: any;
  titulo = 'titulo';
  genero = 'genero';
  detPrueba = 'prueba';
  clasificatorias: any[];
  cronogramas: string[];
  i: number;
  unico = false;
  constructor(private deporteService: DeporteService,
    private simpleService: SimpleService,
    private conjuntoService: ConjuntoService) {
    this.data = [];
    this.clasificatorias = [];
    this.cronogramas = [];
    this.i = -1;
  }

  ngOnInit() {
    this.clean();

  }
  getPruebas() {

    if (this.fechas.length > 0) {
      this.pruebas = [];
      this.data = [];
      this.deporteService.getPruebas(this.eventoId, this.deporteId, 1).then(res => {

        this.pruebas = res;
        this.pruebas.forEach(prueba => {
          this.doGetEncuentros(prueba.PruebaId);
        });
        this.timer = setInterval(() => {

          this.i++;
          this.getCronogramaVista(this.cronogramas[this.i]);
        }, this.tiempo * 1000);
      });
    }
  }
  private clean() {
    clearInterval(this.timerScroll);
    clearInterval(this.timer);
    this.cronogramas = [];
    this.data = [];
    this.pruebas = [];
  }
  ngOnChanges(changes: SimpleChanges) {
    this.clean();
    this.getPruebas();
    const deporte = Number(changes['deporteId'] === undefined ? 0 : changes['deporteId'].currentValue);
    if (deporte > 0) {

      this.style = {
        'background-image':
          'url("assets/0' +
          this.eventoId +
          '/fondos/d' +
          this.deporteId +
          '.png")'
      };
    }
  }
  doGetEncuentros(pruebaId) {

    this.conjuntoService
      .GetCronogramasFecha(this.deporteId, this.eventoId, pruebaId, new Date(this.fechas[0]), this.categoriaId)
      .then(res => {
        const datos = res;
        console.log(datos)
        if (datos.length > 0) {
          datos.forEach(element => {
            this.getListaGanadores(element.CronogramaId, element.Prueba, element.Rama, element.Descripcion);
          });
        }
      });
  }
  initCss() {
    switch (this.eventoId) {
      case 1:
        this.style_titulo = { color: '#972020' };
        break;
      case 2:
        this.style_titulo = { color: '#012C72' };
        break;
      default:
        this.style_titulo = { color: '#004a9c' };
        break;
    }
  }
  getListaGanadores(cronogramaId: number, Prueba: any, Rama: any, Descripcion: any) {


    this.simpleService.getListaGanadores(cronogramaId).then(res => {
      this.clasificatorias = res;

      this.clasificatorias.forEach(item => {
        this.conjuntoService.getDelegacion(item.CompetidorId).then(delegacion => {
          const auxiliar = {
            CompetidorId: item.CompetidorId,
            CronogramaId: item.CronogramaId,
            Delegacion: item.Delegacion,
            EsGanador: item.EsGanador,
            EsRecord: item.EsRecord,
            Estado: item.Estado,
            FotoUrl: item.FotoUrl,
            Marca: item.Marca,
            Medalla: item.Medalla,
            Nombre: item.Nombre,
            PersonaId: item.PersonaId,
            Posicion: item.Posicion,
            Representacion: item.Representacion,
            Sembrado: item.Sembrado,
            Tiempo: item.Tiempo,
            valor: item.Tiempo === null || item.Tiempo ==='' ? item.Marca : item.Tiempo,
            DelegacionId: delegacion,
            prueba_data: Prueba,
            rama_data: Rama,
            descripcion: Descripcion
          };
          if (this.cronogramas.indexOf(item.CronogramaId) < 0) {
            this.cronogramas.push(item.CronogramaId);
          }
          this.data.push(auxiliar);
          if (this.cronogramas.length === 2) {

            this.getCronogramaVista(this.cronogramas[0]);
            this.unico = true;
          }

        });

      });

    });
  }
  private getCronogramaVista(indice: any) {

    if (indice === undefined) {
      this.i = -1;
    } else {
      console.log(indice);
      this.vista = this.data.filter(item => item.CronogramaId === indice).sort((a, b) => {
        if (b.Posicion > a.Posicion) {
          return -1;
        } else {
          if (b.Posicion < a.Posicion) {
            return 1;
          } else {
            return 0;
          }
        }
      });
      console.log(this.vista[0]);
      this.titulo = this.vista[0].prueba_data;
      this.genero = this.vista[0].rama_data;
      this.detPrueba = this.vista[0].descripcion;
    }
  }
}
