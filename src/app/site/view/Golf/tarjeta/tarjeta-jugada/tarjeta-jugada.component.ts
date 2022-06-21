import { Component, Input, OnInit, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ButtonModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { GolfTarjeta } from '../../../../domain/Golf/tarjeta';
import { TarjetaService } from '../../../../service/Golf/tarjeta.service';
import { Parametro } from '../../../../domain/Shared/parametro';
import 'rxjs/Rx';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tarjeta-jugada',
    templateUrl: './tarjeta-jugada.component.html',
    styleUrls: ['./tarjeta-jugada.component.css']
})

// tslint:disable-next-line:component-class-suffix
export class TarjetaJugada implements OnInit {
    @Input() tarjeta: GolfTarjeta;
    @Input() nombreJugador: string;
    @Output() changeJugador = new EventEmitter();
    @Output() saveJugada = new EventEmitter();
    @Output() anclarJugador = new EventEmitter();
    tipoTiros: Parametro[];
    checkedAnclar = false;
    constructor(private tarjetaService: TarjetaService) {
    }


    ngOnInit() {
        this.tarjetaService.getTipoTiros()
            .then(res => this.tipoTiros = res);
    }

    onclickAdicionar() {
        this.tarjeta.Golpes = this.tarjeta.Golpes + 1;
        this.tarjeta.changeDescripcionTiro(this.tipoTiros);
    }

    onclickRestar() {
        if (this.tarjeta.Golpes - 1 >= 0) {
            this.tarjeta.Golpes = this.tarjeta.Golpes - 1;
            this.tarjeta.changeDescripcionTiro(this.tipoTiros);
        }
    }

    onChangeJugador($event) {
        this.changeJugador.emit($event);
    }

    onclickSaveJugada() {
        this.saveJugada.emit(this.tarjeta);
    }

    onAnclar() {
        this.anclarJugador.emit(this.checkedAnclar);
    }
}
