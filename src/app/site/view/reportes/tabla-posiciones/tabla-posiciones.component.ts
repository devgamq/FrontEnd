import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { PodioService } from '../../../service/conjunto/podio.service';
import { JasperService } from '../../../service/Conjunto/jasper.service';

@Component({
  selector: 'app-tabla-posiciones',
  templateUrl: './tabla-posiciones.component.html',
  styleUrls: ['./tabla-posiciones.component.css'],
  providers: [DeporteService, ConjuntoService, PodioService, JasperService],
  encapsulation: ViewEncapsulation.None
})
export class TablaPosicionesComponent implements OnInit {
  deportes: SelectItem[];
  categorias: SelectItem[];
  groups: SelectItem[];
  group: any;
  deporte: any;
  categoria: any;
  evento: any;
  grupo: String = '';
  grupos_aux: any[];
  data: any[];
  grupos: any[];
  keys: string[];
  cantidad: number;
  constructor(
    private route: ActivatedRoute,
    private deporteService: DeporteService,
    private pService: PodioService,
    private JasperService: JasperService,
    private conjuntoService: ConjuntoService
  ) {
    this.deportes = [];
    this.grupos_aux = [];
    this.data = [];
    this.grupos = [];
    this.keys = [];
    this.groups = [];
    this.evento = this.route.snapshot.params['eventoId'];
  }

  ngOnInit() {
    this.initDeportes();
    this.initRamas();
  }
  private initDeportes() {
    this.deporteService.getDeportes(this.evento).then(res => {
      this.deportes = res
        .map(item => {
          return {
            value: item.DeporteId,
            label: item.DeporteDescripcion
          };
        })
        .sort((a, b) =>
        String(a.label).localeCompare(
          String(b.label)
        )
      );
    });
  }
  private initRamas() {
    this.categorias = [];
    this.categorias.push({ label: 'Todas', value: 0 });
    this.conjuntoService.getParametro(3).then(res => {
      const aux = res;
      aux.forEach(element => {
        this.categorias.push({ label: element.label, value: element.value });
      });
    });
  }
  private initGrupos() {
    this.groups = [];
    this.groups.push({ label: 'Todos', value: 0 });
    this.conjuntoService
      .GetGruposDeportes(this.evento, this.deporte, this.categoria)
      .then(res => {
        const aux = res;
        aux.forEach(element => {
          this.groups.push({ label: element.Grupo, value: element.GrupoId });
        });
        this.group = 0;
        this.cargarPodio();
      });
  }
  selectedDeporte() {
    this.initGrupos();
  }
  selectedCategoria() {
    this.initGrupos();
  }
  selectedGrupo() {
    this.cargarPodio();
  }
  private normalizarHeader(lista: string[]) {
    this.keys = [];
    lista.forEach(element => {
      if (element.length === 2) {
        this.keys.push(element.toUpperCase());
      }
    });
  }
  private cargarPodio() {
    this.grupos = [];
    this.data = [];

    this.pService
      .GetTablaPosicion(this.evento, this.deporte, this.categoria, this.group)
      .then(res => {
        if (res.length > 0) {
          this.normalizarHeader(Object.keys(res[0]));

          this.data = res;

          res.forEach(item => {
            if (item.Grupo !== this.grupo) {
              this.grupos.push({
                grupo: item.Grupo,
                ParametroRamaId: item.ParametroRamaId,
                parametroNombre:
                  item.ParametroRamaId === 1
                    ? 'MASCULINO'
                    : item.ParametroRamaId === 2 ? 'FEMENINO' : 'MIXTO'
              });
              this.grupo = item.Grupo;
            }
          });

          this.cantidad = res.length;
          this.grupo = '';
        }
      });
  }
  public getGrupoDatos(g, parametro) {
    return this.data
      .filter(item => item.Grupo === g && item.ParametroRamaId === parametro)
      .sort((a, b) => {
        if (a.PT > b.PT) {
          return -1;
        } else {
          if (a.PT < b.PT) {
            return 1;
          } else {
            return 0;
          }
        }
      });
  }

  public imprimir() {
    this.JasperService.getTablaPosicion(this.evento, this.deporte).then(res => {
      window.open(URL.createObjectURL(res));
    });
  }
}
