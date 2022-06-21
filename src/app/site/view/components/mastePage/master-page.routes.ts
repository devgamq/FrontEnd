// RouterModule
import { Routes } from '@angular/router';
import { MasterPage } from '../mastePage/master-page.component';
import { Login } from '../login/login.component';
import { AuthGuard } from '../../../shared/auth.guard';
import { GolfRoutes } from '../../Golf/golf.route';
import { AcreditacionRoutes } from '../../Acreditacion/acreditacion.route';
//import { AtencionRoutes } from '../../Atencion/atencion.route';

import { FutbolRoutes } from '../../Futbol/futbol.route';
import { EcuestreRoutes } from '../../ecuestre/ecuestre.route';
import { TiroArcoRoutes } from '../../tiro-arco/tiro_arco.route';
import { EquipoRoutes } from '../../Equipos/equipo.route';
import { ReporteRoutes } from '../../reportes/reporte.route';
import { IndividualRoutes } from '../../individual/individual.route';
import { UsrRoutes } from '../../Administracion/usuario/usr.route';
import { UsuarioListadoComponent } from '../../Administracion/usuario/usuario-listado/usuario-listado.component';
import { DetalleUsuarioComponent } from '../../Administracion/usuario/usuario-detalle/usuario-detalle.component';
import { UsuarioRegistroComponent } from '../../Administracion/usuario/usuario-registro/usuario-registro.component';
import { MedalleroAtletismoAddComponent } from '../../../component/widgets/medallero-atletismo-add/medallero-atletismo-add.component';
import { PantallaSwitchComponent } from '../../../component/screen/pantalla-switch/pantalla-switch.component';
import { SorteoConfigComponent } from '../../../view/Futbol/sorteo-config/sorteo-config.component';
import { BuscarCompetidorComponent } from '../../../component/buscar-competidor/buscar-competidor.component';
import { DeportesAcreditacionComponent } from '../../AcreditacionV3/deportes-acreditacion/deportes-acreditacion.component';
import { DeporteRoutes } from '../../Deportes/deporte.route';
import { ObtenerTicketComponent } from '../../Ticket-print/ObtenerTicket.component';
import { MirarTicketComponent } from '../../Mirartkt/MirarTicket.component';
import { AtencionClienteComponent } from '../../Atc/AtencionCliente.component';
//import { PmenuComponent } from './site/view/pmenu/pmenu.component';

// Declaramos la ruta principal inicio y sus rutas hijas
export const MasterRoutes: Routes = [
  { path: '', redirectTo: 'master', pathMatch: 'full' },
  {
    path: 'master',
    component: MasterPage,
    canActivate: [AuthGuard],
    children: [
      ...GolfRoutes,
      ...AcreditacionRoutes,
      ...FutbolRoutes,
      ...EquipoRoutes,
      ...IndividualRoutes,
      ...UsrRoutes,
      ...ReporteRoutes,
      ...DeporteRoutes,
      ...EcuestreRoutes,
      ...TiroArcoRoutes,
      { path: 'listado-usuarios', component: UsuarioListadoComponent },
      {
        path: 'detalle-usuario/:usuarioId',
        component: DetalleUsuarioComponent
      },
      { path: 'usuario-registro', component: UsuarioRegistroComponent },
      {
        path:
          'pantalla-remote/:eventoId/:deporteId/:parametroRamaId/:grupoid/:pruebaId',
        component: PantallaSwitchComponent
      },
      { path: 'medallero-edit', component: MedalleroAtletismoAddComponent },
      { path: 'sorteo-edit/:eventoId', component: SorteoConfigComponent },
      {
        path: 'buscarCompetidor/:eventoId',
        component: BuscarCompetidorComponent
      },
      {
        path: 'acreditacion-deporte/:eventoId',
        component: DeportesAcreditacionComponent
      },
      {
        path: 'mesa',
        component: AtencionClienteComponent
      },
      {
        path: 'cliente',
        component: MirarTicketComponent
      },
      {
        path: 'obtent',
        component: ObtenerTicketComponent
      }
      
    ]
  }
];
