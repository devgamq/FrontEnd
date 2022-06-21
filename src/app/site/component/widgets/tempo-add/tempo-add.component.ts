import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { InputMaskModule } from 'primeng/primeng';
import { SimpleService } from '../../../service/simple/simple.service';
import { Atletismo } from '../../../domain/deportes/single/atletismo';
import { InputTextModule } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';


@Component({
    selector: 'app-tempo-add',
    templateUrl: './tempo-add.component.html',
    styleUrls: ['./tempo-add.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [SimpleService]
})
export class TempoAddComponent implements OnInit {
    @Input() row: any;
    @Input() index: number;
    @Input() is_time: boolean;
    @Input() valor: any;

    @Output() actualizar = new EventEmitter();
    @Output() salir = new EventEmitter();

    @Input() mask: string;
    datos: Atletismo;
    _valid: any = true;
    _es_numero: any = true;
    _v_tiempo: any = true;
    DataForm: FormGroup;

    constructor(private simpleService: SimpleService, private formBuilder: FormBuilder) {
        this.datos = new Atletismo();
    }

    ngOnInit() {
        this.DataForm = this.formBuilder.group({
            aux: ['', Validators.compose([Validators.pattern('^[0-2][0-9]:[0-5][0-9]:[0-5][0-9].[0-9][0-9]$')])]
        });
    }
    validar() {
        if (this.valor !== '') {
            this._valid = true;
            if (!this.is_time) {
                this._es_numero = Number(this.valor) > 0;
                this._v_tiempo = true;
            } else {
                this._es_numero = true;
                this._v_tiempo = this.DataForm.controls['aux'].valid;

            }

        } else {
            this._valid = false;
        }


        return this._valid && this._es_numero && this._v_tiempo;
    }
    onExit() {
        this._valid = true;
        this._es_numero = true;
        this._v_tiempo = true;
        this.valor = '';
        this.salir.emit();
    }
    onEditComplete() {
        if (this.validar()) {
            this.datos.CompetidorId = this.row.CompetidorId;
            this.datos.PruebaEventoId = 34;
            this.datos.PruebaEventoIdCalcular = this.index;
            this.datos.Marca = this.is_time ? 0 : this.valor;
            this.datos.Tiempo = this.is_time ? this.valor : null;

            this.simpleService.SavePlanilla(this.datos).subscribe(res => {
                if (res.ok) {
                    this.actualizar.emit(true);
                } else {
                    this.actualizar.emit(false);
                }
            });
        }
    }
    onEditCompletePres($event) {
        if ($event.charCode === 13) {
            this.onEditComplete();
        }
    }
}
