import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { SelectItem } from 'primeng/primeng';
import * as urls from '../../../domain/Shared/global';

@Component({
    selector: 'app-control-switch',
    templateUrl: './control-switch.component.html',
    styleUrls: ['./control-switch.component.css']
})
export class ControlSwitchComponent implements OnInit {
    private _connection: SignalRConnection;
    grupos: SelectItem[];
    grupo: any;
    clientes: SelectItem[];
    cliente: any;

    constructor(
        private _signalR: SignalR,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.connect();
    }

    connect() {
        const o: IConnectionOptions = {
            hubName: 'HammerHub',
            qs: { name: 'remote', group: 'remote' },
            url: urls.urlSockets
        };
        this._connection = this._signalR.createConnection(o);
        this._connection.start().then((c) => {

            const listener = c.listenFor('SetGroups');
            listener.subscribe((data) => {
                console.log(123);
                console.log(data);
            });
            c.invoke('GetGroups', o.qs.name, o.qs.group).then(() => {

            });
        });
    }
    clickButton() {
        this._connection.invoke('Hello', 'pantalla1', 'screen').then(() => {

        });
    }
}
