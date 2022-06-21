import { Component, OnInit, ViewChild, ElementRef, trigger, state, animate, transition, style, ViewEncapsulation } from '@angular/core';
import * as urls from '../../../domain/Shared/global';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-sorteo',
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.css'],
  providers: [ConjuntoService, DeporteService],
  encapsulation: ViewEncapsulation.None
})

export class SorteoComponent implements OnInit {
  EventoId: number;
  deporte: string;
  genero: string;
  deporteId: number;
  style: any;
  grupos: any[];
  style_titulo: any;
  cantidad_grupos: number;
  style_columna: string;
  fase: number;
  ramaId: number;
  private _connection: SignalRConnection;
  GrupoId: number;
  grupoAux: any;
  equipoID: number;
  banderas: any;
  rowVisible: any;

  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'cliente' + Math.random(), group: 'sorteo' },
    url: urls.urlSockets
  };

  constructor(private conjuntoService: ConjuntoService,
    private deporteService: DeporteService,
    private _signalR: SignalR) {
    this.grupos = [];
    this.EventoId = 2;
    this.deporte = '';
    this.genero = '';
    this.deporteId = 0;
    this.cantidad_grupos = 3;
    this.fase = 1;
    this.ramaId = 0;
    this.banderas = false;
  }

  ngOnInit() {
    this.initCss();
    this.initGrupos();
    if (this.deporteId === 0) {
      try {
        const accion = JSON.parse(localStorage.getItem('sorteo'));
        this.setData(accion);
        this.initGrupos();
        this.getDeporte();
        this.getGenero();

      } catch (error) {

      }
    }
    this.conectar();
  }
  initCss() {
    switch (this.EventoId) {
      case 1:
        this.style_titulo = { 'color': '#972020' }; break;
      case 2:
        this.style_titulo = { 'color': 'blue' }; break;
      default:
        this.style_titulo = { 'color': '#000' }; break;
    }
    $('body')
      .attr('style', 'overflow-y:hidden !important; overflow-x:hidden !important; background-image: url("assets/08/sorteo/1.png"); background-size:100% 100%;');
    this.style = { 'background-image': 'url("assets/0' + this.EventoId + '/fondos/fs' + 1 + '.png")' };

    switch (this.cantidad_grupos) {
      case 2: this.style_columna = 'ui-g-6'; break;
      case 3: this.style_columna = 'ui-g-4'; break;
      case 4: this.style_columna = 'ui-g-3'; break;
      case 5: this.style_columna = 'ui-g-2'; break;
      case 6: this.style_columna = 'ui-g-2'; break;
    }
  }
  initGrupo(grupo) {
    this.conjuntoService
      .GetGruposEquipos(this.deporteId, this.ramaId, this.EventoId, this.fase)
      .then(res => {
        this.grupoAux = res.filter(item => item.GrupoId === grupo);
      });

  }
  initGrupos() {
    this.grupos = [];
    this.conjuntoService
      .GetGruposEquipos(this.deporteId, this.ramaId, this.EventoId, this.fase)
      .then(res => {
        this.grupos = res;
        this.grupos = this.grupos.slice(this.rowVisible * 3, (this.rowVisible + 1) * 3) ;
        console.log(this.grupos);
        if (res.length > 0) {
          this.cantidad_grupos = this.grupos.length;

          this.getDeporte();
          this.getGenero();

        }
      });

  }

  private setData(data) {
    this.EventoId = Number(data['eventoId']);
    this.deporteId = Number(data['deporteId']);
    this.ramaId = Number(data['genero']);
    this.fase = 1;
    this.GrupoId = Number(data['GrupoId']);
    this.equipoID = Number(data['EquipoId']);
    this.banderas = data["banderas"];
    this.rowVisible = data["fila"];
  }
  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then((c) => {
      const listener = c.listenFor('setSorteo');
      listener.subscribe((data) => {
        console.log(data);
        localStorage.setItem('sorteo', JSON.stringify(data));
        this.setData(data);
        if (this.rowVisible !== -1) {
          if(this.rowVisible !== this.rowVisible)
            this.GrupoId = 0;
          if (this.GrupoId === 0) {
            this.initGrupos();
          } else {

            let html = '';
            this.conjuntoService
              .GetGruposEquipos(this.deporteId, this.ramaId, this.EventoId, this.fase)
              .then(res => {
                this.grupoAux = res.filter(item => item.GrupoId === this.GrupoId)[0].GrupoEquipos.forEach(element => {
                  if(this.banderas)
                    html += '<div class="equipis" id="E-' + element.Equipo.EquipoId + '"><div class="fondo_equipo">' +
                      '<div class="img_delegacion"> <img src="assets/banderas/' +
                      element.Equipo.DelegacionId + '.png" class="delegacion">' +
                      '</div>';
                  else
                    html += '<div class="equipis" id="E-' + element.Equipo.EquipoId + '"><div class="fondo_equipo">' +
                      '<div class="img_delegacion">' +                      
                      '</div>';
                  html += '<div class="txt_delegacion">' +
                    // tslint:disable-next-line:max-line-length
                    '<div class="textoDele" style="background-image: url(assets/08/sorteo/grupo-1.png); background-size: 100% 100%;">' +
                    '<div class="nombre_equipo">' + element.Equipo.EquipoDescripcion + '</div>' +
                    // '<marquee class="nombre_colegio" scrolldelay="200">' + element.Equipo.DelegacionNombre + '</marquee>'
                    '<div class="nombre_colegio">' + element.Equipo.DelegacionNombre + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '</div>';
                });
                $('#' + this.GrupoId + ' #contenedor').html(html);
                $('#E-' + this.equipoID).hide();
                $('#E-' + this.equipoID).toggle('slow');

              });
          }
        }
      });


      c.invoke('ControlSorteo', this.o.qs.name, this.o.qs.group).then(() => {
      });
    });
  }

  private getDeporte() {
    this.deporte = '';
    this.deporteService.getDeportes(this.EventoId).then(res => {

      this.deporte = res.filter(item => item.DeporteId === this.deporteId)[0].DeporteDescripcion.toUpperCase();
    });
  }
  private getGenero() {
    this.conjuntoService
      .getParametro(3)
      .then(res => {
        this.genero = res.filter(item => item.value === this.ramaId)[0].label.toUpperCase();
      });

  }

}
