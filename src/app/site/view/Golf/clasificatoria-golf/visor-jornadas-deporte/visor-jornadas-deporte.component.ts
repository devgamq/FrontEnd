import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JornadaService } from '../../../../service/Golf/jornada.service';
import { CategoriaService } from '../../../../service/Golf/categoria.service';
import { SocketService } from '../../../../service/Shared/socket.service';
import { ResultadosServices } from '../../../../service/Golf/ResultadosFinales';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../../domain/Shared/global';
import { SelectItem } from 'primeng/primeng';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-visor-jornadas-deporte',
  templateUrl: './visor-jornadas-deporte.component.html',
  styleUrls: ['./visor-jornadas-deporte.component.css'],
  providers: [
    JornadaService,
    SocketService,
    CategoriaService,
    ResultadosServices
  ],
  encapsulation: ViewEncapsulation.None
})
export class VisorJornadasDeporteComponent implements OnInit {
  @ViewChild('panel', { read: ElementRef })
  public panel: ElementRef;
  tiempo = 70;
  timer;
  timer_reversa;
  eventoId = 0;
  titulo = '';
  categoria = '';
  categoriaId = 0;
  TotalesTorneo: string[];
  cols: any[] = [];
  indice = 0;
  pruebaEventoId = 0;
  tiempo_espera = 0;

  private _connection: SignalRConnection;
  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'usuario:visor_jornada', group: 'golf_equipo' },
    url: urls.urlSockets
  };

  constructor(
    private activedRoute: ActivatedRoute,
    private jornadaService: JornadaService,
    private ResultadosServices: ResultadosServices,
    private _signalR: SignalR,
    private categoriaService: CategoriaService
  ) {
    this.eventoId = this.activedRoute.snapshot.params['eventoId'];
  }

  ngOnInit() {
    this.init_css();
    this.doGetEventoDeportivo();

    this.conectar();
  }

  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {
      const listener = c.listenFor('devuelveDatos');
      listener.subscribe(data => {
        console.log(data)
        this.categoriaId = data['categoriaId'];
        this.categoria = data['categoria'];
        this.pruebaEventoId = data['PruebaEventoId'];

        this.clean();
        this.indice = 0;
        this.doGetJornadas();
        // this.doLoadResultadosFinales();
      });
    });
  }
  private clean() {
    this.panel.nativeElement.scrollTop = 0;
    this.cleanHilos();

  }
  private cleanHilos() {
    this.tiempo_espera = 0;
    clearInterval(this.timer);
    clearInterval(this.timer_reversa);
  }
  private init_css() {
    $('body').attr(
      'style',
      'overflow-y:hidden !important; overflow-x:hidden !important; '
    );
  }
  doGetEventoDeportivo() {
    this.jornadaService.getEventoDeportivo(this.eventoId).then(res => {
      this.titulo = res[0]['Nombre'];
    });
  }
  doLoadResultadosFinales() {
    this.ResultadosServices.getGolfTotalesTorneo(
      this.eventoId,
      this.categoriaId
    ).then(resultado => {
      this.TotalesTorneo = resultado;
      this.cols = [];
      // tslint:disable-next-line:forin
      for (const key in resultado['0']) {
        this.cols.push({ field: key, header: key });
      }
      for (let i = 0; i < resultado.length; i++) {
        const x = resultado[`${i}`]['Score'];
        if (x > 0) {
          resultado[`${i}`]['Score'] = `+${x}`;
        }
      }
      this.TotalesTorneo = resultado;
      this.scrollSocket(0);


    });
  }

  scrollSocket(posicion) {

let tiempoR = 0;
    let top = 0;
    this.timer = setInterval(() => {
      this.panel.nativeElement.scrollTop += 1;
      if (top < this.panel.nativeElement.scrollTop) {
        top = this.panel.nativeElement.scrollTop;
      } else if (top === this.panel.nativeElement.scrollTop) {
       tiempoR += 1;
      if(tiempoR === 200)
      {
        this.cleanHilos();
        this.scroll_inverso(top);

      }
     
       
      }

    }, 30);
  }
  scroll_inverso(top) {

  let tiempoE  = 0;
    this.timer_reversa = setInterval(() => {
      this.panel.nativeElement.scrollTop -= 1;
      if (this.panel.nativeElement.scrollTop === 0) {
       tiempoE += 1;
       if(tiempoE === 200)
       {
        this.cleanHilos();
        this.scrollSocket(0);
       }
       

      }
    }, 30);
  }
  doGetJornadas() {

    const data = this.jornadaService.getEquiposJornada(this.eventoId, this.pruebaEventoId, 144)
      .then(resultado => {

        this.TotalesTorneo = resultado;

         this.scrollSocket(0);
      });



  }

}
