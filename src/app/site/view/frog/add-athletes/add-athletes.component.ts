import { Component, OnInit } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Persona } from 'app/site/domain/shared/persona';
import { InscripcionEvento } from 'app/site/domain/Acreditacion/Inscripcion-Evento';
import { PruebaEvento } from 'app/site/domain/acreditacion/prueba-evento';
import { Rol } from 'app/site/domain/Acreditacion/rol';
import { Competidor } from 'app/site/domain/shared/competidor';
import { RolService } from 'app/site/service/Acreditacion/rol.service';
import { AcreditacionPersonaService } from 'app/site/service/Acreditacion/acreditacion-persona.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-athletes',
  templateUrl: './add-athletes.component.html',
  styleUrls: ['./add-athletes.component.css'],
  providers: [RolService, AcreditacionPersonaService],
})
export class AddAthletesComponent implements OnInit {


  roles_dd: SelectItem[];
  rol_dd: any;
  DatosPesona: Persona; // = new Persona();

  DatosPesonalesForm: FormGroup;
  CIvali: any = false;
  paternoVali: any = false;
  maternoVali: any = false;
  nombreVali: any = false;
  nacioVali: any = false;
  celuVali: any = false;
  rolVali: any = false;
  nroVali: any = false;

  _roles: Rol[];
  rol: Rol;

  PhotoBase64: string = '';
  photovalid: boolean = false;

  es: any;
  fechaActual: Date;
  Persona: Persona;

  msgs: Message[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private rolService: RolService,
    private AcrePerso: AcreditacionPersonaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const NombreRegx = `^[A-Z a-z]*$`;
    const docIdentRegx = `^[0-9]+(?:\(\d+\))?$`;
    this.DatosPesonalesForm = this.formBuilder.group({
      DocumentoIdentidad: ['', Validators.compose([Validators.required, Validators.minLength(4),
      Validators.maxLength(15), Validators.pattern(docIdentRegx)])],
      Paterno: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(NombreRegx)])],
      Materno: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(NombreRegx)])],
      Nombres: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(NombreRegx)])],
      Nacido: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      Celular: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      Rol: ['', Validators.compose([Validators.required])],
      NroCamiseta: ['', Validators.compose([Validators.required])],
      Fbf: [''],
      // Sexo: ['']
      // ParametroTipoSangre: ['', Validators.compose([Validators.required, Validators.minLength(10)])]
    });
  }

  ngOnInit() {
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
    this.doGetRol();
  }

  doGetRol() {
    this.rolService
      .getRol(9)
      .then(res => {
        this._roles = res;
        this.roles_dd = res.map(item => {
          return {
            value: item.RolId,
            label: item.RolDescripcion
          };
        });
      });
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
      case 'Celular':
        this.celuVali = (!isvalidate);
        break;
      case 'Rol':
        this.rolVali = (!isvalidate);
        break;
      case 'NroCamiseta':
        this.nroVali = (!isvalidate);
        break;

    }
  }

  handleBase64($event) {
    if ($event) {
      this.PhotoBase64 = $event;
      this.photovalid = this.PhotoBase64.length > 0 ? false : true;
      // this.onSaveData();
    }
  }
  hanldeRestoreStep3($event) {
    //this.banderaStep3 = $event;
  }

  validarToNext() {
    const user = JSON.parse(sessionStorage.getItem('resu'));
    let dataU = user.ConfigUsuario[0];
    Object.keys(this.DatosPesonalesForm.value).forEach(k => {
      console.log(k);
      this.validate(k.toString());
    });
    if (this.DatosPesonalesForm.valid && this.PhotoBase64.length > 0) {
      this.photovalid = false;
      this.DatosPesona = this.Persona;
      !this.DatosPesona.InscripcionEvento ? this.DatosPesona.InscripcionEvento = new InscripcionEvento() : '';

      // tslint:disable-next-line:no-unused-expression
      !this.DatosPesona.InscripcionEvento.Competidor ? this.DatosPesona.InscripcionEvento.Competidor = new Competidor() : '';
      if (!this.DatosPesona.InscripcionEvento.PruebaEvento) {
        const prueba: PruebaEvento = new PruebaEvento();
        this.DatosPesona.InscripcionEvento.PruebaEvento = prueba;
      }

      this.DatosPesona.InscripcionEvento.RolId = this.rol_dd;
      this.DatosPesona.InscripcionEvento.DeporteId = dataU.DeporteId; // Hacerlo dinamico
      this.DatosPesona.InscripcionEvento.PruebaId = dataU.PruebaId;
      this.DatosPesona.InscripcionEvento.ParametroRamaId = dataU.ParametroRamaId; //Masculino igual Cambiar
      this.DatosPesona.InscripcionEvento.PruebaEvento.EsIndividual = dataU.EsIndividual; //this.tipoPruebaId === 1 ? true : false;
      this.DatosPesona.InscripcionEvento.EventoId = dataU.EventoId;
      this.DatosPesona.photo = this.PhotoBase64;
      // Datos Faltantes
      this.DatosPesona.InscripcionEvento.DelegacionId = dataU.DelegacionId;
      this.DatosPesona.InscripcionEvento.RepresentacionId = 0;
      this.DatosPesona.InscripcionEvento.Grado = 'kinder';
      this.DatosPesona.InscripcionEvento.Talla = 's';
      this.DatosPesona.InscripcionEvento.Peso = 0;
      this.DatosPesona.InscripcionEvento.Estatura = 0;
      this.DatosPesona.InscripcionEvento.Edad = 10;
      this.DatosPesona.InscripcionEvento.Codigo = '';
      this.DatosPesona.InscripcionEvento.Competidor.EquipoId = dataU.EquipoId;
      this.DatosPesona.InscripcionEvento.Competidor.Posicion = 'central';
      this.DatosPesona.InscripcionEvento.Competidor.MarcaTiempoInicial = '00:50';

      console.log(this.DatosPesona);
      this.AcrePerso.setAcrePersonaInscritaFrog(this.DatosPesona).subscribe(res => {
        const resp = res.json();
        if (resp > 0) {
            // this.doLoadGrupos();
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Información', detail: 'Registro exitoso.' });
            setTimeout(()=>{
              this.router.navigate([`master/inscritos-frog`]);
            }, 1300);
        }
    });
    }
    else {
      if(this.PhotoBase64.length == 0)
        this.photovalid = true;
    }
  }
}
