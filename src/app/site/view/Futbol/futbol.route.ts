import { Routes } from '@angular/router';
import { CronogramaConjuntoComponent } from '../../component/grilla/cronograma-conjunto/cronograma-conjunto.component';
import { MarcadorEventoComponent } from './marcador-evento/marcador-evento.component';
import { MarcadorConjuntoComponent } from './marcador-conjunto/marcador-conjunto.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { CambioJugadorComponent } from './cambio-jugador/cambio-jugador.component';
import { EventoEncuentroComponent } from './evento-encuentro/evento-encuentro.component';
import { CronometroPanelComponent } from '../../component/widgets/cronometro-panel/cronometro-panel.component';
import { ControlSwitchComponent } from '../../component/screen/control-switch/control-switch.component';
import { CronogramasComponent } from '../../view/Deportes/cronogramas/cronogramas.component';
import { MedalleroConjuntoComponent } from './medallero-conjunto/medallero-conjunto.component';
import { MarcadorSquashComponent } from '../Deportes/marcador-squash/marcador-squash.component';
import { MarcadorBalonmanoComponent } from '../Deportes/marcador-balonmano/marcador-balonmano.component';
import { MarcadorWaterPoloComponent } from '../Deportes/marcador-water-polo/marcador-water-polo.component';

export const FutbolRoutes: Routes = [
  {
    path: 'cronograma/:eventoId/:deporteId/:tipo',
    component: CronogramaConjuntoComponent
  },
  {
    path:
      'marcador-evento/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '3/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  },
  {
    path:
      '23/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '15/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorBalonmanoComponent
  },
  {
    path:
      '17/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorWaterPoloComponent
  },
  {
    path:
      '4/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '5/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  },
  {
    path:
      '57/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  },
  {


    path:
      '40/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  },



  {
    path:
      '17/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '24/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '6/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '56/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '46/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '11/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '27/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '49/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorSquashComponent
  },

  {
    path:
      '13/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  }, {
    path:
      '51/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:tipo',
    component: MarcadorEventoComponent
  },
  {
    path:
      'marcador-conjunto/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId',
    component: MarcadorConjuntoComponent
  },
  {
    path: 'planilla/:eventoId/:deporteId/:PlanillaId/:tipo',
    component: PlanillaComponent
  },
  {
    path: 'cambio/:competidorId/:PlanillaId/:deporteId',
    component: CambioJugadorComponent
  },
  {
    path: 'historial/:planillaId/:deportePeriodoId/:competidorId/:deporteId',
    component: EventoEncuentroComponent
  },
  { path: 'cronometro', component: CronometroPanelComponent },
  { path: 'remote', component: ControlSwitchComponent },
  { path: 'cronogramas/:eventoId', component: CronogramasComponent },
  { path: 'conjuntoMedallero/:eventoId', component: MedalleroConjuntoComponent }
];
