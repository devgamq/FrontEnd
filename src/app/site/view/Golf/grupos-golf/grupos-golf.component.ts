import { Component, OnInit, AfterViewInit, ViewEncapsulation ,    Input,
    Output, EventEmitter, SimpleChanges  } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { GolfGrupos } from '../../../domain/Golf/grupos';
import { GruposService } from '../../../service/Golf/grupos.service';
import { JornadaService } from '../../../service/Golf/jornada.service';
import { JornadaDropDown } from '../jornada-golf/jornada-dropdown/jornada-dropdown.component';
import { SelectItem, PickListModule, ConfirmationService, CalendarModule, Message } from 'primeng/primeng';


enum DialogType { Insert, Update }

@Component({
    selector: 'app-grupos-golf',
    templateUrl: './grupos-golf.component.html',
    styleUrls: ['./grupos-golf.component.css'],
    providers: [GruposService, JornadaService, ConfirmationService],
    encapsulation: ViewEncapsulation.None
})

export class GruposGolfComponent implements OnInit, AfterViewInit {
    @Output() onMovetoTarget: EventEmitter<any> = new EventEmitter();   
    @Output() NombrePersona = new EventEmitter();
 
    @Input() _Persona: any;
    @Input() _PersonaCon: any;
    type = DialogType;
    grupoform: FormGroup;
    eventoId: number;
    grupos: GolfGrupos[];
    grupo: GolfGrupos;
    display1 = false;
    display2 = false;
    Sinjornada: string[];
    SinjornadaCopy: string[];
    private ConjornadaAll: string[];
    ConJornada: string[] = [];
    msgs: Message[] = [];
    hideElement = false;
    jornadaId: number;
    categoriaId: number;
    estado:number;
    esta:number;
    grupoId: number;
    grupoCategoriaId: number;
    grupoEstadoId: number;
    estados: SelectItem[];
    estadoListbox: SelectItem[];
    HoraSalida: Date;
    panel1:any;
    panel2:any;
    buscador:any;
    PersonaId:string;
    selectedEstado: any;
    constructor(private formBuilder: FormBuilder,
        private http: Http, private GruposService: GruposService,
        private JornadaService: JornadaService,
        private confirmationService: ConfirmationService,
        private activedRoute: ActivatedRoute) {
        this.eventoId = +this.activedRoute.snapshot.params['eventoId'];
        this.cleanForm();
        this.ConjornadaAll=[];
    
    }

    ngOnInit() {
        this.ConjornadaAll=[];

        this.estados = [];
        this.estados.push({label:'Cerrado', value:0});
        this.estados.push({label:'Abierto', value:1});

        this.estadoListbox = this.estados.slice(1);

    }

    ngAfterViewInit() {
        if (this.jornadaId && this.categoriaId) {
            this.doLoadGrupos();
        }
  
        
    }

    doLoadGrupos() {
        this.GruposService
            .getGolfGrupos(this.jornadaId, this.categoriaId)
            .then(res => {
                this.grupos = res;
            });

          

       
    }

    showDialog1(typeDialog: DialogType) {
        this.cleanForm();
        // this.ConJornada = [];
        if (typeDialog === DialogType.Insert) {
            this.grupoId = 0;
        }

        this.loadListas();
        this.display1 = true;
    }

    showDialog2(typeDialog: DialogType) {
        this.cleanForm();
        // this.ConJornada = [];
        if (typeDialog === DialogType.Insert) {
            this.grupoId = 0;
        }

        this.loadListas();
        this.display2 = true;
    }


    cleanForm() {
        this.grupoform = this.formBuilder.group({
            Descripcion: ['', Validators.required]
        });

    }

    onRowSelect(event) {
        this.hideElement = true;
        this.grupoId = event.data.GrupoId;
        const sss = new Date(`2000-01-01T${event.data.Grupo}:00`);
        this.HoraSalida = sss;
        this.estado= event.data.Estado;
     
    }

    confirmDelete() {

        this.confirmationService.confirm({
            message: '¿Esta seguro de eliminar el Grupo?',
            header: 'Eliminar Grupo',
            icon: 'fa fa-trash',
            accept: () => {
                this.GruposService.deleteGrupo(this.grupoId).subscribe(res => {
                    const resp = res.json();
                    this.msgs = [];
                    if (resp === true) {
                        this.doLoadGrupos();
                        this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Grupo Eliminado' });
                    } else {
                        this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'Ocurrio un error Inesperado' });
                    }
                });
            }
        });
    }

    onChangeJornada($event) {
        this.jornadaId = $event.jornadaId;
        if (this.jornadaId && this.categoriaId) {
            this.doLoadGrupos();
        }
    }

    onChangeCategoria($event) {
        this.categoriaId = $event.categoriaId;
        if (this.jornadaId && this.categoriaId) {
            this.doLoadGrupos();
        }
    }

    onChangeGrupoCategoria($event) {
        this.grupoCategoriaId = $event.categoriaId;
        if (this.grupoCategoriaId) {
            this.loadListas();
        }
    }

 
    onChangeGrupoEstado($event) {
        this.estado = $event.estado;
        if (this.grupoEstadoId) {
            this.loadListas();
        }
    
    }

    loadListas() {
        this.GruposService.getGolfCompetidoresSinJornada(this.grupoCategoriaId, this.jornadaId, this.eventoId)
            .then(
            res => {
                this.Sinjornada = res;
                this.SinjornadaCopy = res;
                this.ConjornadaAll = res;

   
          
            });
        this.ConJornada = [];
        if (this.grupoId > 0) {
            this.GruposService.getGolfCompetidoresConJornada(this.grupoId)
                .then(resultado => {
                    this.ConJornada = resultado;

                   
                });
         
          
        }

    }

    doSaveGolfGrupo() {
        if (this.HoraSalida) {
            if (this.ConJornada) {
                const horas = this.HoraSalida.getHours();
                const min = this.HoraSalida.getMinutes();
                const golfgrupo: any = Object.assign({}, { 'HoraSalida': `${horas}:${min}`, 'JornadaId': this.jornadaId, 'GrupoId': this.grupoId, 'Jugador': Object.assign({}, this.ConJornada) });
              
                this.GruposService.setGolfGrupoCompetidores(golfgrupo).subscribe(res => {
                    const resp = res.json();
                    this.msgs = [];
                    if (resp === true) {
                        this.doLoadGrupos();
                        this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Se guardo el grupo' });
                    } else {
                        this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'Ocurrio un error Inesperado' });
                    }
                });
                this.display1 = false;
            } else {
                this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'El grupo debe tener al menos Un Participante' });
            }
        } else {
            this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'Ingrese una salida Valida' });
        }
    }
    opcionTipo($event) {
        this.estado = $event.value;
        this.esta = this.estado;
     
      }

    doSaveGolfEstado() {
       
            if (this.ConJornada) {
            
                const golfgrupo: any = Object.assign({}, { 'Estado':this.estado, 'GrupoId': this.grupoId });
           
                this.GruposService.setGolfGrupoCompetidoresEstado(golfgrupo).subscribe(res => {
                    const resp = res.json();
                    this.msgs = [];
                    if (resp === true) {
                        this.doLoadGrupos();
                        this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Se guardo el grupo' });
                    } else {
                        this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'Ocurrio un error Inesperado' });
                    }
                });
                this.display2 = false;
            } else {
                this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'El grupo debe tener al menos Un Participante' });
            }
   
     
    }






    doReporte() {
        this.GruposService
            .GetDetalleGrupos(this.jornadaId, this.categoriaId, this.eventoId)
            .then(res => {
                window.open(URL.createObjectURL(res));
            });
    }

    removeItemFromArr ( arr, item ) {
        var i = arr.indexOf( item );
     
        if ( i !== -1 ) {
            arr.splice( i, 1 );
        }
    }

    doSearchPersonas(event) {
        const query = event.query;
     
        for(var i = 0;i<this.ConJornada.length;i++) { 
            this.removeItemFromArr( this.SinjornadaCopy, this.ConJornada[i]);
           
        }
        if (query.length==0){
    
            this.Sinjornada = this.SinjornadaCopy;
            return;
        }
        this.Sinjornada=this.SinjornadaCopy.filter(x => x["Paterno"].toLowerCase().includes(query.toLowerCase()));
    
        }
        
        doSelectSearchPersona($event) {
          
          alert('error');
         
        }
    
        move(event: any) {

            for(var i = 0;i<this.ConJornada.length;i++) { 
                this.removeItemFromArr( this.SinjornadaCopy, this.ConJornada[i]);
               
            }
            this.Sinjornada = this.SinjornadaCopy;
            this.clean();
        }

        clean(){
            this._Persona = '';
        }



}

















