import { Component, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, Inject, forwardRef, OnInit } from '@angular/core';
import { StepsModule, MenuItem } from 'primeng/primeng';
import {FormularioAcreditacionComponent} from '../../Acreditacion/acreditacion-formulario/acreditacion-formulario.component';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'steps',
    templateUrl: './steps.component.html',
    styleUrls: ['./steps.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class StepsComponent implements OnInit {
    private items: MenuItem[];
    activeIndex = 0;
    @Input() titulo: string;
    @Input() listaPasos: string[];
    @Input() ultimoPaso: number;
    @Output() getPasoActual = new EventEmitter();
    @Output() getFinalizar = new EventEmitter();
    @Output() getChange = new EventEmitter();

    constructor (@Inject(forwardRef(() => FormularioAcreditacionComponent)) public acre: FormularioAcreditacionComponent) {}

    ngOnInit() {
        this.items = this.listaPasos.map(v => {
            return {
                label: v,
                command: (event: any) => {
                    if (event.index <= this.ultimoPaso) {
                        this.activeIndex = event.index;
                        this.getPasoActual.emit(this.activeIndex);
                    } else {
                        this.activeIndex = this.ultimoPaso;
                    }
                }
            };
        });
    }

    onChangeStep($event) {
        if ($event === 'next' && (this.activeIndex + 1) <= this.ultimoPaso) {
            this.activeIndex = this.activeIndex + 1;
            this.getChange.emit('next');
        } else if ($event === 'prev') {
            this.activeIndex = this.activeIndex - 1;
            this.getChange.emit('prev');
        } else if ($event === 'fin') {
            this.getChange.emit('fin');
            console.log("poner  Codigo");
        } else {
            this.getChange.emit('nextNegado');
        }
    }
}
