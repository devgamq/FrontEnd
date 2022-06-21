import {TabViewModule,MenuItem,DataTableModule,SharedModule, DataTable,  ProgressBarModule} from 'primeng/primeng';
import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectItem, Message,DropdownModule } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AcreditacionPersonaService } from '../../service/Acreditacion/acreditacion-persona.service';
import { ParametroService } from 'app/site/service/shared/parametro.service';
import { Persona } from 'app/site/domain/shared/persona';
import { Parametro } from 'app/site/domain/shared/parametro';


@Component({
  selector: 'app-pmenu',
  templateUrl: './pmenu.component.html',
  styleUrls: ['./pmenu.component.css'],
  providers: [AcreditacionPersonaService, ParametroService]
})
export class PmenuComponent implements OnInit {
  items: MenuItem[];
  //msgs: Message[];
  sexos: SelectItem[];
  userform: FormGroup;
  userform2: FormGroup;
  submitted: boolean;

  //items: MenuItem[];
  estado: boolean;
  //submitted: boolean;
  msgs: Message[] = [];
 // userform: FormGroup;
  es:any;
  genders: SelectItem[];
  paises: SelectItem[];
  description: string;

   
  @Input() bandera?: any;
  @Input() Persona: Persona;
  @Output() DatosPesonalesOutput = new EventEmitter();
  @Output() restore = new EventEmitter();

  //DisableForm: FormBuilder;
  DatosPesonalesForm: FormGroup;
  CIvali: any = false;
  paternoVali: any = false;
  maternoVali: any = false;
  nombreVali: any = false;
  nacioVali: any = false;
  TipoSangreVali: any = false;
  sexSelc = '1';
  
  Nom: String;
  Ap: String;
  Am: String;
  se: String;
  fnc: Date;
  sang:Number;

  //es: any;
  fechaActual: Date;
  fechaIntro: Date;
  _Persona: any;
  Personas: Persona[];
  tipoSangre: SelectItem[];
  //estado: boolean;
  tipo: string;
  posis: any;
  Equipos: any;
  file: String;
  tb2: boolean;
  tb3: boolean;
  index: number;
  constructor( private fb: FormBuilder,private formBuilder: FormBuilder, private AcrePerso: AcreditacionPersonaService, private parametros: ParametroService) 
  {
      this.genders = [
            {label:'Seleciona ', value:null},
            {label:'Masculino', value:{id:1, name: 'Varon', code: 'hom'}},
            {label:'Femenino', value:{id:2, name: 'Mujer', code: 'muj'}},
             ];

     this.parametros.getParametroforCodigo(4).then(res => {
      this.tipoSangre = res;
    });

      this.posis =[
                {label:'Seleciona ', value:null},
                {label:'Arquero', value:{id:1, name: 'Arq', code: 'a'}},
                {label:'Defensa', value:{id:1, name: 'Def', code: 'def'}},
                {label:'Medio Campo', value:{id:1, name: 'Medio', code: 'Med'}},
                {label:'Delantero', value:{id:1, name: 'Delan', code: 'del'}},
      ]; 

      this.paises=[]
        this.paises.push({label:'Selecciona', value:''});
        this.paises.push({label:'Argentina', value:'Arg'});
        this.paises.push({label:'Aruba', value:'Aru'});
        this.paises.push({label:'Bolivia', value:'Bol'});
        this.paises.push({label:'Brasil', value:'Bra'});
        this.paises.push({label:'Chile', value:'Chi'});
        this.paises.push({label:'Colombia', value:'Col'});
        this.paises.push({label:'Ecuador', value:'Ecu'});
        this.paises.push({label:'Guyana', value:'Guy'});
        this.paises.push({label:'Panama', value:'Pan'});
        this.paises.push({label:'Peru', value:'Per'});
        this.paises.push({label:'Surinam', value:'Sur'});
        this.paises.push({label:'Uruguay', value:'Uru'});
        this.paises.push({label:'Venezuela', value:'Uru'});          
  
  }
  doSearchPersonas(event) {
    this.Persona = new Persona();
   // this.DisableForm();
    this.userform.controls['CI'].setValue(event.query);
    const query = event.query;
    this.AcrePerso.getSearchPersona(query)
      .then(res => {
        this.Personas = res;
      });
  }
  doSelectSearchPersona($event) {
    this.Persona = this._Persona;
    this.Nom= this.Persona.Nombres;
    this.Ap= this.Persona.Paterno;
    this.Am= this.Persona.Materno;
    this.se= this.Persona.Sexo;
    this.fnc= this.Persona.FechaNacimiento;
    this.sang= this.Persona.ParametroTipoSangreId;

    this.Persona.FechaNacimiento = new Date(this.Persona.FechaNacimiento);
    //this.DisableForm();
  }
  onTabChange(event)
  {
    this.msgs=[];
    this.msgs.push({severity:'info', summary: 'tab elegido', detail:'Index: '+event.index});
  }

  ngOnInit() {
    this.userform = this.fb.group({
            'CI': new FormControl(''),
            'DocumentoIDentidad': new FormControl(''),
            'SearchPersona': new FormControl('', Validators.required),
            'firstname': new FormControl('', Validators.required),
            'lastname': new FormControl('', Validators.required),
            'AMaterno': new FormControl('', Validators.required),
            'fnac': new FormControl('', Validators.required),
            'gender': new FormControl('', Validators.required),
            'tipo': new FormControl(''),
            
        });
     this.userform2 = this.fb.group({
            'peso': new FormControl('', Validators.required),
            'esta': new FormControl('', Validators.required),
            'talla': new FormControl(''),
            'cami': new FormControl(''),
            'posi': new FormControl(''),
            'marca': new FormControl(''),
            'pais': new FormControl(''),
            'tiempo': new FormControl('')
        });      
   this.estado= true;
   this.tb2= true;
   this.tb3= true;
   this.index=0;
  


   this.es = {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      // tslint:disable-next-line:max-line-length
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    };
    
  this.file="ticket02.pdf";
 
  }
  onSubmit(value: string) {
        this.submitted = true;
        //this.msgs = [];
        //this.msgs.push({severity:'info', summary:'Success', detail:'Form Submitted'+this.index});
        if (this.index==0)
        {this.index= 1;
        this.tb2= false;
         }
        else
       if (this.index=1)
        {this.index=2;
        this.tb3= false;
         }
 
        
    }
  mirarpdf()
  {
   
  }
 Siguiente()
{
   this.tb2=true;
   this.index=1;

}

Siguiente2()
{
   this.tb3=true;
   this.index=2; 
}
anterior()
{
   
   this.index=0;

}

anterior2()
{
   
   this.index=1; 
}
validate($event) {
    const IdControl = $event;
    const isvalidate = this.DatosPesonalesForm.controls[IdControl].valid;
    switch (IdControl) {
      case 'CI':
        if (this.userform.controls[IdControl].get.length>=6 )
            {  this.msgs.push({severity:'info', summary:'Error', detail:'CI >= a 6 chars'});
                console.log("Entra a 1")
            }
        
        break;
      case 'Paterno':
        //this.paternoVali = (!isvalidate);
        break;
      case 'Materno':
        //this.maternoVali = (!isvalidate);
        break;
      case 'Nombres':
        //this.nombreVali = (!isvalidate);
        break;
      case 'Nacido':
        //this.nacioVali = (!isvalidate);
        break;

    }
  }
  get diagnostic() { this.Siguiente(); return JSON.stringify(this.userform.value); }
  get diagnostic2(){this.Siguiente2(); return JSON.stringify(this.userform2.value);}
}

