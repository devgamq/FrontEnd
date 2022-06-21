
import { Component, OnInit, Input, Output, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CellBgColorComponent } from '../cell-bg-color/cell-bg-color.component';
import { HoyoPar } from '../../../../domain/Golf/hoyoPar';
@Component({
  selector: 'app-grid-clasificatorio',
  templateUrl: './grid-clasificatorio.component.html',
  styleUrls: ['./grid-clasificatorio.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridClasificatorioComponent implements OnInit, AfterViewInit {

  @Input() clasificatorias: string[];
  @Input() hoyoPar: HoyoPar[];
  @Input() hideSearch = true;
  @Input() mostrarhandicap = true;
  @Input() mostrar:Boolean;
  @Input() imageBandera:String;
  class: string;
  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.class = 'backTable';
  }

}