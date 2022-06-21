import { Component, Input , OnInit } from '@angular/core';

@Component({
  selector: 'app-leyenda-color',
  templateUrl: './leyenda-color.component.html',
  styleUrls: ['./leyenda-color.component.css']
})
export class LeyendaColorComponent implements OnInit {
  @Input() estilo: string;
  constructor() { }

  ngOnInit() {
      console.log(this.estilo);
  }

}