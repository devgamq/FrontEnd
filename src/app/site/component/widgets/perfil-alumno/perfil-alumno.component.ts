import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { PodioService } from '../../../service/conjunto/podio.service';
import { Podio } from '../../../domain/deportes/grupo/podio';
import { Util } from '../../../view/Futbol/util';

@Component({
  selector: 'app-perfil-alumno',
  templateUrl: './perfil-alumno.component.html',
  styleUrls: ['./perfil-alumno.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [PodioService]
})

// tslint:disable-next-line:directive-class-suffix
export class PerfilAlumnoComponent implements OnInit, OnChanges {
  @ViewChild('panel', { read: ElementRef })
  public panel: ElementRef;

  @Input() eventoId = 1;
  @Input() DeporteId = 1;
  @Input() tiempo;
  @Input() Refresh = false;

  Prueba: string;
  data: any[];
  src: string;
  nombre: any;
  paterno: any;
  materno: any;
  delegacion: any;
  estatura: any;
  peso: any;
  fechaNacimiento: Date;
  deporteS: any;
  fotoUrl: any;
  fotoError: any;
  style: any;
  style_fondo: any;
  style_titulo: any;
  DelegacionId: number;
  timer: any;
  utilidad: Util;
  clase_panel = '';
  constructor(private podioService: PodioService) {
    this.data = [];

    this.utilidad = new Util();
  }

  ngOnInit() {
    this.initCss();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.data = [];
    clearInterval(this.timer);
    this.timer = null;
    this.nombre = '';
    this.paterno = '';
    this.materno = '';
    this.delegacion = '';
    this.estatura = 0;
    this.peso = 0;
    this.deporteS = '';
    this.fotoUrl = '';
    this.cargarData();
  }
  private initCss() {
    if (this.eventoId === 3) {
      this.clase_panel = 'panel_posiciones5';
    }
    this.style = {
      'background-image':
        'url("assets/0' + this.eventoId + '/fondos/bg' + 1 + '.png")'
    };
    this.style_fondo = {
      'background-image':
        'url("assets/0' + this.eventoId + '/fondos/fondopodio.png")'
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
  private setData(indice: number) {
    this.nombre = this.data[indice].Nombres;
    this.paterno = this.data[indice].Paterno;
    this.materno = this.data[indice].Materno;
    this.delegacion = this.data[indice].Delegacion;
    this.deporteS = this.data[indice].Deporte;
    this.estatura = this.data[indice].Estatura;
    this.peso = this.data[indice].Peso;
    this.fechaNacimiento = this.data[indice].FechaNacimiento;
    this.fotoUrl = this.data[indice].FotoUrl;
    this.DelegacionId = this.data[indice].DelegacionId;
    this.fotoError = 'assets/banderas/' + this.DelegacionId + '.png';
  }

  private cargarData() {
    this.podioService.GetParticipantesDeporte(this.eventoId, this.DeporteId).then(res => {
      console.clear();
      console.log(res);
      this.data = res.filter(
        item => Number(item.DeporteId) === this.DeporteId
      );

      let c = 0;

      this.setData(c);

      this.timer = setInterval(() => {
        c++;
        this.setData(c);

        if (c === this.data.length - 1) {
          c = 0;
          // clearInterval(timer);
        }
      }, this.tiempo * 1000);
    });
  }
}
