import { Routes } from '@angular/router';
import { TablaPosicionesComponent } from '../reportes/tabla-posiciones/tabla-posiciones.component';
import { GeneralComponent } from '../reportes/general/general.component';
import { RolPartidoComponent } from '../reportes/rol-partido/rol-partido.component';
import { ReporteJornadaComponent } from '../reportes/reporte-jornada/reporte-jornada.component';
import { ResumenPartidoComponent } from '../reportes/resumen-partido/resumen-partido.component';
import { RolEncuentroComponent } from '../reportes/rol-encuentro/rol-encuentro.component';
import { RolFixtureComponent } from '../reportes/rol-fixture/rol-fixture.component';


export const ReporteRoutes: Routes = [
  { path: 'tabla-posiciones/:eventoId', component: TablaPosicionesComponent },
  { path: 'general/:eventoId', component: GeneralComponent },
  { path: 'rol-partido/:eventoId', component: RolPartidoComponent },
  { path: 'rol-encuentro/:eventoId', component: RolEncuentroComponent },
  { path: 'resumen-jornadas/:eventoId', component: ReporteJornadaComponent },
  { path: 'resumen-partido/:eventoId/:cronogramaId/:deporte', component: ResumenPartidoComponent },
  { path: 'fixture/:eventoId', component: RolFixtureComponent }
];
