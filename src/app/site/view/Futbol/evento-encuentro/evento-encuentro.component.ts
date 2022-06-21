import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { SelectItem, Message } from 'primeng/primeng';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Suceso } from '../../../domain/deportes/grupo/Suceso';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckboxModule } from 'primeng/primeng';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { DataTableModule, SharedModule, DataTable } from 'primeng/primeng';
import { Util } from '../util';

@Component({
  selector: 'app-evento-encuentro',
  templateUrl: './evento-encuentro.component.html',
  styleUrls: ['./evento-encuentro.component.css'],
  providers: [ConjuntoService, ConfirmationService]
})
export class EventoEncuentroComponent implements OnInit {
  sucesos: SelectItem[];
  selectedValue = '0';
  data: Suceso[];
  @Input() planillaId: number;
  @Input() deportePeriodoId: number;
  @Input() competidorId: number;
  @Input() deporteId: number;
  @Output() cerrar = new EventEmitter();
  @Output() cambio = new EventEmitter();

  @Output() actualizar = new EventEmitter();

  selectedDelete: string[] = [];
  DataForm: FormGroup;
  msgs: Message[] = [];
  utilidad: Util;
  constructor(private conjuntoService: ConjuntoService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService) {
    this.utilidad = new Util();
    this.sucesos = [];
    this.data = [];
    this.init_formulario();
  }

  ngOnInit() {
    this.cargarParametros();


  }
  private init_formulario() {
    this.DataForm = this.formBuilder.group({
      SucesoId: [''],
    });
  }
  public cargarHistorial(filtro) {

    //debugger;
    
    this.conjuntoService.getHistorialSucesos(this.planillaId, this.deportePeriodoId, this.competidorId)
      .then(res => {
        let datos;

        if (Number(filtro) === 0) { datos = res; } else {
          datos = res.filter(item => Number(item.ParametroSucesoId) === Number(filtro));
        }
        console.log('esto es lo que responde',datos)
        this.data = datos.map(item => {
          //let min:string ;
          //let seg = '00';
          console.log('vemaos',item.Tiempo,'ojo' );
          var min,seg:string;
          //m=item.Tiempo.split(':');
          const aux = String(item.Tiempo)
          if (aux.length>0) {
            min = String(aux).substr(0,String(aux).indexOf('.'));
            if (min.length>0) { min= '0'+String(min)  ;}
            seg = String(aux).substr(String(aux).indexOf('.')+1,String(aux).indexOf('.')+2);
          }
          
          item.Tiempo= min+':'+seg;
          console.log('vemaos',item.Tiempo, min, seg);
          let descripcionPlus: string;
          descripcionPlus = '';
          if (item.SucesoPersonas.length > 0) {
            item.SucesoPersonas.forEach(element => {
              const nombre = this.utilidad.capitalize(String(element.PlanillaPersona.Persona.Nombres));
              const apellido = this.utilidad.capitalize(String(element.PlanillaPersona.Persona.Paterno));

              descripcionPlus += ', ' + nombre + ' ' + apellido;
            });
          }
          item.ParametrosSuceso.Parametro = item.ParametrosSuceso.Parametro + descripcionPlus;
          return {
            SucesoId: item.SucesoId,
            DeportePeriodoId: item.DeportePeriodoId,
            Tiempo: min + ':' + seg,
            CompetidorId: item.CompetidorId,
            PlanillaId: item.PlanillaId,
            ParametroSucesoId: item.ParametroSucesoId,
            Parametro: item.ParametrosSuceso.Parametro
          };
        });

      });
  }
  private cargarParametros() {
    this.conjuntoService.getParametrosConjunto(this.competidorId, this.planillaId, this.deporteId, 0)
      .then(res => {
        
        this.sucesos = res.map(item => {

          return { label: item.Parametro, value: item.ParametroSucesoId, icon: '' };
        });
        //console.log('sucesos',this.sucesos);
        this.sucesos.push({ label: ' Listar Todo', value: 0 });
        this.sucesos = this.sucesos.sort((a, b) => String(a.label).localeCompare(String(b.label)));
        console.log('sucesos2',this.sucesos);
        this.cargarHistorial(0);
      });

  }
  onChangeSuceso($event) {
    this.selectedValue = $event.value;
    this.cargarHistorial($event.value);
  }
  selectDelete($event) {
    // alert(JSON.stringify(this.selectedDelete))
  }
  eliminar(dt: DataTable) {
    /* this.selectedDelete.forEach(item => {
       this.DataForm.controls["SucesoId"].setValue(item);
       this.conjuntoService.DeletSuceso(this.DataForm).subscribe(res => {
         this.cargarHistorial(this.selectedValue);
         this.actualizarBotones();
         this.showMessage('Se ha eliminado los datos satisfactoriamente', "info", "Mensaje");
       });



     });*/
    this.conjuntoService.DeleteSucesosGrupos(this.selectedDelete).subscribe(res => {
      this.cargarHistorial(this.selectedValue);
      this.actualizarBotones();
      this.showMessage('Se ha eliminado los datos satisfactoriamente', 'info', 'Mensaje');
    });


  }
  private showMessage(mensaje, color, titulo) {

    this.msgs = [];
    this.msgs.push({ severity: color, summary: titulo, detail: mensaje });
  }
  exit() {
    this.cerrar.emit();
  }

  actualizarBotones() {
    this.actualizar.emit();
  }

}
