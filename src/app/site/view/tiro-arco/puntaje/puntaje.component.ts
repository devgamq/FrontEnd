import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ToggleButtonModule } from 'primeng/primeng';
import { TiroArcoService } from '../../../service/simple/tiro_arco';
import { Punto } from '../../../domain/tiro_arco/punto';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@Component({
  selector: 'app-puntaje',
  templateUrl: './puntaje.component.html',
  styleUrls: ['./puntaje.component.css'],
  providers: [TiroArcoService, ConfirmationService]
})
export class PuntajeComponent implements OnInit, OnChanges {
  valor_posible = false;
  @Input() PeriodoId = 0;
  @Input() PersonaId = 0;
  @Input() PlanillaId = 0;
  @Input() CompetidorId = 0;
  @Output() getMensaje = new EventEmitter();
  @Output() getpunto = new EventEmitter();

  punto = 0;
  PuntoId = 0;
  confirmado: any;
  puntaje_seleccionado: Punto;
  mensaje: any;
  tipoMensaje: any;
  puntaje: Punto[];
  hide = false;
  total = 0;
  constructor(private tiroArcoService: TiroArcoService,
    private confirmationService: ConfirmationService) {
    this.puntaje = [];
    this.puntaje_seleccionado = new Punto();
  }

  ngOnInit() {

  }
  private getPuntaje() {
    this.tiroArcoService
      .GetPuntosPlanilla(this.PlanillaId, this.CompetidorId, this.PeriodoId)
      .then(res => {
        this.puntaje = res;
        this.mostrarTotal();
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    const periodo = changes['PeriodoId'] === undefined ? 0 : Number(changes['PeriodoId'].currentValue);
    if (periodo > 0) {

      this.getPuntaje();
    }
  }
  private savePunto() {
    this.PuntoId = 0;
    this.guardarPunto();
  }
  private guardarPunto() {
    const usuario = JSON.parse(sessionStorage.getItem('resu'));
    const puntaje = {
      PeriodoId: this.PeriodoId,
      PersonaId: this.PersonaId,
      PlanillaId: this.PlanillaId,
      CompetidorId: this.CompetidorId,
      Puntaje: this.punto,
      Estado: this.confirmado === true ? 1 : 0,
      UsuarioId: usuario.UsuarioId,
      PuntoId: this.PuntoId
    };

    if (isNaN(this.punto) || this.punto < 0) {
      this.mensaje = 'Ocurrio un error en el registro de datos';
      this.tipoMensaje = 'danger';
      const msm = { mensaje: this.mensaje, tipoMensaje: this.tipoMensaje }
      this.getMensaje.emit(msm);
    } else {
      this.tiroArcoService.savePuntos(puntaje).subscribe(res => {
        const valor = Number(res.json());
        this.getpunto.emit(valor);
        if (Number(valor) > 0) {
          this.mensaje = 'Se registro el puntaje correctamente';
          this.tipoMensaje = 'success';
          this.getPuntaje();
        } else {
          this.mensaje = 'Ocurrio un error en el registro de datos';
          this.tipoMensaje = 'danger';
        }
        const msm = { mensaje: this.mensaje, tipoMensaje: this.tipoMensaje }
        this.getMensaje.emit(msm);

      });

      this.clean();
    }

  }
  private clean() {
    this.punto = 0;
    this.confirmado = false;
    this.hide = false;
  }
  onRowSelect($event) {
    this.puntaje_seleccionado = $event.data === undefined ? $event : $event.data;
    this.punto = this.puntaje_seleccionado.Puntaje;
    this.hide = true;
  }
  modificarRegistro() {
    this.PuntoId = this.puntaje_seleccionado.PuntoId;
    this.guardarPunto();
  }

  mostrarTotal() {
    this.tiroArcoService
      .GetPuntajeTiros(this.PeriodoId, this.PlanillaId, this.CompetidorId)
      .then(res => {
        if (res !== null) {
          this.total = Number(res);
        }
      });
  }
  eliminarRegistro() {
    this.confirmationService.confirm({
      message: 'Desea eliminar este puntaje?',
      accept: () => {
        const puntaje = { PuntoId: this.puntaje_seleccionado.PuntoId };
        this.tiroArcoService.EliminarPunto(puntaje).subscribe(res => {
          const data = res.json()[0];
          this.mensaje = 'Se elimino el puntaje seleccionado';
          this.tipoMensaje = 'success';
          const msm = { mensaje: this.mensaje, tipoMensaje: this.tipoMensaje }
          this.getMensaje.emit(msm);
          this.getpunto.emit(this.puntaje_seleccionado.PuntoId);
          this.getPuntaje();
          this.clean();
        });
      }
    });
  }
}
