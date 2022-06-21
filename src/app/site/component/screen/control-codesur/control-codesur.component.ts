import { Component, OnInit } from '@angular/core';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';

@Component({
  selector: 'app-control-codesur',
  templateUrl: './control-codesur.component.html',
  styleUrls: ['./control-codesur.component.css']
})
export class ControlCodesurComponent implements OnInit {
  private _connection: SignalRConnection;
  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'control', group: 'codesur' },
    url: urls.urlSockets
  };
  constructor(private _signalR: SignalR) { }

  ngOnInit() {
    this.conectar();
    this.hiloConectar();
  }
  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then((c) => {
      const listener = c.listenFor('ControlCodesur');
      listener.subscribe();
      c.invoke('ControlCodesur', this.o.qs.name, this.o.qs.group).then(() => { });
    });
  }
  send() {
    this._connection.invoke('sendCodesur', this.o.qs.group, true);
  }
  private hiloConectar() {

    const timerScroll = setInterval(() => {
      console.clear();
      this.conectar();
    }, 600000);
  }
}
