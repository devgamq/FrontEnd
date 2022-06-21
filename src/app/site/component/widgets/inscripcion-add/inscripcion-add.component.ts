import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Competidor } from '../../../domain/widgets/competidor.type';
import { ToggleButtonModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { SelectItem, Message } from 'primeng/primeng';
import { Persona } from '../../../domain/shared/persona';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';


@Component({
    selector: 'app-inscripcion-add',
    templateUrl: './inscripcion-add.component.html',
    styleUrls: ['./inscripcion-add.component.css'],
    providers: [ConjuntoService]
})
export class InscripcionAddComponent implements OnInit {

    @Output() actualizar = new EventEmitter();
    @Output() cerrar = new EventEmitter();
    @Input() Competidor: Competidor;
    @Input() PlanillaId: number;
    @Input() deporteId: number;

    public busqueda: string;
    persona: Persona;
    es_capitan = false;
    es_titular = true;
    InscripcionForm: FormGroup;
    display = true;
    limpiarBuscador = false;
    msgs: Message[] = [];
    tieneCapitan = false;

    jugador_valid: any = false;
    numero_valid: any = false;
    posicion_valid: any = false;
    _Capitan: any;

    public posicionJuego: SelectItem[];
    public selectedPosition = '1';

    constructor(
        private formBuilder: FormBuilder,
        private conjuntoService: ConjuntoService) {

        this.posicionJuego = [];

        this.busqueda = 'SearchPersonaEquipo';
        this.persona = new Persona();
    }

    ngOnInit() {

        this.init_formulario();
        this.initCapitan();
    }
    init_formulario() {
        this.es_titular = true;
        this.limpiarBuscador = false;
        this.persona.NombreCompleto = '';
        this.InscripcionForm = this.formBuilder.group({
            PlanillaId: [''],
            PersonaId: ['', Validators.compose([Validators.required])],
            CompetidorId: [''],
            NumeroCamiseta: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
            Posicion: ['', Validators.compose([Validators.required])],
            ParametroRolId: [''],
            Capitan: ['']
        });
        this.conjuntoService.getPosicion(this.deporteId).then(res => {

            this.posicionJuego = res;


        });
    }
    doSelectSearchPersona($event) {
        this.persona.PersonaId = $event.PersonaId;
        this.persona.NombreCompleto = $event.NombreCompleto;
    }
    private initCapitan() {
        this.conjuntoService.GetCapitanPlanilla(this.Competidor.CompetidorId, this.PlanillaId)
            .then(res => {
                const data = res;

                if (res.length > 0) {
                    this._Capitan = data[0];

                }
            });
    }
    save() {
        const cap = this.InscripcionForm.controls['Capitan'].value;
        let candado = true;

        if (cap) {
            if (this._Capitan != null) {
                candado = false;

            }
        }
        // alert(candado)
        if (this.validar() && candado) {
            // this._Capitan==null

            this.InscripcionForm.controls['PlanillaId'].setValue(this.PlanillaId);
            this.InscripcionForm.controls['PersonaId'].setValue(this.persona.PersonaId);
            this.InscripcionForm.controls['CompetidorId'].setValue(this.Competidor.CompetidorId);
            this.InscripcionForm.controls['ParametroRolId'].setValue(this.es_titular === true ? 1 : 2);

            this.limpiarBuscador = !this.limpiarBuscador;

            this.conjuntoService.SavePlanillaPersona(this.InscripcionForm).subscribe(res => {
                const resp = res.json();

                if (resp === -1) {
                    this.showMessage('Ocurrio un error al agregar el jugador: ' + this.persona.NombreCompleto, 'danger', 'Error');

                } else {

                    this.showMessage('Se ha agregado al jugador: ' + this.persona.NombreCompleto, 'info', 'Mensaje');
                    this.init_formulario();

                    this.actualizar.emit();
                }
            });

        } else {
            if (!candado) { this.showMessage('Ocurrio un error al agregar al capitan: ' + this.persona.NombreCompleto, 'danger', 'Error'); }
        }

    }
    salir() {
        this.cerrar.emit(this.display);
    }
    showMessage(mensaje, color, titulo) {

        this.msgs = [];
        this.msgs.push({ severity: color, summary: titulo, detail: mensaje });
    }
    validar() {
        this.InscripcionForm.controls['PersonaId'].setValue(this.persona.PersonaId === 0 ? '' : this.persona.PersonaId);

        this.jugador_valid = !this.InscripcionForm.controls['PersonaId'].valid;
        this.numero_valid = !this.InscripcionForm.controls['NumeroCamiseta'].valid;
        this.posicion_valid = !this.InscripcionForm.controls['Posicion'].valid;
        if (!this.jugador_valid && !this.numero_valid && !this.posicion_valid) {
            return true;
        } else {
            return false;
        }
    }


}
