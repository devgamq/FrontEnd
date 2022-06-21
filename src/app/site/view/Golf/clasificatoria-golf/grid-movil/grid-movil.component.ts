import { Component, OnInit, Input, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CellBgColorComponent } from '../cell-bg-color/cell-bg-color.component';
import { HoyoPar } from '../../../../domain/Golf/hoyoPar';

@Component({
  selector: 'app-grid-movil',
  templateUrl: './grid-movil.component.html',
  styleUrls: ['./grid-movil.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GridMovilComponent implements OnInit, AfterViewInit {

  @Input() clasificatorias: string[];
  @Input() hoyoPar: HoyoPar[];
  @Input() hideSearch = true;
  class: string;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.class = 'backTable';
  }

}
