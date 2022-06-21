import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MedalleroService } from '../../../service/conjunto/medallero.service';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';

@Component({
  selector: 'app-marcas-individuales',
  templateUrl: './marcas-individuales.component.html',
  styleUrls: ['./marcas-individuales.component.css'],
  providers: [MedalleroService, DeporteService]
})
export class MarcasIndividualesComponent implements OnInit, OnChanges {
  @ViewChild('panel', { read: ElementRef })
  public panel: ElementRef;
  data: any[];
  rama: any[];
  @Input() EventoId: number;
  @Input() DeporteId: number;
  @Input() tiempo: number;
  @Input() pruebas: any[];
  @Input() Refresh = false;

  pruebaid: number;
  ramaid: number;
  titulo: string;
  genero: string;
  detPrueba: string;
  style: any;
  style_titulo: any;

  timerScroll: any;
  timer: any;

  class_panel = '';
  class_tabla = '';

  constructor(
    private medalleroService: MedalleroService,
    private deporteService: DeporteService
  ) {
    this.data = [];
    this.pruebaid = 0;
    this.ramaid = 0;
    this.rama = [];
    this.rama.push('Femenino', 'Masculino', 'Mixto');
    if (this.EventoId === 3) {
      this.class_panel = 'panel_record3';
      this.class_tabla = 'tabla3';
    }
    // this.class_panel = 'panel_record3'; // sedebe borrar
  }
  private getmarca(res: any, prueba: number, rama: number) {
    console.log('rama ' + this.rama.length)
    console.log('prueba ' + this.pruebas.length)
    if (this.pruebas.length > 0 && this.rama.length > 0) {
      try {
        let pruebId = String(this.pruebas[prueba].value);
        let ramaId = String(this.rama[rama]);

        if (this.DeporteId === 2) {
          pruebId = '24';
          ramaId = 'Mixto';
        }
       // console.clear()
        console.log(res);
        const bd = res
          .filter(marca => String(marca.PruebaId) === pruebId)
          .filter(marca => String(marca.RamaDeporte) === ramaId);

        const bd_mixto = res.filter(marca => String(marca.PruebaId) === pruebId);
        console.log(pruebId);
        console.log(ramaId);
        console.log(bd);
        console.log(bd.length);
        console.log(bd);
        if (bd.length > 0) {
          this.data = bd.map(item => {
            return {
              Delegacion: item.Delegacion,
              DelegacionId: item.DelegacionId,
              Deporte: item.Deporte,
              Equipo: item.Equipo,
              Fecha: item.Fecha,
              FotoUrl: item.FotoUrl,
              HoraProgramada: item.HoraProgramada,
              Marca: item.Marca,
              ParametroRamaId: item.ParametroRamaId,
              Posicion: item.Posicion,
              Prueba: item.Prueba,
              PruebaEventoId: item.PruebaEventoId,
              PruebaId: item.PruebaId,
              Puntaje: item.Puntaje,
              RamaDeporte: item.RamaDeporte,
              Representacion: item.Representacion,
              Tiempo: item.Tiempo,
              Total: item.Total,
              valor: item.Marca !== 0 ? item.Marca : item.Tiempo === '' || item.Tiempo === null ? item.Total : item.Tiempo
            };
          });
          this.detPrueba = this.data[0].Prueba;
          this.titulo = this.data[0].Deporte;
          this.genero = this.data[0].RamaDeporte;
        }
      } catch (error) { }
    }
  }
  private eliminarPruebasVacias(res: any) {
    for (let i = 0; i < this.pruebas.length; i++) {
      const pruebId = String(this.pruebas[i].value);
      const bd = res.filter(marca => String(marca.PruebaId) === pruebId);
      if (bd.length === 0) {
        this.pruebas.splice(this.pruebas.indexOf(this.pruebas[i]), 1);
        // console.log('eliminado ' + this.pruebas[i]);
        if (i > 0) {
          i--;
        }
      }
    }
  }
  private eliminarRamasVacias(res: any) {
    for (let i = 0; i < this.rama.length; i++) {
      const ramaId = String(this.rama[i]);
      const bd = res.filter(marca => String(marca.RamaDeporte) === ramaId);
      if (bd.length === 0) {
        this.rama.splice(this.rama.indexOf(this.rama[i]), 1);
        if (i > 0) {
          i--;
        }
      }
    }
  }
  private clean() {
    console.log('limpio')
    clearInterval(this.timerScroll);
    clearInterval(this.timer);
  }
  private getData() {
    // this.EventoId = 2; // se debe borrar
    // console.clear();
    this.medalleroService
      .GetIndividualeMarcas(0, 0, this.DeporteId, this.EventoId)
      .then(res => {
        if (res.length > 0) {

          if (this.pruebas.length > 0) {
            this.eliminarPruebasVacias(res);
            this.eliminarRamasVacias(res);
            this.getmarca(res, 0, 0);

            this.clean();

            if (this.data.length > 20) {
              this.scroll();
            }
            let ramaid = 0;
            this.pruebaid = 0;

            this.timer = setInterval(() => {
              ramaid++;
              if (this.pruebaid <= this.pruebas.length - 1) {
                if (ramaid >= 3) {
                  this.pruebaid++;
                  ramaid = 0;
                }
              } else {
                this.pruebaid = 0;
                ramaid = 0;
              }
              this.getmarca(res, this.pruebaid, ramaid);

              this.panel.nativeElement.scrollTop = 0;
            }, this.tiempo * 1000);
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.clean();
    this.data = [];
    // this.EventoId = 2; // se debe borrar

    if (this.DeporteId > 2 && this.DeporteId < 7) {
      this.DeporteId = 1;
    }
    try {
      const event = changes['DeporteId'];
      const validateDeporte = Number(JSON.stringify(event.currentValue));

      if (validateDeporte > 0) {
        this.style = {
          'background-image':
            'url("assets/0' +
            this.EventoId +
            '/fondos/d' +
            this.DeporteId +
            '.png")'
        };
      }
    } catch (error) { }

    try {
      this.detPrueba = '';
      this.titulo = '';
      this.pruebas = [];
      this.data = [];
      this.pruebaid = 0;

      this.deporteService
        .getPruebas(
          this.EventoId,
          this.DeporteId,
          this.DeporteId > 2 && this.DeporteId < 7 ? 0 : 1
        )
        .then(res => {

          this.pruebas = res.map(item => {
            return {
              value: item.PruebaId,
              label: item.PruebaDescripcion
            };
          });
          this.getData();
        });
    } catch (error) { }
  }
  ngOnInit() {
    this.clean();
    this.initCss();
  }
  initCss() {
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
  }

  scroll() {
    this.timerScroll = setInterval(() => {
      this.panel.nativeElement.scrollTop += 1;
    }, 30);
  }
}
