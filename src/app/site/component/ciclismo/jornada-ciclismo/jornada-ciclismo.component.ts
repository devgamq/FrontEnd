import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges
} from '@angular/core';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';

@Component({
  selector: "app-jornada-ciclismo",
  templateUrl: "./jornada-ciclismo.component.html",
  styleUrls: ["./jornada-ciclismo.component.css"],
  providers: [ConjuntoService]
})
export class JornadaCiclismoComponent implements OnInit {
  @ViewChild("panel", { read: ElementRef })
  public panel: ElementRef;
  data: any[];
  cantidad: number;
  @Input() EventoId: number;
  @Input() DeporteId: number;
  @Input() fecha: Date;

  tipo: any;

  titulo: string;
  recargado: any;
  style: any;
  style_titulo: any;
  tableData: any[];

  constructor(private conjuntoService: ConjuntoService) {
    this.data = [];
    this.tableData = [];
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   this.initData();
  // }

  ngOnInit() {
    this.initCss();
    this.initData();

    // clearTimeout(recarga);
  }

  private initCss() {
    this.style_titulo = { color: '#000' };
    this.titulo = 'CRONOGRAMA DEL DÍA';
    this.style = {
      'background-image': 'url("assets/0' + this.EventoId + '/fondos/bg' + 1 + '.png")'
    };
  }

  initData() {
    this.conjuntoService
      .GetCronogramasFecha(this.DeporteId, this.EventoId, 0, this.fecha, 0)
      .then(res => {
        this.tableData = res;
      });
  }
  getColor(estado) {
    if (estado === 'Abierto') {
      return 'green';
    } else if (estado === 'Concluido') {
      return 'red';
    } else {
      return 'Orange';
    }
  }
}
