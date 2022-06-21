import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { SimpleService } from '../../../service/simple/simple.service';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';

@Component({
    selector: 'app-medallero-atletismo',
    templateUrl: './medallero-atletismo.component.html',
    styleUrls: ['./medallero-atletismo.component.css'],
    providers: [SimpleService, DeporteService],
    encapsulation: ViewEncapsulation.None
})
export class MedalleroAtletismoComponent implements OnInit, OnChanges {
    datasource: any;
    grupos: string[];
    titulo: string;
    style_titulo: any;
    private _connection: SignalRConnection;

    eventoId: number;
    style: any;

    o: IConnectionOptions = {
        hubName: 'HammerHub',
        qs: { name: 'cliente' + Math.random(), group: 'miniatletismo' },
        url: urls.urlSockets
    };

    constructor(private simpleService: SimpleService, private deporteService: DeporteService,
        private _signalR: SignalR) {
        this.grupos = [];
        this.eventoId = 1;
    }
    ngOnInit() { 
        debugger;
        this.css();
        this.eventoId = 1;
        this.initData();
    }
    private css() {
        this.eventoId = 1;
        switch (this.eventoId) {
            case 1: this.style = { 'background-image': 'url("assets/0' + this.eventoId + '/fondos/bh1.png")' };
                this.style_titulo = { 'color': '#972020' };
                break;
            case 2: this.style = { 'background-image': 'url("assets/0' + this.eventoId + '/fondos/bh1.png")' };
                this.style_titulo = { 'color': '#012C72' };
                break;
            default: this.style = { 'background-color': '#000' };
                this.style_titulo = { 'color': '#000' };
                break;
        }
    }
    initData() {

        this.grupos.push('1');

        this.getDeporte();
        this.cargarData();
        this.conectar();
    }
    ngOnChanges(changes: SimpleChanges) {
        debugger;
        this.initData();
    }
    private getDeporte() {
        this.titulo = '';
        // this.deporteService.getDeportes(this.eventoId).then(res => {
        this.deporteService.getDeportes(8).then(res => {

            this.titulo = 'MEDALLERO ' + res.filter(item => item.DeporteId === 2)[0].DeporteDescripcion.toUpperCase();
        });
    }
    private cargarData() {
        this.simpleService.GetPlanillaAtletismo().then(res => {
            debugger;
            console.log(res);
            console.log('ariellll');
            this.datasource = res.map(item => {
                return {
                    CompetidorId: item.CompetidorId,
                    Equipo: item.Equipo,
                    Representacion: item.Representacion,
                    Valor12: item.Valor12,
                    Punto12: (item.Activo === true) ? item.Punto12 : 1,
                    Valor13: item.Valor13,
                    Punto13: (item.Activo === true) ? item.Punto13 : 1,
                    Valor14: parseFloat(item.Valor14).toFixed(2),
                    Valor14c: item.Valor14,
                    Punto14: (item.Activo === true) ? item.Punto14 : 1,
                    Valor15: parseFloat(item.Valor15).toFixed(2),
                    Valor15c: item.Valor15,
                    Punto15: (item.Activo === true) ? item.Punto15 : 1,
                    Valor16: parseFloat(item.Valor16).toFixed(2),
                    Valor16c: item.Valor16,
                    Punto16: (item.Activo === true) ? item.Punto16 : 1,
                    Valor17: parseFloat(item.Valor17).toFixed(2),
                    Valor17c: item.Valor17,
                    Punto17: (item.Activo === true) ? item.Punto17 : 1,
                    Valor18: parseFloat(item.Valor18).toFixed(2),
                    Valor18c: item.Valor18,
                    Punto18: (item.Activo === true) ? item.Punto18 : 1,
                    Valor19: parseFloat(item.Valor19).toFixed(2),
                    Valor19c: item.Valor19,
                    Punto19: (item.Activo === true) ? item.Punto19 : 1,
                    Valor20: parseFloat(item.Valor20).toFixed(2),
                    Valor20c: item.Valor20,
                    Punto20: (item.Activo === true) ? item.Punto20 : 1,
                    Valor21: item.Valor21,
                    Punto21: (item.Activo === true) ? item.Punto21 : 1,
                    Valor22: item.Valor22,
                    Punto22: (item.Activo === true) ? item.Punto22 : 1,
                    Total: (item.Activo === true) ? item.Total : 'Eliminado',
                    posicion: (item.ParametroMedallaId === 1) ?
                        'Oro' : (item.ParametroMedallaId === 2) ? 'Plata' : (item.ParametroMedallaId === 3) ? 'Bronce' : '',
                    Activo: item.Activo
                };
            });
            console.log(this.datasource);
        });
    }
    private conectar() {
        this._connection = this._signalR.createConnection(this.o);
        this._connection.start().then((c) => {
            const listener = c.listenFor('setAtletismo');
            listener.subscribe((data) => {
                this.cargarData();
            });


            c.invoke('ControlMiniAtletismo', this.o.qs.name, this.o.qs.group).then(() => {
            });
        });
    }
}
