import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AcreditacionPersonaService } from 'app/site/service/Acreditacion/acreditacion-persona.service';
import { ParametroService } from 'app/site/service/shared/parametro.service';
import { Persona } from 'app/site/domain/shared/persona';
import { Parametro } from 'app/site/domain/shared/parametro';


@Component({
  selector: 'app-acreditacion-datos-personales',
  templateUrl: './acreditacion-datos-personales.component.html',
  styleUrls: ['./acreditacion-datos-personales.component.css'],
  providers: [AcreditacionPersonaService, ParametroService]
})

export class AcreditacionDatosPersonalesComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() bandera?: any;
  @Input() Persona: Persona;
  @Output() DatosPesonalesOutput = new EventEmitter();
  @Output() restore = new EventEmitter();

  DatosPesonalesForm: FormGroup;
  CIvali: any = false;
  paternoVali: any = false;
  maternoVali: any = false;
  nombreVali: any = false;
  nacioVali: any = false;
  TipoSangreVali: any = false;
  sexSelc = '1';
  submitted: boolean;
  es: any;
  fechaActual: Date;
  fechaIntro: Date;
  _Persona: any;
  Personas: Persona[];
  tipoSangre: SelectItem[];

  constructor(private formBuilder: FormBuilder, private AcrePerso: AcreditacionPersonaService, private parametros: ParametroService) {
    this.validarformulario();
  }
  doSearchPersonas(event) {
    this.Persona = new Persona();
    this.DisableForm();
    this.DatosPesonalesForm.controls['DocumentoIdentidad'].setValue(event.query);
    const query = event.query;
    this.Persona.CI= query;
    /*
    {this.AcrePerso.getSearchPersona(query)
      .then(res => {
        this.Personas = res;
      })
    } */ 
  }
  doSelectSearchPersona($event) {
    this.Persona = this._Persona;
    this.Persona.FechaNacimiento = new Date(this.Persona.FechaNacimiento);
    this.DisableForm();
  }

  ngOnInit() {
    // tslint:disable-next-line:no-debugger
 
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      // tslint:disable-next-line:max-line-length
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    };
    this.fechaActual = new Date();
    if (!this.Persona) {
      this.Persona = new Persona();
    }
    this.parametros.getParametroforCodigo(4).then(res => {
      this.tipoSangre = res;
    });

  }

  ngAfterViewInit() {

    this._Persona = this.Persona.DocumentoIdentidad;
    this.DisableForm();

  }

  ngOnChanges(changes: SimpleChanges) {
    const chng = changes['bandera'];
    const banderaValue = JSON.stringify(chng.currentValue);
    if (banderaValue === '2') {
      if (this.bandera === 2) { // && !this.Persona
        this.validarToNext();
      }
    } else if (this.Persona) {
      this.restore.emit(1);
    }
  }

  validarformulario() {
    const NombreRegx = `^[A-Z a-z]*$`;
    const docIdentRegx = `^[0-9]+(?:\(\d+\))?$`;
    this.DatosPesonalesForm = this.formBuilder.group({
      SearchPersona: ['', Validators.compose([Validators.required, Validators.minLength(4),
      Validators.maxLength(15), Validators.pattern(docIdentRegx)])],
      DocumentoIdentidad: [''],
      Paterno: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(NombreRegx)])],
      Materno: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(NombreRegx)])],
      Nombres: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(NombreRegx)])],
      Nacido: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      Sexo: [''],
      ParametroTipoSangre: ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    });
  }

  validarToNext() {
    let resultado = true;

    if (!this.Persona) {
      this.Persona = new Persona();
    }
    if ((!this.Persona) || (this.Persona.PersonaId === 0)) {
      this.CIvali = (!this.DatosPesonalesForm.controls['DocumentoIdentidad'].valid);
      this.paternoVali = (!this.DatosPesonalesForm.controls['Paterno'].valid);
      this.maternoVali = (!this.DatosPesonalesForm.controls['Materno'].valid);
      this.nombreVali = (!this.DatosPesonalesForm.controls['Nombres'].valid);
      this.nacioVali = (!this.DatosPesonalesForm.controls['Nacido'].valid);
      if (this.DatosPesonalesForm.controls['Nacido'].valid) {
        this.fechaIntro = this.DatosPesonalesForm.controls['Nacido'].value;
        const yearIntro = this.fechaIntro.getFullYear();
        let yearValido = this.fechaActual.getFullYear();
        yearValido = yearValido - 5;
        this.nacioVali = (yearIntro > yearValido);
      }
      resultado = resultado && (!this.CIvali);
      resultado = resultado && (!this.paternoVali);
      resultado = resultado && (!this.maternoVali);
      resultado = resultado && (!this.nombreVali);
      resultado = resultado && (!this.nacioVali);
      resultado = resultado && (!this.TipoSangreVali);
    }
    if (resultado) {
      this.DatosPesonalesOutput.emit(this.Persona);
    } else {
      this.restore.emit(1);
    }
  }
  DisableForm() {
    // tslint:disable-next-line:no-debugger
    if (this.Persona.PersonaId !== 0) {
      this.DatosPesonalesForm.controls['Paterno'].disable();
      this.DatosPesonalesForm.controls['Materno'].disable();
      this.DatosPesonalesForm.controls['Nombres'].disable();
      this.DatosPesonalesForm.controls['Nacido'].disable();
      this.DatosPesonalesForm.controls['Sexo'].disable();
    } else {
      this.DatosPesonalesForm.controls['Paterno'].enable();
      this.DatosPesonalesForm.controls['Materno'].enable();
      this.DatosPesonalesForm.controls['Nombres'].enable();
      this.DatosPesonalesForm.controls['Nacido'].enable();
      this.DatosPesonalesForm.controls['Sexo'].enable();
    }
    if (((this.Persona.ParametroTipoSangreId) || (this.Persona.ParametroTipoSangreId !== 0)) && this.Persona.PersonaId !== 0) {
      this.DatosPesonalesForm.controls['ParametroTipoSangre'].disable();
    } else {
      this.DatosPesonalesForm.controls['ParametroTipoSangre'].enable();
    }

  }

  validate($event) {
    const IdControl = $event;
    const isvalidate = this.DatosPesonalesForm.controls[IdControl].valid;
    switch (IdControl) {
      case 'DocumentoIdentidad':
        this.CIvali = (!isvalidate);
        break;
      case 'Paterno':
        this.paternoVali = (!isvalidate);
        break;
      case 'Materno':
        this.maternoVali = (!isvalidate);
        break;
      case 'Nombres':
        this.nombreVali = (!isvalidate);
        break;
      case 'Nacido':
        this.nacioVali = (!isvalidate);
        break;

    }
  }
}
