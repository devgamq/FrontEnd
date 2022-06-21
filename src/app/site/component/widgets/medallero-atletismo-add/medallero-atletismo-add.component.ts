import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { SimpleService } from '../../../service/simple/simple.service';
import { InputTextModule } from 'primeng/primeng';
import { SelectItem, Message } from 'primeng/primeng';
import { Atletismo } from '../../../domain/deportes/single/atletismo';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import { JasperService } from '../../../service/Conjunto/jasper.service';
import * as urls from '../../../domain/Shared/global';

@Component({
    selector: 'app-medallero-atletismo-add',
    templateUrl: './medallero-atletismo-add.component.html',
    styleUrls: ['./medallero-atletismo-add.component.css'],
    providers: [SimpleService, ConfirmationService, JasperService],
    encapsulation: ViewEncapsulation.None
})
export class MedalleroAtletismoAddComponent implements OnInit {
    private _connection: SignalRConnection;
    datasource: any;
    datos: Atletismo;
    msgs: Message[] = [];
    @Input() posicion_hidden = true;
    styleColum: any;
    styleEdit: any;
    styleTotal: any;
    display: boolean;
    mask: string;
    row: any;
    index: number;
    is_time: boolean;
    valor: string;
    titulo: string;

    o: IConnectionOptions = {
        hubName: 'HammerHub',
        qs: { name: 'control', group: 'miniatletismo' },
        url: urls.urlSockets
    };
    constructor(private simpleService: SimpleService,
        private _signalR: SignalR,
        private confirmationService: ConfirmationService,
        private jasperService: JasperService,) {
        this.datos = new Atletismo();
        this.styleColum = { 'background-color': '#FFFACD', width: '1%' };
        this.styleEdit = { cursor: 'pointer', width: '6%', border: 'orange 2px solid', 'background-color': '#FFF' };
        this.styleTotal = { 'font-weight': 'bold', 'text-align': 'center', 'font-size': '27px' };
    }

    ngOnInit() {
        this.cargarData();
        this.conectar();
    }
    private conectar() {
        this._connection = this._signalR.createConnection(this.o);
        this._connection.start().then((c) => {
            const listener = c.listenFor('ControlMiniAtletismo');
            listener.subscribe();
            c.invoke('ControlMiniAtletismo', this.o.qs.name, this.o.qs.group).then(() => { });
        });
    }
    private cargarData() {
        this.simpleService.GetPlanillaAtletismo().then(res => {

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
                    posicion: '',
                    Activo: item.Activo,
                    css: (item.Activo === true) ? 'activo' : 'eliminado'
                };
            });



        });
    }
    showMessage(mensaje, color, titulo) {

        this.msgs = [];
        this.msgs.push({ severity: color, summary: titulo, detail: mensaje });
    }
    onEditComplete(row, index, is_time, valor) {
        this.datos.CompetidorId = row.CompetidorId;
        this.datos.PruebaEventoId = 34;
        this.datos.PruebaEventoIdCalcular = index;
        this.datos.Marca = is_time ? 0 : valor;
        this.datos.Tiempo = is_time ? valor : null;

        this.simpleService.SavePlanilla(this.datos).subscribe(res => {
            if (res.ok) {
                this.cargarData();
                this.showMessage('Se ha editado los datos del equipo: ' + row.Equipo, 'info', 'Mensaje');
            } else {
                this.showMessage('Ha ocurrido un error al registrar los datos del equipo: ' + row.Equipo, 'danger', 'Error');
            }
        });
    }
    onRowDblclick(row) {
        this.confirmationService.confirm({
            message: 'Desea Descalificar al equipo: <b>' + row.Equipo + '</b>',
            accept: () => {
                const data = { CompetidorId: row.CompetidorId, estado: 0 };
                this.simpleService.UpdateEstado(data).subscribe(res => { this.recargar(row); });

            }
        });
    }
    recargar($event) {
        if ($event) {
            this.cargarData();
            this.reset(null, 0, false, 0, 0);
            this.display = false;
            this._connection.invoke('sendAtletismo', this.o.qs.group, true);
        }
    }
    private reset(row, index, is_time, valor, competencia) {
        this.row = row;
        this.index = index;
        this.is_time = is_time;
        this.valor = valor;
        this.titulo = competencia;
        this.mask = is_time ? '99:99:99.?99' : '99.?99';
    }
    onclick(row, index, is_time, valor, competencia) {
        this.reset(row, index, is_time, valor, competencia);
        this.display = true;
    }
    cerrarDialogo() {
        this.reset(null, 0, false, 0, 0);
        this.display = false;
    }
    tablaMini() {
        this.jasperService.getMiniAtletismo(8).then(
            res => {
                window.open(URL.createObjectURL(res));
            }
        );
    }
}
