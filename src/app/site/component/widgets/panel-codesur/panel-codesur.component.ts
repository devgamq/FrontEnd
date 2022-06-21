import { Component, OnInit } from '@angular/core';
import { Cronometro } from '../../../domain/widgets/cronometro.type';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-panel-codesur',
  templateUrl: './panel-codesur.component.html',
  styleUrls: ['./panel-codesur.component.css']
})
export class PanelCodesurComponent implements OnInit {
  private _connection: SignalRConnection;
  configuracion: Cronometro;
  show = true;
  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'cliente', group: 'codesur' },
    url: urls.urlSockets
  };

  constructor(private _signalR: SignalR) { this.configuracion = new Cronometro(); }

  ngOnInit() {

    $('body').attr('style', 'overflow-y:hidden !important; overflow-x:hidden !important; ');
    this.configuracion.segundo = 0;
    this.calcularTiempo();
    this.conectar();
    this. hiloConectar();
  }

  private calcularTiempo() {
    const MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
    const a = new Date('5/26/2018 08:30');
    const b = new Date();

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes());
    let resultado = Math.floor((utc1 - utc2) / MILISENGUNDOS_POR_DIA);
    let aux = (utc1 - utc2) / MILISENGUNDOS_POR_DIA;
    if (resultado < 0) { resultado = resultado * -1; }
    if (aux < 0) { aux = aux * -1; }
    const aux_hora = (aux - resultado) * 24;
    this.configuracion.dia = resultado;
    this.configuracion.hora = Math.floor(aux_hora);
    const aux_min = (aux_hora - Math.floor(aux_hora)) * 60;
    this.configuracion.minuto = Math.floor(aux_min);
  }
  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then((c) => {
      const listener = c.listenFor('setCodesur');
      listener.subscribe((data) => { this.show = false; });
      c.invoke('ControlCodesur', this.o.qs.name, this.o.qs.group).then(() => { });
    });
  }
  private hiloConectar() {

    const timerScroll = setInterval(() => {
      console.clear();
      this.conectar();
    }, 600000);
  }

}
