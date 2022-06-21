import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  SimpleChanges
} from '@angular/core';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { SimpleService } from '../../../service/simple/simple.service';
import { Cronograma } from '../../../domain/deportes/grupo/cronograma';
import { Router, ActivatedRoute } from '@angular/router';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';
@Component({
  selector: 'app-versus',
  templateUrl: './versus.component.html',
  styleUrls: ['./versus.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConjuntoService, SimpleService]
})
export class VersusComponent implements OnInit {
  @Input() EventoId: number;
  @Input() CronogramaId: number;
  @Input() DeporteId: number;
  @Input() tiempo;
  @Input() Refresh = false;

  private _connection: SignalRConnection;

  titulo: string;
  sub_titulo: string;
  style: any;
  style_titulo: any;
  style_rojo: any;
  style_azul: any;
  competidor_rojo: any;
  competidor_azul: any;
  hora: any;
  NombreA = '';
  NombreR = '';
  DelegacionR = 0;
  DelegacionA = 0;
  EstaturaR = '0';
  PesoR = 0;
  EstaturaA = '0';
  PesoA = 0;
  fechastr: Date;
  delegacion: any = 0;
  fechas: any[];
  fechas_aux: any[];
  instalaciones: any[];
  data: any[];
  en: any;
  planilla = 0;
  categoria: any;
  prueba: any;
  fechaCronograma: Date;
  lugar: any;
  deporteId: any;
  parametroId: any;
  foto = '../../../../../assets/04/logos/boxeo.png';
  fotoA = '../../../../../assets/04/logos/boxeo.png';
  bazul = '../../../../../assets/04/logos/bazul.png';
  brojo = '../../../../../assets/04/logos/brojo.png';
  filterP: any[];
  nombreDelegacionA: String;
  nombreDelegacionB: String;
  deporte: any;
  cat: any;
  pru: any;
  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'versus', group: 'contacto' },
    url: urls.urlSockets
  };

  constructor(
    private conjuntoService: ConjuntoService,
    private simpleService: SimpleService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private _signalR: SignalR
  ) {
    this.titulo = '';
    this.EventoId = this.activedRoute.snapshot.params['eventoId'];
    this.DeporteId = this.activedRoute.snapshot.params['deporteId'];
    this.css();
    this.initTitulo();
    this.cargarDatos();
  }

  ngOnInit() {

    this.conectar();
  }
  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {

      const listenerSuceso = c.listenFor('setCodesur');
      listenerSuceso.subscribe(data => {
        this.CronogramaId = data['CronogramaId'];
        this.initCompetidorR();
        this.initCompetidorA();

        this.initDetalle();
      });
    });

  }
  private css() {

    this.style = {
      'background-image':
        'url("assets/0' +
        this.EventoId +
        '/fondos/bh' +
        this.DeporteId +
        '.jpg")'
    };
  }

  private initTitulo() {


    this.conjuntoService.GetEvento(this.EventoId).then(res => {
      const t1 = res.Ubicacion;
      const t2 = res.Version;
      this.titulo = t2 + ' ' + res.Nombre;
    });
  }
  private initCompetidorR() {

    this.simpleService.GetCompetidor(this.CronogramaId, 1).then(res => {
      if (res.length > 0) {
        this.competidor_rojo = res[0];
        this.foto = res[0].FotoUrl;
        //  this.NombreR = res[0].Nombres;
        this.DelegacionR = res[0].DelegacionId;
        // this.EstaturaR = res[0].Talla;
        // this.PesoR = res[0].Peso;
        this.nombreDelegacionA = res[0].Delegacion;
        this.NombreR = res[0].NombreCorto;

        if (res[0].Peso === null || res[0].Talla === null) {
          this.EstaturaR = '0';
          this.PesoR = 0;
        } else {
          this.EstaturaR = res[0].Talla;
          this.PesoR = res[0].Peso;
        }
      }
    });
  }
  private initCompetidorA() {

    this.simpleService.GetCompetidor(this.CronogramaId, 2).then(res => {
      if (res.length > 0) {
        this.competidor_azul = JSON.stringify(res[0]);
        this.fotoA = res[0].FotoUrl;
        //  this.NombreA = res[0].Nombres;
        this.DelegacionA = res[0].DelegacionId;
        // this.EstaturaA = res[0].Talla;
        // this.PesoA = res[0].Peso;
        this.nombreDelegacionB = res[0].Delegacion;
        this.NombreA = res[0].NombreCorto;
        if (res[0].Peso === null || res[0].Talla === null) {
          this.EstaturaA = '0';
          this.PesoA = 0;
        } else {
          this.EstaturaA = res[0].Talla;
          this.PesoA = res[0].Peso;
        }

      }
    });
  }

  private initDetalle() {

    this.filterP = this.data.filter(item => Number(item.CronogramaId) === Number(this.CronogramaId));
    this.categoria = this.filterP[0].Rama;
    this.prueba = this.filterP[0].Prueba;
    this.fechaCronograma = this.filterP[0].Fecha;
    this.lugar = this.filterP[0].Instalacion;
    this.NombreR = this.filterP[0].NombreReducidoEquipoA;
    this.NombreA = this.filterP[0].NombreReducidoEquipoB;
    this.deporte = this.filterP[0].Deporte;
    // this.hora = this.filterP[0].HoraProgramada;

    const split = this.filterP[0].HoraProgramada.split(':');
    const hr = split[0];
    const mm = split[1];
    const completo = hr + ':' + mm;
    this.hora = completo;
  }

  private cargarDatos() {
    this.conjuntoService
      .GetProgramacionConjunto(
        this.EventoId,
        this.DeporteId,
        this.fechastr,
        this.delegacion
      )
      .then(res => {
        if (res.length > 0) {
          this.data = res;
          this.fechas = [];
          this.fechas_aux = [];

          this.data.forEach(element => {
            const base = {
              fecha: element.Fecha,
              escenarios: this.setInstalaciones(element.Fecha)
            };

            if (this.fechas_aux.indexOf(element.Fecha) === -1) {
              this.fechas.push(base);
              this.fechas_aux.push(element.Fecha);
            }
          });

        }
      });
  }
  public setInstalaciones(fecha) {
    const instalaciones = [];
    const datos = this.data.filter(item => item.Fecha === fecha);

    datos.forEach(element => {
      if (instalaciones.indexOf(element.Instalacion) === -1) {
        instalaciones.push(element.Instalacion);
      }
    });

    return instalaciones;
  }


}
