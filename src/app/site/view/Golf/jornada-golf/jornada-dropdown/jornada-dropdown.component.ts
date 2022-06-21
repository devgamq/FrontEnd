import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { ActivatedRoute } from '@angular/router';
import { JornadaService } from '../../../../service/Golf/jornada.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'jornada-dropdown',
    templateUrl: './jornada-dropdown.component.html',
    providers: [JornadaService]
})
// tslint:disable-next-line:component-class-suffix
export class JornadaDropDown implements OnInit {
    jornadas: SelectItem[];
    @Input() eventoId: number;
    @Output() jornadaSelected = new EventEmitter();
    constructor(private jornadaService: JornadaService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.doGetJornadas();
    }

    doGetJornadas() {
        this.jornadaService
            .getJornadasList(this.eventoId)
            .then(res => {
                this.jornadas = res.map(item => {
                    return {
                        label: item.Descripcion, value: item.JornadaId
                    };
                });
                // tslint:disable-next-line:max-line-length
                this.jornadaSelected.emit({ jornadaId: this.jornadas.length > 0 ? this.jornadas[0].value : 0, descripcion: this.jornadas[0].label });
            });
    }

    onChangeJornada($event) {
        this.jornadaSelected.emit({ jornadaId: $event.value, descripcion: $event.originalEvent.currentTarget.innerText });
    }
}
