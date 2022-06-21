import { Component, OnInit } from '@angular/core';
import { Cronometro } from '../../../domain/widgets/cronometro.type';
import { Competidor } from '../../../domain/widgets/competidor.type';

import { InscripcionJugadoresComponent } from '../inscripcion-jugadores/inscripcion-jugadores.component';
import { SelectItem } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
    selector: 'app-cronometro-panel',
    templateUrl: './cronometro-panel.component.html',
    styleUrls: ['./cronometro-panel.component.css'],
    providers: [ConfirmationService]
})
export class CronometroPanelComponent implements OnInit {
    configuracion: Cronometro;
    equipo: Competidor;
    pausa: boolean;
    iniciar: boolean;
    parar: boolean;
    captura: boolean;
    sistemas: SelectItem[];
    color: number;
    eventoId = 1;
    deporteId = 4;
    accion = 0;
    primer: boolean;
    segundo: boolean;
    setTiempo: string;
    display = false;
    segundos: string;
    minutos: string;

    constructor(private confirmationService: ConfirmationService) {
        this.pausa = false;
        this.iniciar = false;
        this.parar = false;
        this.captura = false;

        this.configuracion = new Cronometro();

        this.configuracion.hora = 0;
        this.configuracion.minuto = 1;
        this.configuracion.segundo = 0;

        this.configuracion.horaTope = 0;
        this.configuracion.minutoTope = 0;
        this.configuracion.segundoTope = 0;
        this.color = 1;

        this.equipo = new Competidor();
        this.equipo.CompetidorId = 20;
        this.equipo.Equipo = 'La Paz A';
        this.sistemas = [];
        this.sistemas.push({ label: 'Seleccione un item', value: null });
        this.sistemas.push({ label: '4-4-2', value: { id: 1, name: '4-4-2' } });
        this.accion = 0;
    }

    ngOnInit() {
        this.iniciar = false;
    }
    pause() {

        this.accion = 3;
    }
    play() {

        this.accion = 1;
    }
    stop() {

        this.accion = 2;
    }
    capturar() {
        // this.accion=4;
        this.captura = !this.captura;
    }
    doCaptura($event) {
        console.log($event);
        this.accion = 0;
    }
    settiempo() {
        this.minutos = '0';
        this.segundos = '0';

        this.display = true;
    }
    IngresoTempo($event) {
        this.accion = 0; this.setTiempo = '';
    }
    loadTiempo($event) {
        this.accion = 5;
        this.setTiempo = $event;
        this.display = false;
    }
    salir() {
        this.display = false;
    }
}
