import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { JornadaService } from '../../../../service/Golf/jornada.service';
import { HoyoPar } from '../../../../domain/Golf/hoyoPar';
import { CategoriaDropDown } from '../../categoria-golf/categoria-dropdown/categoria-dropdown.component';
import { JornadaDropDown } from '../../jornada-golf/jornada-dropdown/jornada-dropdown.component';
import { LeyendaColorComponent } from '../leyenda-color/leyenda-color.component';
import { Observable } from 'rxjs/Observable';
import { DropdownModule } from 'primeng/primeng';
import { CellBgColorComponent } from '../cell-bg-color/cell-bg-color.component';
import { GridResultadosComponent } from '../grid-resultados/grid-resultados.component';
import { GolfService } from '../../../../service/Golf/golf.service';
import { Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-visor-hoyos',
  templateUrl: './visor-hoyos.component.html',
  styleUrls: ['./visor-hoyos.component.css'],
  providers: [JornadaService, GolfService],
  encapsulation: ViewEncapsulation.None
})
export class VisorHoyosComponent implements OnInit, AfterViewInit {

  clasificatorias: string[];
  hoyoPar: HoyoPar[];
  eventoId: number;
  buttons: boolean;
  jornadaId: number;
  categoriaId: number;
  stateLoad = false;
  jornada: string;
  categoria: string;
  hoyoIndex = 0;
  valueHoyo: string;
  hoyo1: boolean;
  hoyo2: boolean;
  hoyo3: boolean;
  hoyo4: boolean;
  hoyo5: boolean;
  hoyo6: boolean;
  hoyo7: boolean;
  hoyo8: boolean;
  hoyo9: boolean;
  hoyo10: boolean;
  hoyo11: boolean;
  hoyo12: boolean;
  hoyo13: boolean;
  hoyo14: boolean;
  hoyo15: boolean;
  hoyo16: boolean;
  hoyo17: boolean;
  hoyo18: boolean;
  connection;
  styleColum: any;
  constructor(
    private jornadaService: JornadaService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private golfService: GolfService
    , private domSanitizer: DomSanitizer
  ) {
    this.styleColum = { 'width': '20px'};
    this.eventoId = this.activedRoute.snapshot.params['eventoId'];
    this.buttons = this.activedRoute.snapshot.params['buttons'] === '1';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.doGetHoyoPar();
  }
  doGetHoyoPar() {
    this.jornadaService
      .getHoyoPar(1)
      .then(res => {
        this.hoyoPar = res;
        this.doGetClasificatorias();
        this.stateLoad = true;
        this.valueHoyo = 'Hoyo ' + this.hoyoPar[this.hoyoIndex].Hoyo;
      });
  }

  doGetClasificatorias() {
    const newClasificatorias = [];
    this.jornadaService
      .getClasificatoriaList(this.jornadaId, this.categoriaId)
      .then(res => {
        this.clasificatorias = res;
        const index = 1;
        this.clasificatorias.forEach(item => {
          const row1: any = Object.assign({}, {
            '1': item['1'],
            '2': item['2'],
            '3': item['3'],
            '4': item['4'],
            '5': item['5'],
            '6': item['6'],
            '7': item['7'],
            '8': item['8'],
            '9': item['9'],
            'NomCompleto': item['NomCompleto'],
            'Nombre': item['Nombre'],
            'I': item['1'] + item['2'] + item['3'] + item['4'] + item['5'] + item['6'] + item['7'] + item['8'] + item['9'],
            'Total': item['Total'],
            'TotalNeto': item['TotalNeto']
          });
          const row2: any = Object.assign({}, {
            '1': item['10'],
            '2': item['11'],
            '3': item['12'],
            '4': item['13'],
            '5': item['14'],
            '6': item['15'],
            '7': item['16'],
            '8': item['17'],
            '9': item['18'],
            'NomCompleto': item['NomCompleto'],
            'Nombre': '',
            'I': item['10'] + item['11'] + item['12'] + item['13'] + item['14'] + item['15'] + item['16'] + item['17'] + item['18'],
            'Total': '',
            'TotalNeto': ''
          });
          newClasificatorias.push(row1);
          newClasificatorias.push(row2);
        });
        this.clasificatorias = newClasificatorias;
      });

  }

  handleCategoria($event) {
    this.categoriaId = $event.categoriaId;
    this.categoria = $event.descripcion;

    if (this.stateLoad) {
      if (this.jornadaId && this.categoriaId) {
        this.doGetClasificatorias();
      }
    }
  }

  handleJornada($event) {
    this.jornadaId = $event.jornadaId;
    this.jornada = $event.descripcion;
    if (this.stateLoad) {
      if (this.jornadaId && this.categoriaId) {
        this.doGetClasificatorias();
      }
    }
  }

  doOpenVisor() {
    // this.router.navigate(['/master/golf-Visor', this.jornadaId, this.categoriaId]);
    window.open(`#/visor-golf/${this.eventoId}`);
  }

  doReporte() {
    this.golfService
      .getRptListadoGolf(this.eventoId, this.jornadaId, this.categoriaId, this.jornada, this.categoria)
      .then(res => {
        // let url = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
        window.open(URL.createObjectURL(res));
      });
  }

  onChangeHoyo($event) {
    if ($event === 'next') {
      if (this.hoyoIndex < 17) {
        this.hoyoIndex++;
      } else {
        this.hoyoIndex = 0;
      }
    } else {
      if (this.hoyoIndex > 0) {
        this.hoyoIndex--;
      } else {
        this.hoyoIndex = 17;
      }
    }
    this.valueHoyo = 'Hoyo ' + this.hoyoPar[this.hoyoIndex].Hoyo;
  }
}