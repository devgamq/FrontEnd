import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { GrupoService } from '../../../service/Conjunto/grupo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PodioService } from '../../../service/conjunto/podio.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css'],
  providers: [
    DeporteService,
    ConjuntoService,
    PodioService,
    GrupoService,
    ConfirmationService
  ],
  encapsulation: ViewEncapsulation.None
})
export class GrupoComponent implements OnInit {
  msgs: Message[] = [];
  deportes: SelectItem[];
  pruebas: SelectItem[];
  categorias: SelectItem[];
  tipos: SelectItem[];
  fases: SelectItem[];
  tabla: any[];
  datoSeleccionado: any[];

  evento: number;
  deporte: any;
  prueba: any;
  categoria: any;
  fase: any;
  grupo: any;
  tipo: any;
  hideBorrar = false;
  PruebaEventoId = 0;

  constructor(
    private podioService: PodioService,
    private deporteService: DeporteService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private conjuntoService: ConjuntoService,
    private grupoService: GrupoService
  ) {
    this.evento = this.route.snapshot.params['eventoId'];
    this.deportes = [];
    this.pruebas = [];
    this.categorias = [];
    this.fases = [];
    this.tabla = [];
    this.tipos = [];

    this.prueba = 0;
    this.categoria = 0;
  }

  ngOnInit() {
    this.initDeportes();
    this.initFases();
  }
  private initFases() {
    this.fases = [];
    this.conjuntoService.getParametro(8).then(res => {
      if (res.length > 0) {
        this.fases = res;
        this.fase = res[0].value;
      }
    });
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
        .sort((a, b) => String(a.label).localeCompare(String(b.label)));
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
  private selectedDeporte() {
    this.tipos = [];
    this.categorias = [];
    this.tabla = [];
    // this.tabla = [];
    this.deporteService.getTipos(this.evento, this.deporte).then(res => {
      if (res.length > 0) {
        this.tipo = res[0].EsIndivudual;
      } else {
        this.tipo = -1;
      }
      this.selectedTipo();
    });
  }
  private selectedTipo() {
    this.pruebas = [];
    this.deporteService
      .getPruebas(this.evento, this.deporte, this.tipo)
      .then(res => {
        res.forEach(item => {
          this.pruebas.push({
            label: item.PruebaDescripcion,
            value: item.PruebaId
          });
        });
      });
  }
  private selectedPrueba() {
    this.categorias = [];
    this.deporteService
      .getRamas(this.evento, this.deporte, this.tipo, this.prueba)
      .then(res => {
        res.forEach(item => {
          this.categorias.push({
            label: item.Nombre,
            value: {
              value: item.ParametroRamaId,
              PruebaEventoId: item.PruebaEventoId
            }
          });
        });
      });
  }
  private selectedRama() {
    this.PruebaEventoId = this.categoria.PruebaEventoId;
    this.cargarTabla();
  }
  private cargarTabla() {
    this.grupoService.GetGruposPruebasEvento(this.PruebaEventoId).then(res => {
      this.tabla = res;
    });
  }

  private save(editar: boolean) {
    const data = {
      ParametroFaseId: this.fase,
      PruebaEventoId: this.PruebaEventoId,
      GrupoDescripcion: this.grupo
    };
    if (Number(this.PruebaEventoId) > 0 && String(this.grupo).trim() !== '') {
      this.grupoService.SaveGrupo(data).subscribe(res => {
        this.msgs = [];
        this.clean();
        this.cargarTabla();
      });
    } else {
      this.setError('Debe completar el formulario para registrar un grupo');
    }
  }
  private clean() {
    this.grupo = '';
    this.datoSeleccionado = [];
    this.hideBorrar = false;
    this.msgs = [];
  }
  private setError(texto) {
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: 'Error:',
      detail: texto
    });
  }
  private edit() {
    if (Number(this.datoSeleccionado['GrupoId']) > 0) {
      const data = {
        ParametroFaseId: this.fase,
        PruebaEventoId: this.PruebaEventoId,
        GrupoDescripcion: this.grupo,
        GrupoId: this.datoSeleccionado['GrupoId']
      };
      if (Number(this.PruebaEventoId) > 0 && String(this.grupo).trim() !== '') {
        this.grupoService.UpdateGrupo(data).subscribe(res => {
          this.clean();
          this.cargarTabla();
        });
      } else {
        this.setError('Debe completar el formulario para registrar un grupo');
      }
    }
  }
  private eliminarRegistro() {
    if (Number(this.datoSeleccionado['GrupoId']) > 0) {
      this.confirmationService.confirm({
        message:
          'Desea eliminar el grupo ' + this.datoSeleccionado['Grupo'] + '?',
        accept: () => {
          this.grupoService
            .DeleteGrupo(Number(this.datoSeleccionado['GrupoId']))
            .subscribe(res => {
              this.clean();
              this.cargarTabla();
            });
        }
      });
    }
  }

  onRowSelect($event) {
    this.datoSeleccionado = [];
    this.hideBorrar = true;
    this.datoSeleccionado = $event.data;

    this.cargarData();
  }
  private cargarData() {
    this.grupo = this.datoSeleccionado['Grupo'];
    this.fase = this.datoSeleccionado['ParametroFaseId'];
  }
}
