import { Component, OnInit } from '@angular/core';
import { MedalleroService } from '../../../service/conjunto/medallero.service';
import { ConjuntoService } from '../../../service/Conjunto/conjunto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalR, SignalRConnection, IConnectionOptions } from 'ng2-signalr';
import * as urls from '../../../domain/Shared/global';

@Component({
  selector: 'app-marcador',
  templateUrl: './marcador.component.html',
  styleUrls: ['./marcador.component.css'],
  providers: [MedalleroService, ConjuntoService]
})
export class MarcadorComponent implements OnInit {
  data: any[];
  cronogramaId = 0;
  Deporte: string;
  usuarioSocket: any = JSON.parse(sessionStorage.getItem('resu'));
  private _connection: SignalRConnection;
  deporteId = 0;
  golesA = 0;
  golesB = 0;
  NombreEquipo = '';
  NombreParametro = '';
  CompetidorId: 0;
  bandera = '';
  jugador = '';
  persona = 0;
  o: IConnectionOptions = {
    hubName: 'HammerHub',
    qs: {
      name: 'usuario:' + this.usuarioSocket.UsuarioId,
      group: 'encuentro' + this.route.snapshot.params['PlanillaId']
    },
    url: urls.urlSockets
  };

  constructor(
    private medalleroService: MedalleroService,
    private conjuntoService: ConjuntoService,
    private route: ActivatedRoute,
    private activedRoute: ActivatedRoute,
    private _signalR: SignalR
  ) {
    this.data = [
      {
        DelegacionId_A: 0,
        Delegacion_A: '',
        Representacion_A: '',
        Marca_A: 0,
        Marca_B: 0,
        Delegacion_B: '',
        DelegacionId_B: 0,
        Representacion_B: '',
        DeporteId: 0,
        CompetidorAId: 0,
        CompetidorBId: 0,
        logoA: '',
        logoB: ''
      }
    ];
    this.cronogramaId = this.route.snapshot.params['cronogramaId'];
    this.Deporte = this.route.snapshot.params['Deporte'];
    this.deporteId = this.route.snapshot.params['DeporteId'];
  }

  ngOnInit() {
    this.getmarcador();
    this.conectar();
  }
  private getmarcador() {
    this.medalleroService.GetResultadoEncuentro(this.cronogramaId).then(res => {
      this.data = res.map(item => {
        return {
          DelegacionId_A: item.DelegacionId_A,
          Delegacion_A: item.Delegacion_A,
          Representacion_A: item.Representacion_A,
          Marca_A: item.Marca_A,
          Marca_B: item.Marca_B,
          Delegacion_B: item.Delegacion_B,
          DelegacionId_B: item.DelegacionId_B,
          Representacion_B: item.Representacion_B,
          DeporteId: this.deporteId,
          CompetidorAId: item.CompetidorId_A,
          CompetidorBId: item.CompetidorId_B
        };
      });
      this.conectar();
    });
  }
  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {
      const listener = c.listenFor('devuelveVisor');
      const listenerSuceso = c.listenFor('upSuceso');
      listener.subscribe(data => {
        this.data[0].Delegacion_A = data['equipoA'];
        this.data[0].Delegacion_B = data['equipoB'];
        this.data[0].logoA = data['logoA'];
        this.data[0].logoB = data['logoB'];
        this.data[0].Marca_A = data['totalPuntosA'];
        this.data[0].Marca_B = data['totalPuntosB'];
      });
      listenerSuceso.subscribe(data => {
        console.clear();
        console.log(data);
        this.NombreEquipo = data['NombreEquipo'];
        this.NombreParametro = data['NombreParametro'];
        this.CompetidorId = data['CompetidorId'];
        this.persona = data['SucesoPersona']['PlanillaPersonaId'];

        this.conjuntoService.getDelegacion(this.CompetidorId).then(res => {
          this.bandera = '/assets/banderas/' + res + '.png';
          this.conjuntoService.getNombrePersona(this.persona).then(info => {
            if (info[0] !== undefined) {
              this.jugador = info[0].NombreCorto;
            } else {
              this.jugador = '';
            }
          });
        });
      });
    });
  }
  private getGoles(competidorA, competidorB, deporte) {
    this.conjuntoService
      .getGoles(this.cronogramaId, competidorA, deporte)
      .then(res => {
        this.data[0].Marca_A = res.length;
      });

    this.conjuntoService
      .getGoles(this.cronogramaId, competidorB, deporte)
      .then(res => {
        this.data[0].Marca_B = res.length;
      });
  }
}
