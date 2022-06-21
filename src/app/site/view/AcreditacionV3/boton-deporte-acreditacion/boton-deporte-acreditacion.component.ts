import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import {MultiSelectModule} from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import {ButtonModule} from 'primeng/primeng';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';
@Component({
  selector: 'app-boton-deporte-acreditacion',
  templateUrl: './boton-deporte-acreditacion.component.html',
  styleUrls: ['./boton-deporte-acreditacion.component.css'],
  providers: [ConfirmationService,DeporteService]
})
export class BotonDeporteAcreditacionComponent implements OnInit {
  @Input() pruebaSeleccionadas: any[];
  @Input() deporteId:number;
  @Input() eventoId:number;
  @Output() cerrar = new EventEmitter();
  @Output() datosramas = new EventEmitter();
  pruebaId:number;
  ramaId:number;
  ramas: any[];
  ramaCompetidor:any[];
  ramalista:any[];
  mostrarDialogoRama:boolean;
  constructor(private confirmationService: ConfirmationService,private deporteService: DeporteService) { 
    this.ramaCompetidor = [];
    
  }
  
  ngOnInit() {
    this.getLista();
  }

  seleccionarPrueba(){
    this.getRamas();
  }

  getRamas(){
    this.ramas = [];
    this.ramas.push({label:'Seleccione Rama', value:null});
    this.deporteService.getRamas(this.eventoId, this.deporteId, 1, this.pruebaId).then(res => {
      res.forEach(item => {
        this.ramas.push({ label: item.Nombre, value: item.ParametroRamaId });
      });
    });
  }
  agregarRamaCompetidor(){
    let ramaId=this.ramaId;
    let pruebaId=this.pruebaId;
    var consulta1 = this.ramas.filter(function (c) {
      return c.value  == ramaId;
    });
    var consulta2 = this.pruebaSeleccionadas.filter(function (c) {
      return c.value == pruebaId;
    });
    this.ramaCompetidor.push({ pruebaId: this.pruebaId,descripcionPrueba:consulta2[0].label, ramaId: this.ramaId,descripcionRama:consulta1[0].label});
    localStorage.setItem('ramas', JSON.stringify(this.ramaCompetidor));
    this.getLista();
  }
  getLista(){
    this.ramalista=[];
    this.ramalista=JSON.parse(localStorage.getItem('ramas'));
  }
  cancelarRamas(){
    this.cerrar.emit();
  }
  eliminarRamas($event){
    console.log($event.data);
    
  }
  enviarDatos(){
    this.datosramas.emit(this.ramalista);
  }

}
