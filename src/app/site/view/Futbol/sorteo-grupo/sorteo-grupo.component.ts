import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { Message, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import * as urls from '../../../domain/Shared/global';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-sorteo-grupo',
  templateUrl: './sorteo-grupo.component.html',
  styleUrls: ['./sorteo-grupo.component.css'],
  providers: [ConjuntoService],
  encapsulation: ViewEncapsulation.None
})
export class SorteoGrupoComponent implements OnInit, OnChanges {
  private _connection: SignalRConnection;
  @Input() Nombre: String;
  @Input() IdGrupo: number;

  @Input() eventoId: number;
  @Input() deporteId: number;
  @Input() genero: number;

  @Input() Equipos: SelectItem[];
  @Input() uLista: boolean;

  private delegacion_custom: number;
  style_columna: any;
  @Input() data: any[];
  seleccionado: string;
  mensaje: Message[] = [];
  equipo_str: string;

  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: { name: 'control', group: 'sorteo' },
    url: urls.urlSockets
  };

  constructor(private conjuntoService: ConjuntoService,
    private _signalR: SignalR) {
    this.Nombre = '';
    this.style_columna = { 'width': '5%' };
    this.data = [];

  }


  ngOnInit() {
    this.conectar();
  }

  actualizarPosiciones() {
    for (let i = 0; i <= 3; i++) {
      const data = {
        GrupoId: this.IdGrupo,
        Orden: i + 1,
        EquipoId: null,
        DelegacionId: 0
      };
      this.conjuntoService.SaveEquipoGrupo(data).subscribe(res => { });
    }
    for (let i = 0; i <= this.data.length; i++) {
      try {
        const data = {
          GrupoId: this.IdGrupo,
          Orden: i + 1,
          EquipoId: parseInt(this.data[i].Equipo.id === undefined ? this.data[i].EquipoId : this.data[i].Equipo.id, 10),
          DelegacionId: this.data[i].DelegacionId
        };
        this.conjuntoService.SaveEquipoGrupo(data).subscribe(res => { });
      } catch (error) {

      }

    }
  }
  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then((c) => {
      const listener = c.listenFor('ControlSorteo');
      listener.subscribe();
      c.invoke('ControlSorteo', this.o.qs.name, this.o.qs.group).then(() => { });
    });
  }
  add() {

    const aux = this.data;
    this.data = [];
    try {
      for (let i = 0; i < aux.length; i++) {
        this.data.push(aux[i]);
      }
    } catch (error) {

    }

    this.data.push({ GrupoId: this.IdGrupo, Orden: 0, Equipo: '', DelegacionId: 0 });

  }
  ngOnChanges(changes: SimpleChanges) {
    try {

      const pararEvent = changes['IdGrupo'];
      const validateRama = JSON.stringify(pararEvent.currentValue);
      this.setEquipos(validateRama);
    } catch (error) {

    }
  }
  private setEquipos(IdGrupo) {
    this.data = [];
    this.conjuntoService
      .getEquiposGrupo(IdGrupo)
      .then(res => {
        this.data = res.map(item => {
          return {
            GrupoId: item.GrupoId,
            Orden: item.Orden,
            Equipo: item.Equipo.EquipoDescripcion,
            EquipoId: item.Equipo.EquipoId,
            DelegacionId: item.Equipo.DelegacionId
          };
        });
      });

  }
  private setEquiposActualizar(IdGrupo) {
    this.data = [];
    this.conjuntoService
      .getEquiposGrupo(IdGrupo)
      .then(res => {
        this.data = res.map(item => {
          return {
            GrupoId: item.GrupoId,
            Orden: item.Orden,
            Equipo: item.Equipo.EquipoDescripcion,
            EquipoId: item.Equipo.EquipoId,
            DelegacionId: item.Equipo.DelegacionId
          };
        });
        this.actualizarPosiciones();
      });

  }
  onChange_dropdown($event, posicion, seleccionado) {
    seleccionado.DelegacionId = $event.value.DelegacionId;
    this.equipo_str = $event.value.name;
    $('#button' + posicion + 'g' + this.IdGrupo).addClass('css0');
  }
  eliminar(seleccionado, posicion) {
    const id = parseInt(seleccionado.Equipo.id === undefined ? seleccionado.EquipoId : seleccionado.Equipo.id, 10);

    const data = {
      GrupoId: this.IdGrupo,
      Orden: seleccionado.Orden,
      EquipoId: id
    };

    if (String(id) !== 'NaN') {
      this.conjuntoService.DeleteEquipoGrupo(this.IdGrupo, data.EquipoId).then(res => {
        this.setEquiposActualizar(this.IdGrupo);
        this._connection.invoke('sendSorteo', this.o.qs.group, {
          GrupoId: data.GrupoId,
          EquipoId: data.EquipoId, eventoId: this.eventoId, deporteId: this.deporteId, genero: this.genero
        });
        this.mensaje.push({ severity: 'success', summary: 'Exito', detail: 'Se elimino correctamente el registro' });

      });
    } else {
      this.setEquipos(this.IdGrupo);
    }



  }
  get_existe_delegacion(delegacion: number) {
    let c = 0;
    this.data.forEach(element => {
      if (Number(element.DelegacionId) === Number(delegacion)) {
        c++;
      }
    });
    return c > 1 ? true : false;
  }
  guardarEquipoSorteo(seleccionado, posicion) {
    console.clear();
    console.log(seleccionado);

    this.mensaje = [];
    if (Number(seleccionado.DelegacionId) === 0) {
      this.mensaje.push({
        severity: 'danger', summary: 'Error',
        detail: 'Debe seleccionar un equipo'
      });
    } else {

      // if (!this.get_existe_delegacion(seleccionado.DelegacionId)) { //DESCOMENTAR PARA QUE SOLO HAYA UN EQUIPO DE LA MISMA DELEGACION EN UN GRUPO
        const data = {
          GrupoId: this.IdGrupo,
          Orden: posicion + 1,
          EquipoId: parseInt(seleccionado.Equipo.id === undefined ? seleccionado.EquipoId : seleccionado.Equipo.id, 10)
        };

        this.conjuntoService.SaveEquipoGrupo(data).subscribe(res => {
          const resp = res.json();
          if (resp) {
            this.mensaje.push({ severity: 'success', summary: 'Exito', detail: 'Se agrego correctamente el registro' });
            this._connection.invoke('sendSorteo', this.o.qs.group, {
              GrupoId: data.GrupoId,
              EquipoId: data.EquipoId, eventoId: this.eventoId, deporteId: this.deporteId, genero: this.genero
            });
            $('#button' + posicion + 'g' + this.IdGrupo).removeClass('css0');

          } else {
            this.mensaje.push({ severity: 'danger', summary: 'Error', detail: 'Error al guardar el registro' });
          }

        });
      // } else {
      //   this.mensaje.push({
      //     severity: 'danger', summary: 'Error',
      //     detail: 'No puede registrarse dos equipos de la misma delegación en el grupo'
      //   });
      // }
    }
  }

}
