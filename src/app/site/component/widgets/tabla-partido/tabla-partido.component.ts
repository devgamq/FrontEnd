import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { TreeModule, TreeNode } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-tabla-partido',
  templateUrl: './tabla-partido.component.html',
  styleUrls: ['./tabla-partido.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DeporteService]
})
export class TablaPartidoComponent implements OnInit, OnChanges {
  @Input() EventoId: number;
  @Input() DeporteId: number;
  @Input() parametroRamaId: number;
  @Input() json: string;
  files: TreeNode[];
  expanded = false;
  style_titulo: any;
  style: any;

  titulo: string;
  constructor(private deporteService: DeporteService) {
    this.files = [];
  }
  private getDeporte() {
    this.titulo = '';
    this.deporteService.getDeportes(this.EventoId).then(res => {
      try {
        this.titulo = res
          .filter(item => String(item.DeporteId) === String(this.DeporteId))[0]
          .DeporteDescripcion.toUpperCase();
        this.titulo += this.parametroRamaId === 1 ? ' - Varones' : ' - Damas';
      } catch (error) {
        this.titulo = 'SISTEMA DE COMPETICIÓN';
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.initData();
  }
  private css() {
    $('body').attr(
      'style',
      'overflow-y:hidden !important; overflow-x:hidden !important; '
    );
    switch (this.EventoId) {
      case 1:
        this.style_titulo = { color: '#972020' };
        break;
      default:
        this.style_titulo = { color: '#000' };
        break;
    }
    this.style = {
      'background-image':
        'url("assets/0' + this.EventoId + '/fondos/bg' + 1 + '.png")'
    };
  }
  ngOnInit() {
    this.getDeporte();
    this.css();
  }
  private initData() {
    let datascource = '';
    try {
      datascource = JSON.parse(this.json);
    } catch (error) {
      datascource = '[]';
    }

    const oc = $('#chart-container').orgchart({
      data: datascource,
      nodeContent: 'title',
      direction: 'r2l'
    });
  }
}
