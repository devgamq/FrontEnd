import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BreadcrumbModule, MenuItem } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import 'rxjs/Rx';
import { GruposService } from '../../../../service/Golf/grupos.service';
import { TarjetaService } from '../../../../service/Golf/tarjeta.service';
import { GolfGrupos } from '../../../../domain/Golf/grupos';
import { GolfTarjeta } from '../../../../domain/Golf/tarjeta';
import { TarjetaJugada } from '../tarjeta-jugada/tarjeta-jugada.component';
import { Parametro } from '../../../../domain/Shared/parametro';
import { SocketService } from '../../../../service/Shared/socket.service';

import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../../domain/Shared/global';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tarjeta-detalle',
    templateUrl: './tarjeta-detalle.component.html',
    providers: [GruposService, TarjetaService, ConfirmationService, SocketService],
    styleUrls: ['./tarjeta-detalle.component.css']
})

// tslint:disable-next-line:component-class-suffix
export class DetalleTarjeta implements OnInit {
    grupoId: number;
    eventoId: number;
    jugadores: any[];
    tarjeta: any[];
    totales: any[];
    crumb: MenuItem[];
    mostrarTarjeta = false;
    numeroJugadorSeleccionado = 0;
    jugadorSeleccionado: any;
    tarjetaSeleccionada: GolfTarjeta = new GolfTarjeta();
    nombreTarjeta = '';
    filaSeleccionada: any;
    jugadas: any;
    tipoTiros: Parametro[];
    mensaje: Message[] = [];
    estado = false;
    columnasTotales: any[];
    connection;
    hora: string;
    vButton = false;

    mostrarResetear = false;
    selectedJugadoresResetear: string[] = [];
    anclarJugador = false;

    /*sockets */
  private _connection: SignalRConnection;
    o: IConnectionOptions = {
        hubName: 'HammerHub',
        qs: { name: 'usuario:visor', group: 'golf'},
        url: urls.urlSockets
      };

    constructor(private grupoService: GruposService,
        private tarjetaService: TarjetaService,
        private activedRoute: ActivatedRoute,
        private confirmationService: ConfirmationService,
        private socket: SocketService,
        private _signalR: SignalR) {
        this.grupoId = +this.activedRoute.snapshot.params['grupoId'];
        this.eventoId = +this.activedRoute.snapshot.params['eventoId'];
        this.hora = this.activedRoute.snapshot.params['hora'];
    }

    ngOnInit() {
        this.doLoadJugadores();
        this.doLoadCrumb();
        this.conectar();
        //this.connection = this.socket.handleClasificatorio().subscribe();
    }
    /*sockets */
  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then((c) => {
      const listener = c.listenFor('controlGolfVisor');
      listener.subscribe((data) => {
      });
    });
  }
    sendMessage() {
        this._connection.invoke('actualizarGridDatos', 'all', 'actualizar', 'golf');
        //this.socket.onClasificatorio();
    }
    doLoadCrumb() {
        this.crumb = [];
        this.crumb.push({ label: 'Golf' });
        this.crumb.push({ label: 'Listado Tarjetas', routerLink: ['/master/tarjeta', this.eventoId] });
        this.crumb.push({ label: 'Detalle Tarjeta' });
    }
    doLoadJugadores() {
        this.grupoService
            .getGolfJugadores(this.grupoId)
            .then(res => {
                this.jugadores = res;
                this.doLoadTarjeta();
            });
        this.tarjetaService.getTipoTiros()
            .then(res => this.tipoTiros = res);
    }

    doLoadTarjeta() {
        this.estado = this.jugadores[0].Estado === 0;
        const competidorJornadaId1 = this.jugadores.length > 0 ? this.jugadores[0].CompetidorJornadaId : 0;
        const competidorJornadaId2 = this.jugadores.length > 1 ? this.jugadores[1].CompetidorJornadaId : 0;
        const competidorJornadaId3 = this.jugadores.length > 2 ? this.jugadores[2].CompetidorJornadaId : 0;
        const competidorJornadaId4 = this.jugadores.length > 3 ? this.jugadores[3].CompetidorJornadaId : 0;
        this.columnasTotales = [];

        if (competidorJornadaId1 > 0) {
            this.columnasTotales.push({ campo: 'uno' });
        }
        if (competidorJornadaId2 > 0) {
            this.columnasTotales.push({ campo: 'dos' });
        }
        if (competidorJornadaId3 > 0) {
            this.columnasTotales.push({ campo: 'tres' });
        }
        if (competidorJornadaId4 > 0) {
            this.columnasTotales.push({ campo: 'cuatro' });
        }
        this.tarjetaService
            .getTarjeta(competidorJornadaId1, competidorJornadaId2, competidorJornadaId3, competidorJornadaId4)
            .subscribe(res => {
                this.tarjeta = res;
            });
        if (this.estado) {
            this.tarjetaService
                .getTotales(this.grupoId)
                .subscribe(res => {
                    this.totales = res;
                });
        }
    }

    onRowDblclickTarjeta($event) {
        if ($event.data.Hoyo > 0 && !this.estado) {
            this.filaSeleccionada = $event.data;
            this.seleccionarJugador('true');
        }
    }

    jugadaAnclada() {
        const actual = this.filaSeleccionada;
        const siguiente = this.tarjeta.filter(x => x.Hoyo === (actual.Hoyo + 1));
        if (siguiente.length > 0) {
            this.filaSeleccionada = siguiente[0];
            this.seleccionarJugador('mismo');
        } else {
            this.mostrarTarjeta = false;
        }
    }

    seleccionarJugador(esNuevo) {
        this.tarjetaSeleccionada = new GolfTarjeta();
        this.tarjetaSeleccionada.Hoyo = this.filaSeleccionada.Hoyo;
        this.tarjetaSeleccionada.HoyoParId = this.filaSeleccionada.HoyoParId;
        this.tarjetaSeleccionada.Par = this.filaSeleccionada.Par;
        if (esNuevo === 'true') {
            if (this.filaSeleccionada.GolpesJ1 === 0) {
                this.numeroJugadorSeleccionado = 0;
                this.jugadorSeleccionado = this.jugadores[this.numeroJugadorSeleccionado];
            } else if (this.filaSeleccionada.GolpesJ2 === 0 && this.jugadores.length > 1) {
                this.numeroJugadorSeleccionado = 1;
                this.jugadorSeleccionado = this.jugadores[this.numeroJugadorSeleccionado];
            } else if (this.filaSeleccionada.GolpesJ3 === 0 && this.jugadores.length > 2) {
                this.numeroJugadorSeleccionado = 2;
                this.jugadorSeleccionado = this.jugadores[this.numeroJugadorSeleccionado];
            } else if (this.filaSeleccionada.GolpesJ4 === 0 && this.jugadores.length > 3) {
                this.numeroJugadorSeleccionado = 3;
                this.jugadorSeleccionado = this.jugadores[this.numeroJugadorSeleccionado];
            } else {
                this.numeroJugadorSeleccionado = 0;
                this.tarjetaSeleccionada.Golpes = this.filaSeleccionada.GolpesJ1;
                this.jugadorSeleccionado = this.jugadores[this.numeroJugadorSeleccionado];
            }
        } else {
            if (esNuevo === 'next') {
                // tslint:disable-next-line:max-line-length
                this.numeroJugadorSeleccionado = this.numeroJugadorSeleccionado + 1 >= this.jugadores.length ? 0 : this.numeroJugadorSeleccionado + 1;
                this.jugadorSeleccionado = this.jugadores[this.numeroJugadorSeleccionado];
            }
            if (esNuevo === 'prev') {
                // tslint:disable-next-line:max-line-length
                this.numeroJugadorSeleccionado = this.numeroJugadorSeleccionado - 1 < 0 ? this.jugadores.length - 1 : this.numeroJugadorSeleccionado - 1;
                this.jugadorSeleccionado = this.jugadores[this.numeroJugadorSeleccionado];
            }
            if (esNuevo === 'mismo') {
                this.jugadorSeleccionado = this.jugadores[this.numeroJugadorSeleccionado];
            }
        }
        switch (this.numeroJugadorSeleccionado) {
            case 0:
                this.tarjetaSeleccionada.JugadasId = this.filaSeleccionada.JugadasIdJ1;
                // tslint:disable-next-line:max-line-length
                this.tarjetaSeleccionada.Golpes = this.filaSeleccionada.GolpesJ1 === 0 ? this.tarjetaSeleccionada.Par : this.filaSeleccionada.GolpesJ1;
                break;
            case 1:
                this.tarjetaSeleccionada.JugadasId = this.filaSeleccionada.JugadasIdJ2;
                // tslint:disable-next-line:max-line-length
                this.tarjetaSeleccionada.Golpes = this.filaSeleccionada.GolpesJ2 === 0 ? this.tarjetaSeleccionada.Par : this.filaSeleccionada.GolpesJ2;
                break;
            case 2:
                this.tarjetaSeleccionada.JugadasId = this.filaSeleccionada.JugadasIdJ3;
                // tslint:disable-next-line:max-line-length
                this.tarjetaSeleccionada.Golpes = this.filaSeleccionada.GolpesJ3 === 0 ? this.tarjetaSeleccionada.Par : this.filaSeleccionada.GolpesJ3;
                break;
            case 3:
                this.tarjetaSeleccionada.JugadasId = this.filaSeleccionada.JugadasIdJ4;
                // tslint:disable-next-line:max-line-length
                this.tarjetaSeleccionada.Golpes = this.filaSeleccionada.GolpesJ4 === 0 ? this.tarjetaSeleccionada.Par : this.filaSeleccionada.GolpesJ4;
                break;
        }
        this.tarjetaSeleccionada.CompetidorJornadaId = this.jugadorSeleccionado.CompetidorJornadaId;
        this.tarjetaSeleccionada.changeDescripcionTiro(this.tipoTiros);
        this.nombreTarjeta = this.jugadorSeleccionado.Nombre;
        this.mostrarTarjeta = true;
    }

    onChangeJugador(cambio: string) {
        this.seleccionarJugador(cambio);
    }

    onSaveJugada($event) {
        this.tarjetaService.setJugada($event).subscribe(res => {
            const resp = res.json();
            this.mensaje = [];
            if (resp === true) {
                this.doLoadTarjeta();
                this.sendMessage();
                this.mostrarTarjeta = false;
                this.mensaje.push({ severity: 'success', summary: 'Exito', detail: 'Se agrego correctamente el registro' });
            } else {
                this.mensaje.push({ severity: 'info', summary: 'Error', detail: 'Ocurrio un error al guardar el registro' });
            }
            if (this.anclarJugador) {
                this.jugadaAnclada();
            } else {
                this.mostrarTarjeta = false;
            }
        });
    }

    rowStyle(rowData: any, rowIndex: number): string {
        return rowData.Hoyo === 0 ? 'subtotales' : '';
    }

    onTerminarJuego() {
        this.confirmationService.confirm({
            message: '¿Desea cerrar la tarjeta?',
            accept: () => {
                try {
                    for (let index = 0; index < this.jugadores.length; index++) {
                        this.tarjetaService.setTerminarJuego(this.jugadores[index].CompetidorJornadaId).subscribe(res => {
                            const resp = res.json();
                            if (resp === true) {
                            }
                        });
                    }
                    this.estado = true;
                    this.tarjetaService
                        .getTotales(this.grupoId)
                        .subscribe(res => {
                            this.totales = res;
                            this.sendMessage();
                        });
                    this.mensaje = [];
                    this.mensaje.push({ severity: 'success', summary: 'Confirmación', detail: 'Se cerro correctamente la tarjeta' });
                } catch (e) {
                    this.mensaje.push({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar el registro' });
                }
            }
        });
    }

    onMostrarResetear() {
        this.mostrarResetear = true;
    }

    onResetearTarjeta() {
        for (let index = 0; index < this.selectedJugadoresResetear.length; index++) {
            this.tarjetaService.setResetearTarjeta(parseInt(this.selectedJugadoresResetear[index], 10)).subscribe(res => {
                const resp = res.json();
                if (resp === true) {
                    this.doLoadTarjeta();
                }
            });
        }
        this.mensaje.push({ severity: 'success', summary: 'Confirmación', detail: 'Se reseteo correctamente la tarjeta' });
        this.mostrarResetear = false;
    }

    onAnclarJugador($event) {
        this.anclarJugador = $event;
    }

    setPar() {
        if (this.jugadas.Hoyo > 0 && !this.estado) {
            this.filaSeleccionada = this.jugadas;
            this.seleccionarJugador('true');
        }
    }
    onRowSelect($event, estado) {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/iPad|iPhone|iPod/.test(userAgent) && !estado) {
            this.vButton = true;
        } else {
            this.vButton = false;
        }
    }
    onRowUnselect($event) {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            this.vButton = false;
        }
    }
}
