import {
  Component, OnInit, Input, OnChanges,
  SimpleChanges
} from '@angular/core';
import { JornadaService } from '../../../../service/Golf/jornada.service';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-visor-grupos',
  templateUrl: './visor-grupos.component.html',
  styleUrls: ['./visor-grupos.component.css'],
  providers: [JornadaService]
})
export class VisorGruposComponent implements OnInit, OnChanges {
  clase_panel = '';
  style: any;
  fotoUrl: any;
  style_titulo: any;
  @Input() eventoId = 1;
  @Input() tiempo;
  @Input() fechas;
  @Input() deporteId = 0;
  @Input() JornadaId = 0;
  @Input() CategoriaId = 0;
  @Input() Refresh = false;
  data: any[];
  grupos: any[];
  row: any[];
  grupo_id = 0;
  titulo = '';
  hora = '';
  timer: any;

  constructor(private jornadaService: JornadaService) {
    this.data = [];
    this.grupos = [];
    this.row = [];
  }

  ngOnInit() {
    this.initCss();

  }
  ngOnChanges(changes: SimpleChanges) {
    clearInterval(this.timer);
    this.row = [];
    this.data = [];
    this.grupos = [];

    this.cargarData();
  }
  private initCss() {
    this.style = {
      'background-image':
        'url("assets/0' +
        this.eventoId +
        '/fondos/d' +
        this.deporteId +
        '.png")'
    };
    switch (this.eventoId) {
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
  private cargarData() {
    const fech = new Date(this.fechas);
    const mes = fech.getMonth() + 1;
    this.fechas = fech.getFullYear() + '-' + mes + '-' + fech.getDate();
    this.jornadaService
      .getGrupoList(this.JornadaId, this.CategoriaId, this.fechas)
      .then(res => {
        res.forEach(element => {
          const aux_grupo = element.GrupoId;
          if (aux_grupo !== this.grupo_id) {
            this.grupos.push({ aux_grupo });
            this.grupo_id = aux_grupo;
          }
        });
        this.data = res;
        console.clear();
        let c = 0;
        this.setData(Number(c));

        this.timer = setInterval(() => {

          if (c === this.grupos.length - 1) {
            c = 0;

          } else {
            c++;
          }
          this.setData(c);


        }, this.tiempo * 1000);
      });
  }
  private setData(indice: number) {
    this.row = [];
    const grupo = this.grupos[indice];
    const fila = this.data.filter(
      item => Number(item.GrupoId) === Number(grupo.aux_grupo)
    );
    console.log(this.data)
    if (fila.length > 0) {
      this.titulo = fila[0].Jornada;
      this.hora = fila[0].Grupo;
      fila.forEach(element => {
        if (element.FotoUrl === null) {
          element.FotoUrl = 'assets/0' + this.eventoId + '/fondos/foto' + this.deporteId + '.png';
        }
        if (fila.length === 3) {
          if (this.row.length < fila.length - 2) {
            element.Posicion = 'singleg';
          }


        }
        if (fila.length === 2) {
          element.Posicion = 'singleg';
        }
        this.row.push(element);


      });

    }
  }
}
