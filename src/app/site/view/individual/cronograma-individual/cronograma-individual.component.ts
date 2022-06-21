import { Component, OnInit } from '@angular/core';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ActivatedRoute, Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { SelectItem, Message } from 'primeng/primeng';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Evento } from '../../../domain/deportes/grupo/evento';
import * as config from '../../../domain/Shared/global';
import { PipeFechaComponent } from '../../reportes/pipe-fecha/pipe-fecha.component';

@Component({
  selector: 'app-cronograma-individual',
  templateUrl: './cronograma-individual.component.html',
  styleUrls: ['./cronograma-individual.component.css'],
  providers: [DeporteService, ConjuntoService]
})
export class CronogramaIndividualComponent implements OnInit {
  nombreDeporte: string;
  eventoId: number;
  deporteId: number;
  msgs: Message[] = [];
  categorias: SelectItem[];
  pruebas: SelectItem[];
  deportes: any[];
  url: any[];
  IdEstado: number;
  pruebaId: 0;
  categoriaId: 0;
  fecha: Date;
  minDate: Date;
  maxDate: Date;
  language: any;
  evento: Evento;
  vista: any[];
  vButton = false;
  estadoId: number;
  datos: any[];


  constructor(private deporteService: DeporteService,
    private router: Router,
    private route: ActivatedRoute,
    private conjuntoService: ConjuntoService) {
    this.deportes = [];
    this.url = [];
    this.vista = [];
    this.fecha = new Date();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.language = config.es;

    router.events.forEach((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.url = [];
        this.url = event.url.split('/');
        if (this.url.length > 4) {
          if (this.url[2] === 'individual') {
            const pagina = this.url[2];
            this.eventoId = this.url[3];
            this.deporteId = this.url[4];
            this.initValores();
          }

        }
      }
    });
  }

  ngOnInit() {
    this.eventoId = this.route.snapshot.params['eventoId'];
    this.deporteId = this.route.snapshot.params['deporteId'];
    this.initValores();
    this.getData_storage();
    this.datos = [];
  }
  private initValores() {
    this.clean();
    this.getPruebas();
    this.doGetDeportes();
    this.getEvento();
  }
  private getEvento() {
    this.conjuntoService.GetEvento(this.eventoId).then(res => {
      this.evento = res;
      this.minDate = new Date(this.evento.Inicio);
      this.maxDate = new Date(this.evento.Fin);
    });
  }
  private clean() {
    this.categorias = [];
    this.pruebas = [];
    this.vista = [];
  }
  doGetDeportes() {
    this.deporteService
      .getDeportes(this.eventoId)
      .then(res => {

        this.deportes = res;
        if (res.length > 0) {
          const nombre = res.filter(
            a => Number(a.DeporteId) === Number(this.deporteId)
          );
          this.nombreDeporte = nombre.length > 0 ? nombre[0].DeporteDescripcion : '';
        }
      });
  }

  getPruebas() {
    this.pruebas = [];
    this.pruebas.push({ label: 'Todas', value: 0 });
    this.pruebaId = 0;
    this.deporteService.getPruebas(this.eventoId, this.deporteId, 1).then(res => {
      res.sort((a, b) =>
        String(a.PruebaDescripcion).localeCompare(
          String(b.PruebaDescripcion)
        )
      ).forEach(item => {
        this.pruebas.push({ label: item.PruebaDescripcion, value: item.PruebaId });
      });
      this.cleanCategorias();
      this.doGetEncuentros();
    });
  }
  private cleanCategorias() {

    this.categorias = [];
    this.categorias.push({ label: 'Todas', value: 0 });
    this.categoriaId = 0;
  }
  seleccionarPrueba() {

    this.getCategorias();
    this.doGetEncuentros();

  }
  getCategorias() {
    this.cleanCategorias();
    this.deporteService.getRamas(this.eventoId, this.deporteId, 1, this.pruebaId).then(res => {
      res.forEach(item => {
        this.categorias.push({ label: item.Nombre, value: item.ParametroRamaId });
      });
    });

  }
  doGetEncuentros() {
    this.conjuntoService
      .GetCronogramasFecha(this.deporteId, this.eventoId, this.pruebaId, this.fecha, this.categoriaId)
      .then(res => {
        this.vista = res;
        console.log(res);

      });
  }
  hanldeCalendario() {
    this.doGetEncuentros();
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

  verMarcador() {



    const data = {
      deporteId: this.deporteId, eventoId: this.eventoId,
      pruebaId: this.pruebaId, fecha: this.fecha, categoriaId: this.categoriaId
    };
    localStorage.setItem('individual', JSON.stringify(data));

    const datosEstado = this.datos['Estado'];
    const cronograma = this.datos['CronogramaId'];
    const prueba = this.datos['Prueba'];
    const rama = this.datos['Rama'];

    if (datosEstado === 'Abierto') {
      this.IdEstado = 1;
    }
    if (datosEstado === 'En Competencia' || datosEstado === 'En competencia') {
      this.IdEstado = 2;
    }
    if (datosEstado === 'Suspendido') {
      this.IdEstado = 3;
    }
    if (datosEstado === 'Concluido') {
      this.IdEstado = 4;
    }



    this.router.navigate(['/master/nuevocronogramaindividual/' + this.eventoId + '/' + this.deporteId +
      '/' + cronograma +
      '/' + prueba +
      '/' + rama +
      '/' + this.IdEstado]);

  }
  mostrarBotonResumen($event) {



    this.datos = $event.data;

    const userAgent = navigator.userAgent || navigator.vendor;

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.vButton = true;
    } else {
      this.vButton = false;
    }
  }
  handleRowDblclick($event) {
    const data = {
      deporteId: this.deporteId, eventoId: this.eventoId,
      pruebaId: this.pruebaId, fecha: this.fecha, categoriaId: this.categoriaId
    };
    localStorage.setItem('individual', JSON.stringify(data));


    if ($event.data.Estado === 'Abierto') {
      this.estadoId = 1;
    }
    if ($event.data.Estado === 'En Competencia' || $event.data.Estado === 'En competencia') {
      this.estadoId = 2;
    }
    if ($event.data.Estado === 'Suspendido') {
      this.estadoId = 3;
    }
    if ($event.data.Estado === 'Concluido') {
      this.estadoId = 4;
    }


    this.router.navigate(['/master/nuevocronogramaindividual/' + this.eventoId + '/' + this.deporteId +
      '/' + $event.data.CronogramaId +
      '/' + $event.data.Prueba +
      '/' + $event.data.Rama +
      '/' + this.estadoId]);
  }
  private getData_storage() {

    try {
      const aux_data = JSON.parse(localStorage.getItem('individual'));

      if (this.deporteId === aux_data.deporteId) {
        this.deporteId = aux_data.deporteId;
        this.eventoId = aux_data.eventoId;
        this.pruebaId = aux_data.pruebaId;
        this.fecha = new Date(aux_data.fecha);
        this.categoriaId = aux_data.categoriaId;
      }
    } catch (error) { }
  }

}
