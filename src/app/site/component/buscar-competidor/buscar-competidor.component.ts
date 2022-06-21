import { Component, OnInit } from '@angular/core';
import { SimpleService } from '../../service/simple/simple.service';
import { SelectItem } from 'primeng/primeng';
import { DeporteService } from '../../service/Acreditacion/deporte.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-buscar-competidor',
  templateUrl: './buscar-competidor.component.html',
  styleUrls: ['./buscar-competidor.component.css'],
  providers: [SimpleService,DeporteService]
})
export class BuscarCompetidorComponent implements OnInit {
  eventoId:number;
  datos:any[];
  displayDialog=false;
  datosCompetidor:any[];
  nombres:string;
  apellidos:string;
  edad:number;
  estatura:string;
  peso:string;
  deporte:string;
  delegacion:string;
  representacion:string;
  foto:string;
  deporteId:number;
  delegacionId:number;
  deportes: SelectItem[];
  delegaciones: SelectItem[];
  indice=1;
  constructor(private simpleService: SimpleService,private deporteService: DeporteService,private route: ActivatedRoute) { 
    this.eventoId = this.route.snapshot.params['eventoId'];
  }

  ngOnInit() {

    this.cargarCompetidores(this.eventoId,0,0);
    this.doGetDeportes();
    this.doGetDelegaciones();
  }

  cargarCompetidores(eventoId,deporteId,delegacionId){

    this.simpleService.GetParticipantes(eventoId,deporteId,delegacionId).then(res => {
      this.datos=res;
    });
  }

  mostrarCompetidor($event){
    this.displayDialog=true;
    this.datosCompetidor=$event.data;
    this.nombres=this.datosCompetidor["Nombres"];
    this.apellidos=this.datosCompetidor["Paterno"]+" "+this.datosCompetidor["Materno"];
    this.edad=this.calcularEdad(this.datosCompetidor["FechaNacimiento"]);
    this.estatura=this.datosCompetidor["Estatura"];
    this.peso=this.datosCompetidor["Peso"];
    this.deporte=this.datosCompetidor["Deporte"];
    this.delegacion=this.datosCompetidor["Delegacion"];
    this.representacion=this.datosCompetidor["Representacion"];
    this.foto=this.datosCompetidor["FotoUrl"];
  }

   calcularEdad(fecha) {
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
}
cerrarVentana(){
  this.displayDialog=false;
}

doGetDeportes() {
  this.deportes = [];
  this.deportes.push({label:'Todos', value:null});
  this.deporteService
    .getDeportes(this.eventoId)
    .then(res => {
      const aux = res;
      aux.forEach(element => {
        this.deportes.push({ label: element.DeporteDescripcion, value: element.DeporteId });
      });

    });
}

doGetDelegaciones() {
  this.delegaciones = [];
  this.delegaciones.push({label:'Todos', value:null});
  this.simpleService
    .GetDelegaciones(this.eventoId)
    .then(res => {
      const aux = res;
      aux.forEach(element => {
        this.delegaciones.push({ label: element.Nombre, value: element.DelegacionId });
      });
    });
}

listaDeportes(){
  if(this.deporteId==null && this.deporteId==null){
    this.deporteId=0;
    this.delegacionId=0;
  }
  if(this.delegacionId==null){
    this.delegacionId=0;
  }
  this.cargarCompetidores(this.eventoId,this.deporteId,this.delegacionId);
}


}
