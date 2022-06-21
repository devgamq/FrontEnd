import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';
import { CellBgColorComponent } from '../cell-bg-color/cell-bg-color.component';
import { HoyoPar } from '../../../../domain/Golf/hoyoPar';

@Component({
  selector: 'app-grid-resultados',
  templateUrl: './grid-resultados.component.html',
  styleUrls: ['./grid-resultados.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridResultadosComponent implements OnInit, AfterViewInit {
  @Input() clasificatorias: string[];
  @Input() hoyoPar: HoyoPar[];
  @Input() hideSearch = true;
  @Input() mostrarhandicap = true;
  @Input() mostrar:Boolean;


  class: string;
  styleColumVisor: any;
  styleColumVisor1:any;
  styleColumVisor2:any;

  styleColumNegrita: any;
  constructor() {
    this.styleColumVisor = {
      'background-color': '#000',
      color: 'white',
      'font-weight': 'bold',
      'font-size': '1vw'
    };
    this.styleColumVisor1 = {
      'background-color': '#000',
      color: 'white',
      'font-weight': 'bold',
      'font-size': '1.2vw',
      'width':'3%'
    };
    this.styleColumVisor2 = {
      'background-color': '#000',
      color: 'white',
      'font-weight': 'bold',
      'font-size': '1.2vw',
      'width':'12%'
    };
    this.styleColumNegrita = { 'font-weight': 'bold' };
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.class = 'backTable';
  }
}
