import { Component, OnInit } from '@angular/core';
import { Util } from '../../../view/Futbol/util';

@Component({
    selector: 'app-reloj',
    templateUrl: './reloj.component.html',
    styleUrls: ['./reloj.component.css']
})
export class RelojComponent implements OnInit {
    hora = '';
    utilidad: Util;
    timer: any;

    constructor() {
        this.utilidad = new Util();
    }

    ngOnInit() {
        this.sethora();
        this.initHora();
    }
    private sethora() {
        const time = new Date();
        this.hora = this.utilidad.lpad('0', 2, String(time.getHours())) + ':' + this.utilidad.lpad('0', 2, String(time.getMinutes()))
            + ':' + this.utilidad.lpad('0', 2, String(time.getSeconds()));
    }
    private initHora() {
        let c = 0;
        this.timer = setInterval(() => {
            c++;
            this.sethora();
            if (c === 60) {
                clearInterval(this.timer);
                this.initHora();
            }

        }, 1000);
    }

}
