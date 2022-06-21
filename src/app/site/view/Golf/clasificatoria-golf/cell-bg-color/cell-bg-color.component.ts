import { Component, OnInit, Input } from '@angular/core';
import { HoyoPar } from '../../../../domain/Golf/hoyoPar';

@Component({
  selector: 'app-cell-bg-color',
  templateUrl: './cell-bg-color.component.html',
  styleUrls: ['./cell-bg-color.component.css']
})
export class CellBgColorComponent implements OnInit {

  class: string;
  @Input() cellData: number;
  @Input() hoyoData: HoyoPar;
  constructor() { }

  ngOnInit() {
    this.class = this.cellData === 5 ? 'bgColor1' : 'bgColor2';

    if (this.cellData === 1) {
      this.class = 'HoyoEnUno';
    } 
   
    else if (this.cellData === this.hoyoData.Par - 1) {
      this.class = 'Birdie';
    } 
    else if (this.cellData === this.hoyoData.Par + 1) {
      this.class = 'Bogey';
    } 
    else if (this.cellData === this.hoyoData.Par - 2) {
      this.class = 'Eagle';
    } 
    else if (this.cellData >= this.hoyoData.Par + 2) {
      this.class = 'DBogey';
    } 
    else if (this.cellData === this.hoyoData.Par - 3) {
      this.class = 'Albatroz';
    }


  }

}
