import { Component, OnInit } from "@angular/core";
import { PickListModule, GrowlModule, Message } from "primeng/primeng";
import { DeporteService } from "../../../service/Acreditacion/deporte.service";
import { SelectItem } from "primeng/primeng";
import { ActivatedRoute, Router } from "@angular/router";
import { ConjuntoService } from "../../../service/Conjunto/conjunto.service";
import { SignalR, SignalRConnection, IConnectionOptions } from "ng2-signalr";
import * as urls from "../../../domain/Shared/global";

@Component({
  selector: "app-sorteo-config",
  templateUrl: "./sorteo-config.component.html",
  styleUrls: ["./sorteo-config.component.css"],
  providers: [DeporteService, ConjuntoService]
})
export class SorteoConfigComponent implements OnInit {
  deporte: number;
  genero: number;
  deportes: SelectItem[];
  generos: SelectItem[];
  equipos: SelectItem[];
  grupos: any[];
  rowGroup: any[];
  data: any[];
  eventoId = 1;
  style_columna: string;
  private _connection: SignalRConnection;
  mesaje: Message[] = [];
  rows: number;
  bandera: boolean;
  mostrar: any;

  o: IConnectionOptions = {
    hubName: "HammerHub",
    qs: { name: "control", group: "sorteo" },
    url: urls.urlSockets
  };
  constructor(
    private deporteService: DeporteService,
    private _signalR: SignalR,
    private route: ActivatedRoute,
    private conjuntoService: ConjuntoService
  ) {
    this.grupos = [];
    this.deporte = 0;
    this.genero = 0;
    this.mostrar = -1;
  }

  ngOnInit() {
    this.eventoId = this.route.snapshot.params["eventoId"];
    this.initDeportes();
    this.initGeneros();
    this.conectar();
  }

  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {
      const listener = c.listenFor("ControlSorteo");
      listener.subscribe();
      c.invoke("ControlSorteo", this.o.qs.name, this.o.qs.group).then(() => { });
    });
  }

  private initGrupos() {
    this.conjuntoService
      .getGruposSorteo(this.deporte, this.genero, this.eventoId, 1)
      .then(res => {        
        this.rowGroup = [];
        this.grupos = res;
        this.rows = 1;      
        this.rowGroup[0] = { 'fila': 0, 'grupo': this.grupos };
        switch (this.grupos.length) {
          case 2:
            this.style_columna = "ui-g-12 ui-md-6 ui-lg-6";
            break;
          case 3:
            this.style_columna = "ui-g-12 ui-md-6 ui-lg-4";
            break;
          case 4:
            this.style_columna = "ui-g-12 ui-md-6 ui-lg-3";
            break;
          default:
            this.style_columna = "ui-g-12 ui-md-6 ui-lg-4";
            this.rowGroup = [];
            if (this.grupos.length > 6) {
              this.rows = Math.floor(this.grupos.length / 3);
              if(this.grupos.length > this.rows * 3)
                this.rows += 1;
              for (let index = 0; index < this.rows; index++) {
                this.rowGroup[index] = { 'fila': index, 'grupo': this.grupos.slice(index * 3, (index + 1) * 3) };
                if(index === this.rows - 1) {
                  this.rowGroup[index] = { 'fila': index, 'grupo': this.grupos.slice(index * 3, this.grupos.length) };
                }
              }
              console.log(this.rowGroup);
            }
            break;
        }
        this.mostrar = 0;
      });
  }

  private initDeportes() {
    this.deporteService.getDeportes(this.eventoId).then(res => {
      this.deportes = res
        .map(item => {
          return {
            value: item.DeporteId,
            label: item.DeporteDescripcion
          };
        })
        .sort((a, b) => String(a.label).localeCompare(String(b.label)));
    });
  }
  private initGeneros() {
    this.generos = [];
    this.conjuntoService.getParametro(3).then(res => {
      this.generos = res.map(item => {
        return {
          value: item.value,
          label: item.label
        };
      });
    });
  }
  private initEquipos() {
    this.equipos = [];

    this.conjuntoService
      .getEquipoSorteoParametro(this.deporte, this.genero, this.eventoId)
      .then(res => {
        this.equipos = res;
      });
  }
  open() {
    this.initLocalStorage();
    window.open(`#/tablero-sorteo`);
  }
  private conexion() {
    console.clear();

    this._connection.invoke("sendSorteo", this.o.qs.group, {
      GrupoId: 0,
      EquipoId: 0,
      eventoId: this.eventoId,
      deporteId: this.deporte,
      genero: this.genero,
      banderas: this.bandera,    
      fila: this.mostrar  
    });
  }
  private initLocalStorage() {
    const data = {
      GrupoId: 0,
      EquipoId: 0,
      eventoId: this.eventoId,
      deporteId: this.deporte,
      genero: this.genero
    };
    localStorage.setItem("sorteo", JSON.stringify(data));
  }
  mostrarDeporte() {
    this.initGrupos();
    this.initEquipos();
    this.conexion();
  }
  selectRow(fila) {
    this.mostrar = fila.fila;
    this.conexion();
  }
  cerrar() {
    this.conjuntoService
      .CreateFixture(this.eventoId, this.deporte, this.genero)
      .then(res => {
        this.mesaje = [];
        this.mesaje.push({ severity: 'success', summary: 'Exito', detail: 'Se cerro correctamente el sorteo' });
      });
  }
}
