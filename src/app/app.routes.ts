import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { MasterPage } from './site/view/components/mastePage/master-page.component';
import { Login } from './site/view/components/login/login.component';
import { VisorComponent } from './site/view/Golf/clasificatoria-golf/visor/visor.component';
import { VisorJornadasComponent } from './site/view/Golf/clasificatoria-golf/visor-jornadas/visor-jornadas.component';
// tslint:disable-next-line:max-line-length
import { VisorJornadasDeporteComponent } from './site/view/Golf/clasificatoria-golf/visor-jornadas-deporte/visor-jornadas-deporte.component';
import { MasterRoutes } from './site/view/components/mastePage/master-page.routes';
import { UsersListComponent } from './site/view/Administracion/usuario/users-list/users-list.component';
import { ClasificatoriaGolfComponent } from './site/view/Golf/clasificatoria-golf/clasificatoria-golf.component';
import { CompetidorGolfComponent } from './site/view/Golf/competidor-golf/competidor-golf.component';
import { VisorHoyosComponent } from './site/view/Golf/clasificatoria-golf/visor-hoyos/visor-hoyos.component';
import { VisorGruposComponent } from './site/view/Golf/clasificatoria-golf/visor-grupos/visor-grupos.component';
import { DialogoConjuntoComponent } from './site/component/dialogo/dialogo-conjunto/dialogo-conjunto.component';
import { ScreenSwitchComponent } from './site/component/screen/screen-switch/screen-switch.component';
import { ControlSwitchComponent } from './site/component/screen/control-switch/control-switch.component';
import { PantallaSwitchComponent } from './site/component/screen/pantalla-switch/pantalla-switch.component';
import { TableroComponent } from './site/component/widgets/tablero/tablero.component';
import { MedalleroComponent } from './site/component/widgets/medallero/medallero.component';
import { PanelCodesurComponent } from './site/component/widgets/panel-codesur/panel-codesur.component';
import { PodioComponent } from './site/component/widgets/podio/podio.component';
import { PodioDeporteComponent } from './site/component/widgets/podio-deporte/podio-deporte.component';
import { TableroPanelComponent } from './site/component/widgets/tablero-panel/tablero-panel.component';
import { TablaPartidoComponent } from './site/component/widgets/tabla-partido/tabla-partido.component';
import { MedalleroAtletismoAddComponent } from './site/component/widgets/medallero-atletismo-add/medallero-atletismo-add.component';
import { SorteoComponent } from './site/component/widgets/sorteo/sorteo.component';
import { MedalleroAtletismoComponent } from './site/component/widgets/medallero-atletismo/medallero-atletismo.component';
import { SorteoConfigComponent } from './site/view/Futbol/sorteo-config/sorteo-config.component';


import { FormularioComponent } from './site/view/AcreditacionV2/formulario/formulario.component';
import { ControlCodesurComponent } from './site/component/screen/control-codesur/control-codesur.component';
import { MarcadorComponent } from './site/component/widgets/marcador/marcador.component';
import { AlineacionComponent } from './site/component/widgets/alineacion/alineacion.component';
import { AtencionClienteComponent } from './site/view/Atc/AtencionCliente.component';
/*import { TicketPrintComponent } from '../app/site/view/Ticket-print/Ticket-print.component';
import { MirartktComponent } from './site/view/Mirartkt/Mirartkt.component';
import { AtcComponent } from './site/view/Atc/Atc.component';*/
//import { PmenuComponent } from './site/view/pmenu/pmenu.component';
// tslint:disable-next-line:max-line-length
import { NuevoCronogramaIndividualComponent } from './site/view/individual/nuevo-cronograma-individual/nuevo-cronograma-individual.component';
import { CronogramaConjuntoComponent } from './site/component/grilla/cronograma-conjunto/cronograma-conjunto.component';

import { VisorPronosticoComponent } from './site/view/visor-pronostico/visor-pronostico.component';
import { TableroSquashComponent } from './site/view/Deportes/tablero-squash/tablero-squash.component';
import { TableroBalonmanoComponent } from './site/view/Deportes/tablero-balonmano/tablero-balonmano.component';
import { TableroBadmintonComponent } from './site/view/Deportes/tablero-badminton/tablero-badminton.component';
import { TableroTenisMesaComponent } from './site/view/Deportes/tablero-tenis-mesa/tablero-tenis-mesa.component';
import { TableroPelotaVascaComponent } from './site/view/Deportes/tablero-pelota-vasca/tablero-pelota-vasca.component';
import { TableroTiroArcoComponent } from './site/view/tiro-arco/tablero-tiro-arco/tablero-tiro-arco.component';
import { TableroWaterPoloComponent } from './site/view/Deportes/tablero-water-polo/tablero-water-polo.component';
import { VersusComponent } from './site/component/widgets/versus/versus.component';
import { CiclismoComponent } from './site/component/maps/ciclismo/ciclismo.component';
import { TableroRaquetbolComponent } from './site/view/Deportes/tablero-raquetbol/tablero-raquetbol.component';


export const routes: Routes = [
  ...MasterRoutes,
  { path: 'ciclismo', component: CiclismoComponent },
  { path: 'login', component: Login },
  { path: 'visor-golf/:eventoId', component: VisorComponent },
  { path: 'visor-jornada/:eventoId', component: VisorJornadasComponent },
  { path: 'visor-jornada-deporte/:eventoId', component: VisorJornadasDeporteComponent },
  { path: 'userList', component: UsersListComponent },
  { path: 'nuevocronogramaindividual', component: NuevoCronogramaIndividualComponent },
  { path: 'cronograna-conjunto', component: CronogramaConjuntoComponent },
 /* { path: 'obtent', component: TicketPrintComponent },
  { path: 'mesa', component: AtcComponent },
  { path: 'ver', component: MirartktComponent },
  */

 //{ path: 'mesa', component: AtencionClienteComponent },

  {
    path: 'clasificatoria-golf/:eventoId/:buttons',
    component: ClasificatoriaGolfComponent
  },
  {
    path: 'competidor-golf/:eventoId/:disciplinaId',
    component: CompetidorGolfComponent
  },
  { path: 'score/:eventoId/:buttons', component: VisorHoyosComponent },
  { path: 'dialogo-conjunto', component: DialogoConjuntoComponent },
  { path: 'switch/:screenId', component: ScreenSwitchComponent },
  { path: 'remote', component: ControlSwitchComponent },
  { path: 'visor-pronostico/:eventoId', component: VisorPronosticoComponent },
  { path: 'raquet/:pantallaId', component: TableroRaquetbolComponent },
  {
    path:
      'squash/:pantallaId',
    component: TableroSquashComponent
  },

  {
    path:
      'badminton/:pantallaId',
    component: TableroBadmintonComponent
  },
  {
    path:
      'pelotaVasca/:pantallaId',
    component: TableroPelotaVascaComponent
  },
  {
    path:
      'TenisMesa/:pantallaId',
    component: TableroTenisMesaComponent
  },
  {
    path:
      'tiro_arco/:pantallaId',
    component: TableroTiroArcoComponent
  },
  {
    path:
      't_49/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:equipoA/:equipoB/:pantallaId',
    component: TableroSquashComponent
  },
  {
    path:
      'balonmano/:pantallaId',
    component: TableroBalonmanoComponent
  },
  {
    path:
      't_15/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:equipoA/:equipoB/:pantallaId',
    component: TableroBalonmanoComponent
  },
  {
    path:
      't_26/:eventoId/:deporteId/:cronogramaId/:pantallaId',
    component: VersusComponent
  },

  {
    path:
      't_36/:eventoId/:deporteId/:cronogramaId/:pantallaId',
    component: VersusComponent
  },

  {
    path:
      't_22/:eventoId/:deporteId/:cronogramaId/:pantallaId',
    component: VersusComponent
  },

  {
    path:
      't_41/:eventoId/:deporteId/:cronogramaId/:pantallaId',
    component: VersusComponent
  },

  {
    path:
      't_43/:eventoId/:deporteId/:cronogramaId/:pantallaId',
    component: VersusComponent
  },

  {
    path:
      't_50/:eventoId/:deporteId/:cronogramaId/:pantallaId',
    component: VersusComponent
  },
  {
    path:
      't_17/:idcompetidor1/:idcompetidor2/:PlanillaId/:eventoId/:deporteId/:equipoA/:equipoB/:pantallaId',
    component: TableroWaterPoloComponent
  },

  { path: 'medallero', component: MedalleroComponent },
  { path: 'podio', component: PodioComponent },
  { path: 'podio-deporte', component: PodioDeporteComponent },
  { path: 'panel/:screenId', component: TableroPanelComponent },
  { path: 'panel/:escenarioId/:screenId', component: TableroPanelComponent },
  {
    path:
      'pantalla-remote/:eventoId/:deporteId/:parametroRamaId/:grupoid/:pruebaId',
    component: PantallaSwitchComponent
  },
  { path: 'partidos', component: TablaPartidoComponent },
  { path: 'medallero-edit', component: MedalleroAtletismoAddComponent },
  { path: 'tablero-sorteo', component: SorteoComponent },
  { path: 'tablero-mini', component: MedalleroAtletismoComponent },
  { path: 'sorteo-edit/:eventoId', component: SorteoConfigComponent },

  { path: 'formulario', component: FormularioComponent },
  { path: 'cronometro', component: PanelCodesurComponent },
  { path: 'control-cronometro', component: ControlCodesurComponent },
  {
    path: 'marcas/:cronogramaId/:Deporte/:DeporteId/:PlanillaId',
    component: MarcadorComponent
  },
  {
    path: 'alineacion/:cronogramaId/:eventoId/:DeporteId',
    component: AlineacionComponent
  },
  { path: 'visor_grupo/:eventoId', component: VisorGruposComponent },

 
 // { path: 'Acre', component: PmenuComponent }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
