import { Component, OnInit, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { InputTextModule } from 'primeng/primeng';
import { Marcador } from '../../../domain/Conjunto/Marcador';
import { CompetidorPersona } from '../../../domain/Conjunto/CompetidorPersona';
import { BotonJugadorComponent } from '../../boton-jugador/boton-jugador.component';
import { AutocompleteComponent } from '../../searchpersona/autocomplete/autocomplete.component';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Jugador } from '../../../domain/Conjunto/Jugador';
@Component({
  selector: 'app-dialogo-conjunto',
  templateUrl: './dialogo-conjunto.component.html',
  styleUrls: ['./dialogo-conjunto.component.css'],
  providers: [ConjuntoService]
})
export class DialogoConjuntoComponent implements OnInit, OnChanges {
  @Input() datosMarcador: Marcador;
  @Input() competidorId: number;
  @Input() planillaId: number;
  @Input() display: boolean;


  @Input() ParametroId = 0;
  data: any[];
  nombreJugador: CompetidorPersona;
  jugador = '';
  titulares:any[];
  suplentes:any[];
  tecnicos:any[];
  mostrar = true;
  mostrarTitulares:boolean;
  mostrarSuplentes:boolean;
  mostrarCuerpoTecnico:boolean;

  @Output() guardarMarcador = new EventEmitter();
  @Output() cerrar = new EventEmitter();

  @Output() nombrec = new EventEmitter();
  @Output() numeroc = new EventEmitter();

  constructor(private conjuntoService: ConjuntoService) { }
  ngOnInit() {
    this.doGetPlanilla(this.competidorId, this.planillaId, '');
    this.devolverCuerpoTecnico(this.competidorId, this.planillaId);
  this.tecnicos=[]

  }

  /*lista de jugadores*/
  doGetPlanilla(competidorId, planillaId, search) {
    var ti;
    var s;
    this.conjuntoService.GetPlanillaPersonas(competidorId, planillaId, search)
          .then(res => {
            this.data = res.map(item => {
              const i = 0;
        

               return {
                Nombre: item.Persona.Nombres,
                Apellido: item.Persona.Paterno,
                Numero: item.NumeroCamiseta,
                Titular: item.Parametros.ParametroId,
                Posicion: item.Posicion,
                PersonaId: item.PersonaId,
                PlanillaPersonaId: item.PlanillaPersonaId,
                Capitan: item.Capitan
              };
            });
            ti = this.data.filter(function (c) {
              return c.Titular==1;
            });
            s = this.data.filter(function (c) {
              return c.Titular==2;
            });
            this.titulares=ti;
            this.suplentes=s;

            
          });
      }
  subirMarcador() {
    this.datosMarcador.marcador++;
  }
  bajarMarcador() {
    if (this.datosMarcador.marcador <= 0) {
      this.datosMarcador.marcador = 0;
    } else {
      this.datosMarcador.marcador--;
    }
  }
  doSelectSearchPersona($event) {
    this.nombreJugador = $event;
    this.jugador = this.nombreJugador.Persona.Nombres + ' ' +
     this.nombreJugador.Persona.Paterno + ' (' + this.nombreJugador.NumeroCamiseta + ')';
    this.datosMarcador.SucesoPersona.PlanillaPersonaId = this.nombreJugador.PlanillaPersonaId;
  }
  onclickGuardarMarcador() {
    this.guardarMarcador.emit(this.datosMarcador);
  }
  ngOnChanges(changes: SimpleChanges) {

    
    try {
      const pararEvent = changes['display'];
      const validateRama = JSON.stringify(pararEvent.currentValue);
      if (validateRama === 'true') {
        /* this.datosMarcador=new Marcador();*/
        this.jugador = '';
      }
    } catch (error) {

    }
  }
  onclickSeleccionador($event){
    this.jugador  = $event.Nombre+' '+$event.Apellido + ' (' + $event.Numero + ')';;
    this.datosMarcador.SucesoPersona.PlanillaPersonaId = $event.PlanillaPersonaId;

    this.guardarMarcador.emit(this.datosMarcador);
    this.nombrec.emit(this.jugador);
    
  }
  exit() {
    this.cerrar.emit();
  }

  devolverCuerpoTecnico(competidorId, planillaId){
    this.conjuntoService.GetPlanillaPersonasApoyo(competidorId, planillaId, 0)
    .then(res => {
      const data = res;
      if (res.length > 0) {
        this.tecnicos = res.map(item => {
          const i = 0;
          return {
            Nombre: item.Persona.Nombres,
            Apellido: item.Persona.Paterno,
            Numero: item.NumeroCamiseta,
            Titular: item.Parametros.ParametroId,
            Posicion: item.Parametros.Abreviatura,
            PersonaId: item.PersonaId,
            PlanillaPersonaId: item.PlanillaPersonaId,
            Capitan: item.Capitan
          };
        });
      }
    });
  }


}
