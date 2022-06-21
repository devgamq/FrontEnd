import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { StepsModule, MenuItem } from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { StepsComponent } from '../../components/steps/steps.component';
import { AcreditacionDatosPersonalesComponent } from '../acreditacion-datos-personales/acreditacion-datos-personales.component';
import { AcreditacionPersonaService } from '../../../service/Acreditacion/acreditacion-persona.service';
import { DetallePersonaAcreditacionComponent } from '../detalle-persona-acreditacion/detalle-persona-acreditacion.component';
import { InscripcionEvento } from '../../../domain/Acreditacion/Inscripcion-Evento';
import { PruebaEvento } from 'app/site/domain/acreditacion/prueba-evento';

import { Inscrito } from '../../../domain/Conjunto/Inscrito';
import { Persona } from 'app/site/domain/shared/persona';
import { Competidor } from 'app/site/domain/shared/competidor';
import { Rol } from '../../../domain/Acreditacion/rol';
import { Grupo } from '../../../domain/Acreditacion/grupo';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Sexo } from 'app/site/domain/Acreditacion/sexo';
import { Delegacion } from 'app/site/domain/Acreditacion/delegacion';
import { THIS_EXPR } from '@angular/compiler/typings/src/output/output_ast';
import { GrowlModule, Message } from 'primeng/primeng';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'acreditacion-formulario',
    templateUrl: './acreditacion-formulario.component.html',
    styleUrls: ['./acreditacion-formulario.component.css'],
    providers: [AcreditacionPersonaService],
    encapsulation: ViewEncapsulation.None
})
export class FormularioAcreditacionComponent implements OnInit, OnDestroy {
    private items: MenuItem[];
    eventoId: number;
    listaPasos: string[];
    pasoActual: number;
    ultimoPaso: number;
    //    DatosPesona: string[];
    DatosPesona: Persona; // = new Persona();
    Dato: Inscrito;
    // PrivilegiosIds: any[];
    Rol: Rol;
    Grupo: Grupo;
    Dele: Delegacion;
    PhotoBase64: string;
    s:string;
    activeIndex = 0;
    tipoPaso: string;
    bandera = 1;
    deporteId: number = -1;
    tipoPruebaId: number = -1;
    pruebaId: number = -1;
    ramaId: number = -1;
    clearData = false;
    banderaStep2 = false;
    clearDataStep2 = false;
    banderaStep3 = false;
    clearDataStep3 = false;
    validateDeporte = false;
    validateTipoPrueba = false;
    validatePrueba = false;
    validateRama = false;

    banderaTipo = false;
    clearDataTipo = false;
    banderaPrueba = false;
    clearDataPrueba = false;
    banderaSexo = false;
    clearDataSexo = false;
    msg: Message[] = [];
    constructor(private AcrePerso: AcreditacionPersonaService, private router: Router, private route: ActivatedRoute) {

    }
    ngOnDestroy() {
        localStorage.clear();


    }
    ngOnInit() {
        this.eventoId = this.route.snapshot.params['eventoId'];
        this.pasoActual = 0;
        this.ultimoPaso = 0;
        this.listaPasos = ['Deporte', 'Tipo de Prueba', 'Prueba', 'Rama', 'Datos Personales', 'Detalles', 'Fotografía'];

        // this.listaPasos = ["Datos Personales", "Detalles", "Fotografia"];
        this.items = this.listaPasos.map(v => {
            return {
                label: v,
                command: (event: any) => {
                    if (event.index <= this.ultimoPaso) {
                        this.activeIndex = event.index;
                        this.pasoActual = this.activeIndex;
                    } else {
                        this.activeIndex = this.ultimoPaso;
                    }
                }
            };
        });
    }

    onPasoActual($event) {
        this.pasoActual = $event;
    }

    onChange($event) {
        switch (this.pasoActual) {
            case 0:
                if ($event === 'next') {
                    this.validateDeporte = true;
                }
                break;
            case 1:

                if ($event === 'next') {
                    this.validateTipoPrueba = true;
                } else if ($event === 'prev') {
                    this.onChangeStep($event);
                    localStorage.setItem('tipoPruebaId', null);
                    this.validateDeporte = false;
                }
                break;
            case 2:

                if ($event === 'next') {
                    this.validatePrueba = true;
                } else if ($event === 'prev') {
                    this.onChangeStep($event);
                    localStorage.setItem('pruebaId', null);
                    this.validateTipoPrueba = false;
                    this.validatePrueba = false;
                }
                break;
            case 3:
                if ($event === 'next') {
                    this.validateRama = true;
                    // this.banderaSexo = true;
                } else if ($event === 'prev') {
                    this.onChangeStep($event);
                    localStorage.setItem('ramaId', null);
                    this.validatePrueba = false;
                    this.validateRama = false;
                    // this.banderaPrueba = false;
                    // this.clearDataPrueba = true;
                }
                break;
            case 4:
                // tslint:disable-next-line:no-debugger
              
                if ($event === 'next') {
                    this.bandera = 2;
                } else if ($event === 'prev') {
                    this.onChangeStep($event);
                    this.banderaSexo = false;
                    this.clearDataSexo = true;
                }
                break;
            case 5:
                if ($event === 'next') {
                    this.banderaStep2 = true;
                } else if ($event === 'prev') {
                    this.onChangeStep($event);
                    this.bandera = 1;
                    this.clearData = true;
                }
                break;
            case 6:
                if ($event === 'fin') {
                    this.banderaStep3 = true;
                    this.onSaveData();
                    console.log('PEro entro aqui');
                } else if ($event === 'prev') {
                    this.onChangeStep($event);
                    this.banderaStep2 = false;
                    this.clearDataStep2 = true;
                }
                break;
        }
        this.tipoPaso = $event;
    }

    onSucsespersona($even) {
        if ($even) {
            this.DatosPesona = $even;
            this.ultimoPaso++;
            this.onChangeStep(this.tipoPaso);
        } else {
            this.pasoActual = 0;
        }
    }
    onChangeStep($event) {
        if ($event === 'next' && (this.activeIndex + 1) <= this.ultimoPaso) {
            this.activeIndex = this.activeIndex + 1;
            this.pasoActual = this.activeIndex;
        } else if ($event === 'prev') {
            this.activeIndex = this.activeIndex - 1;
            this.pasoActual = this.activeIndex;
        } else if ($event === 'fin') {
            // this.getChange.emit("fin");
        } else {
            // this.getChange.emit("nextNegado");
        }
    }
    handleRestore($event) {
        this.bandera = $event;
    }

    HandleRol($event) {
        if ($event) {
            this.Rol = $event;
            this.ultimoPaso++;
            this.onChangeStep(this.tipoPaso);
        } else {
            this.pasoActual = 1;
        }
    }
    HandleGrupo($event) {
        this.Grupo = $event;
    }
    HandleDele($event) {
        this.Dele = $event;
    }
    handleBase64($event) {
        if ($event) {
            this.PhotoBase64 = $event;
           
        }
    }

    onSaveData() {
        // tslint:disable-next-line:no-unused-expression
        !this.DatosPesona.InscripcionEvento ? this.DatosPesona.InscripcionEvento = new InscripcionEvento() : '';

        // tslint:disable-next-line:no-unused-expression
        !this.DatosPesona.InscripcionEvento.Competidor ? this.DatosPesona.InscripcionEvento.Competidor = new Competidor() : '';
        if (!this.DatosPesona.InscripcionEvento.PruebaEvento) {
            const prueba: PruebaEvento = new PruebaEvento();
            this.DatosPesona.InscripcionEvento.PruebaEvento = prueba;
        }

        this.DatosPesona.InscripcionEvento.RolId = this.Rol.RolId;
        this.DatosPesona.InscripcionEvento.DeporteId = this.deporteId;
        this.DatosPesona.InscripcionEvento.PruebaId = this.pruebaId;
        this.DatosPesona.InscripcionEvento.ParametroRamaId = this.ramaId;
        this.DatosPesona.InscripcionEvento.PruebaEvento.EsIndividual = this.tipoPruebaId === 1 ? true : false;
        this.DatosPesona.InscripcionEvento.EventoId = this.eventoId;
        this.DatosPesona.photo = this.PhotoBase64;
        // Datos Faltantes
        this.DatosPesona.InscripcionEvento.DelegacionId = 1033;
        this.DatosPesona.InscripcionEvento.RepresentacionId = 90;
        this.DatosPesona.InscripcionEvento.Grado = 'kinder';
        this.DatosPesona.InscripcionEvento.Talla = 's';
        this.DatosPesona.InscripcionEvento.Peso = 0;
        this.DatosPesona.InscripcionEvento.Estatura = 0;
        this.DatosPesona.InscripcionEvento.Edad = 10;
        this.DatosPesona.InscripcionEvento.Codigo = '';
        this.DatosPesona.InscripcionEvento.Competidor.EquipoId = 2473;
        this.DatosPesona.InscripcionEvento.Competidor.Posicion = 'central';
        this.DatosPesona.InscripcionEvento.Competidor.MarcaTiempoInicial = '00:50';
        this.DatosPesona.InscripcionEvento.DelegacionId=1;
        console.log('aqui estan los datos persona  ',this.DatosPesona);
        console.log('aqui estan los datos Evento',this.DatosPesona.InscripcionEvento);
        console.log('aqui estan los datos Equipo',this.DatosPesona.InscripcionEvento.Competidor);

        //aqui cambiar boton finalizar para edson
        this.s= (this.DatosPesona.FechaNacimiento).toDateString();

       //this.Dato=
    let s:string;
        s=this.DatosPesona.FechaNacimiento.getDate().toString()+"-"+(this.DatosPesona.FechaNacimiento.getMonth()+1).toString()+"-"+this.DatosPesona.FechaNacimiento.getUTCFullYear().toString();
       var data= 
       {
           // PersonaId: 0,
            "Nombres": this.DatosPesona.Nombres,
            "Paterno": this.DatosPesona.Paterno,
            "Materno": this.DatosPesona.Materno,
            "FechaNacimiento": s,//this.DatosPesona.FechaNacimiento.,
            "Sexo":   this.DatosPesona.Sexo,
            "DocumentoIdentidad": this.DatosPesona.CI,
            "ParametroTipoSangreID": this.DatosPesona.ParametroTipoSangreId,
            "EventoId": this.eventoId,
            "DelegacionId": this.Dele.DelegacionId, //this.DatosPesona.InscripcionEvento.DelegacionId,
            "RepresetacionId": 13, //this.DatosPesona.InscripcionEvento.RepresentacionId,
            "RolId": this.Rol.RolId,
            "Grado":this.DatosPesona.InscripcionEvento.Grado,
            "Talla": "S Small",//this.DatosPesona.InscripcionEvento.Talla,
            "Peso": this.DatosPesona.InscripcionEvento.Peso,
            "Estatura": this.DatosPesona.InscripcionEvento.Estatura,
            "Edad":this.DatosPesona.InscripcionEvento.Edad,
            "Codigo": this.DatosPesona.InscripcionEvento.Codigo,
            "DeporteId":23,//this.DatosPesona.InscripcionEvento.DeporteId,
            "PruebaId":3,//this.DatosPesona.InscripcionEvento.PruebaId,
            "ParametroRamaId": 2,// this.DatosPesona.InscripcionEvento.ParametroRamaId,
            "EsIndividual": true,
            "EquipoId":25,//this.DatosPesona.InscripcionEvento.Competidor.EquipoId,
            "Posicion":this.DatosPesona.InscripcionEvento.Competidor.Posicion,
            "MarcaTiempoIncial":this.DatosPesona.InscripcionEvento.Competidor.MarcaTiempoInicial,
            "FotoUrl": this.DatosPesona.photo
        }
        console.log('este parametro se envio :',data);
        this.AcrePerso.setAcrePersonaInscrita(data).subscribe(res => {
        const resp = res.json();
           console.log(res,'guardardo change boton ', resp);
           
           this.msg = [];
           this.msg.push({severity:'info',summary:'Se guardo exitosamente..',detail:'Toda la informacion ...1'});
           setTimeout(function(){
            this.msg.push({severity:'info',summary:'Se guardo exitosamente..',detail:'Toda la informacion ...2'}); 
           },500);
           this.router.navigate(["/"]);
           
        });
       
    }

    handleDeporte($event) {
        if ($event > 0) {
            this.deporteId = $event;
            this.ultimoPaso++;
            this.onChangeStep(this.tipoPaso);
        } else {
            this.pasoActual = 0;
            this.validateDeporte = false;
        }
    }
    handleTipoPrueba($event) {
        if ($event > -1) {
            this.tipoPruebaId = $event;
            this.ultimoPaso++;
            this.onChangeStep(this.tipoPaso);
        } else {
            this.pasoActual = 1;
            this.validateTipoPrueba = false;
        }
    }
    handlePrueba($event) {
        if ($event > -1) {
            this.pruebaId = $event;
            this.ultimoPaso++;
            this.onChangeStep(this.tipoPaso);
        } else {
            this.pasoActual = 2;
            this.validatePrueba = false;
        }
    }
    handleRama($event) {
        if ($event > -1) {
            this.ramaId = $event;
            this.ultimoPaso++;
            this.onChangeStep(this.tipoPaso);
        } else {
            this.pasoActual = 3;
            this.validateRama = false;
            // this.onChangeStep(this.tipoPaso);
        }
    }
    hanldeRestoreStep2($event) {
        this.banderaStep2 = $event;
    }

    hanldeRestoreStep3($event) {
        this.banderaStep3 = $event;
    }
}
