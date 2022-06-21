import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HoyoPar } from '../../../../domain/Golf/hoyoPar';
import { JornadaService } from '../../../../service/Golf/jornada.service';
import { CategoriaService } from '../../../../service/Golf/categoria.service';
import { SocketService } from '../../../../service/Shared/socket.service';
import { SelectItem } from 'primeng/primeng';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../../domain/Shared/global';
import {
  Input,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges
} from '@angular/core';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css'],
  providers: [JornadaService, SocketService, CategoriaService],
  encapsulation: ViewEncapsulation.None
})
export class VisorComponent implements OnInit, AfterViewInit {
  @ViewChild('panel', { read: ElementRef })
  public panel: ElementRef;
  clasificatorias: string[];
  clasificatoriasSHCP: string[];
  hoyoPar: HoyoPar[];
  eventoId: number;
  jornadaId = 0;
  categoriaId = 0;
  stateLoad = false;
  styleB: any;
  jornadas: SelectItem[];
  categorias: SelectItem[];
  iJornada = 0;
  iCategoria = 0;
  titulo: string;
  categoriaDesc: string;
  jornadaDesc: string;
  visibleGrid: boolean;
  tieneScroll = false;
  tamTitulo: string;
  connection;
  connection2;
  timer;
  timer2;
  gridvacio: any[];
  handy: boolean;
  styleColum: any;
  styleColum2: any;
  styleColum3: any;
  styleColum5: any;
  styleColum6: any;
  styleColum7: any;
  bandera:Boolean;
  cols: any[] = [];
  styleColumVisor: any;
  styleColumNegrita: any;
  

  leyendaVisor: string;

  scrollDetener = false;
  private _connection: SignalRConnection;
  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'usuario:visor', group: 'golf' },
    url: urls.urlSockets
  };

  constructor(
    private jornadaService: JornadaService,
    private activedRoute: ActivatedRoute,
    private socket: SocketService,
    private categoriaService: CategoriaService,
    private _signalR: SignalR
  ) {
    this.styleColum = {
      'background-color': '#000',
      width: '50px',
      color: 'white'
    };
    this.styleColum2 = {
      'background-color': '#000',
      width: '150px',
      color: 'white'
    };
    this.styleColum3 = {
      'background-color': '#000',
      width: '55px',
      color: 'white'
    };
    this.styleColum5 = {
      'background-color': '#000',
      width: '55px',
      color: 'white'
    };
    this.styleColum6 = {
      'background-color': '#000',
      width: '60px',
      color: 'white'
    };
    // this.styleColum7 = { 'background-color': '#000', width: '3%', color: 'white' };

    this.styleColumVisor = {
      'background-color': '#000',
      color: 'white',
      'font-weight': 'bold',
      'font-size': '1vw'
    };
    this.styleColumNegrita = { 'font-weight': 'bold' };
    this.eventoId = this.activedRoute.snapshot.params['eventoId'];
  }

  ngOnInit() {
    this.leyendaVisor = 'leyendaVisor';
    this.conectar();
    $('body').attr(
      'style',
      'overflow-y:hidden !important; overflow-x:hidden !important; '
    );
    this.doGetCategorias();
    this.doGetJornadas();
    this.styleB = '#ccc';
    this.doGetEventoDeportivo();
    this.gridvacio = [1];
  }

  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {
      const listener = c.listenFor('devuelveDatos');

      listener.subscribe(data => {
        this.jornadaId = data['jornadaId'];
        this.jornadaDesc = data['jornada'];
        this.categoriaId = data['categoriaId'];
        this.categoriaDesc = data['categoria'];
        this.doGetClasificatorias();
        if (this.tieneScroll) {
          this.scrollSocket(0);
        }
      });
      const actualizarGrid = c.listenFor('devuelveGrid');
      actualizarGrid.subscribe(data => {
        this.doGetClasificatorias();
      });

      const scrollGrid = c.listenFor('devuelveScroll');
      scrollGrid.subscribe(data => {
        this.clean();
        if (data === 'scroll') {
          this.scrollDetener = false;
          this.scrollSocket(0);
        } else {
          this.scrollDetener = true;
        }
      });

      const ocultarHandy = c.listenFor('devuelveHandy');
      ocultarHandy.subscribe(data => {
        if (data === 'mostrar') {
          this.handy = true;
        } else {
          this.handy = false;
        }
      });
    });
  }
private clean()
{
  clearInterval(this.timer);
  clearInterval(this.timer2);
  this.panel.nativeElement.scrollTop = 0;
}
  ngAfterViewInit() {
    this.doGetHoyoPar();
  }
  doGetHoyoPar() {
    this.jornadaService.getHoyoPar(1).then(res => {
      this.hoyoPar = res;
      this.doGetClasificatorias();
      this.stateLoad = true;
    });
  }
  doGetClasificatorias() {
    this.jornadaService
      .getClasificatoriaList(this.jornadaId, this.categoriaId)
      .then(res => {
        this.clasificatorias = res;
        this.cols = [];
        
                // tslint:disable-next-line:forin
                for (const key in res['0']) {
                  this.cols.push({ field: key, header: key });
                }
        for (let i = 0; i < res.length; i++) {
          const x = res[`${i}`]['Score'];
         
          if (x > 0) {
            res[`${i}`]['Score'] = `+${x}`;
          }
          
          
        }

        var cantidadDeClaves = Object.keys(res[0]).length;
        
               if (cantidadDeClaves == 30) {
                 this.bandera = false;
               
                 
               } else {
                 this.bandera = true;
              
               }


      });
  }
  doGetClasificatoriasSHCP() {
    this.jornadaService
      .getClasificatoriaListSHCP(this.jornadaId, this.categoriaId)
      .then(res => {
        this.clasificatoriasSHCP = res;
      });
  }
  doGetClasificatoriasSocket() {
    const newClasificatorias = [];
    let index = 1;
    this.jornadaService
      .getClasificatoriaList(this.jornadaId, this.categoriaId)
      .then(res => {
        this.clasificatorias = res;
        this.clasificatorias.forEach(item => {
          const row1: any = Object.assign(
            {},
            {
              '1': item['1'],
              '2': item['2'],
              '3': item['3'],
              '4': item['4'],
              '5': item['5'],
              '6': item['6'],
              '7': item['7'],
              '8': item['8'],
              '9': item['9'],
              '10': item['10'],
              '11': item['11'],
              '12': item['12'],
              '13': item['13'],
              '14': item['14'],
              '15': item['15'],
              '16': item['16'],
              '17': item['17'],
              '18': item['18'],
              Posicion: index,
              NomCompleto: item['NomCompleto'],
              Nombre: item['Nombre'],
              club: item['club'],
              '1 Vuelta': item['1 Vuelta'],
              '2 Vuelta': item['2 Vuelta'],
              Handicap: item['Handicap'],
              Total: item['Total'],
              TotalNeto: item['TotalNeto'],
              Score: item['Score']
            }
          );
          newClasificatorias.push(row1);
          index++;
        });
        this.clasificatorias = newClasificatorias;

        if (
          this.categoriaId === 16 ||
          this.categoriaId === 17 ||
          this.categoriaId === 18 ||
          this.categoriaId === 19
        ) {
          this.visibleGrid = true;
          this.doGetClasificatoriasSHCP();
        } else {
          this.visibleGrid = false;
        }
      });
  }
  doGetCategorias() {
    this.categoriaService.getCategoriasList(this.eventoId).then(res => {
      this.categorias = res.map(item => {
        return {
          label: item.Descripcion,
          value: item.CategoriaId
        };
      });
    });
  }

  doGetJornadas() {
    this.jornadaService.getJornadasList(this.eventoId).then(res => {
      this.jornadas = res.map(item => {
        return {
          label: item.Descripcion,
          value: item.JornadaId
        };
      });
    });
  }

  doGetEventoDeportivo() {
    this.jornadaService.getEventoDeportivo(this.eventoId).then(res => {
      this.titulo = res[0]['Nombre'];
    });
  }
  scrollSocket(posicion) {
    let index = 0;
    if (posicion === 0) {
      index = 0;
    } else {
      index = posicion;
    }
    const tam = this.categorias.length - 1;
    let top = 0;
    this.timer = setInterval(() => {
      this.panel.nativeElement.scrollTop += 1;
      if (this.scrollDetener) {
        clearInterval(this.timer);
        this.panel.nativeElement.scrollTop = top = 0;
      } else {
        if (top < this.panel.nativeElement.scrollTop) {
          top = this.panel.nativeElement.scrollTop;
        } else if (top === this.panel.nativeElement.scrollTop) {
          clearInterval(this.timer);
          if (index < tam) {
            index++;
          } else {
            index = 0;
          }
          this.scroll_inverso(top, index);
        }
      }
    }, 20);
  }
  scroll_inverso(top, index2) {
    this.timer2 = setInterval(() => {
      this.panel.nativeElement.scrollTop -= 1;
      if (this.scrollDetener) {
        clearInterval(this.timer2);
        this.panel.nativeElement.scrollTop = 0;
      } else {
       if (this.panel.nativeElement.scrollTop === 0) {
         clearInterval(this.timer2);
        // this.cambiarCategoria(index2);
        this.scrollSocket(top);
      }
    }
    }, 40);
  }
  cambiarCategoria(index) {
    this.categoriaId = this.categorias[index].value;
    this.categoriaDesc = this.categorias[index].label;
    this.doGetClasificatorias();
  }
  // tslint:disable-next-line:eofline
}
