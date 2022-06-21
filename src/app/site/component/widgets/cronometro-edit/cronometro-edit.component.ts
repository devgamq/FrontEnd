import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';

@Component({
    selector: 'app-cronometro-edit',
    templateUrl: './cronometro-edit.component.html',
    styleUrls: ['./cronometro-edit.component.css']
})
export class CronometroEditComponent implements OnInit {
    hora: string;
    minutos: number;
    segundos: number;
    display = true;
    reversa = false;

    @Output() HoraCapturada = new EventEmitter();
    @Output() seleccionarReversa = new EventEmitter();
    @Output() cerrar = new EventEmitter();

    constructor() {
        this.hora = '00:00';
        this.minutos = 0;
        this.segundos = 0;
    }

    ngOnInit() {
    }
    save() {
        this.hora = this.lpad('0', 2, String(this.minutos)) + ':' + this.lpad('0', 2, String(this.segundos));
        this.HoraCapturada.emit(this.hora);
    }
    reversaSave() {
        this.seleccionarReversa.emit(this.reversa);
    }
    salir() {
        this.cerrar.emit(this.display);
    }
    private lpad(caracter: string, length: number, texto: string) {
        while (texto.length < length) { texto = caracter + texto; }
        return texto;
    }

}
