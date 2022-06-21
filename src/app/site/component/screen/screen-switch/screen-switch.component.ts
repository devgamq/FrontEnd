import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';

@Component({
  selector: 'app-screen-switch',
  templateUrl: './screen-switch.component.html',
  styleUrls: ['./screen-switch.component.css']
})
export class ScreenSwitchComponent implements OnInit {
  mensaje: string;
  constructor(
    private _signalR: SignalR,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.connect();
  }

  connect() {
    const o: IConnectionOptions = {
      hubName: 'HammerHub',
      qs: { name: this.route.snapshot.params['screenId'], group: 'screen' },
      url: urls.urlSockets
    };
    const conn = this._signalR.connect(o).then((c) => {
      const listener = c.listenFor('hello');
      listener.subscribe(() => {
        this.mensaje = 'Hola ariel';
      });
    });
  }

}
