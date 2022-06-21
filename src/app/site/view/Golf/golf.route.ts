import { Routes } from '@angular/router';
import { JornadaGolfComponent } from '../Golf/jornada-golf/jornada-golf.component';
import { GruposGolfComponent } from '../Golf/grupos-golf/grupos-golf.component';
import { ResultadosFinalesComponent } from '../Golf/resultados-finales/resultados-finales.component';
import { CategoriaGolfComponent } from '../Golf/categoria-golf/categoria-golf.component';
import { ClasificatoriaGolfComponent } from '../Golf/clasificatoria-golf/clasificatoria-golf.component';
// import { VisorComponent } from '../Golf/clasificatoria-golf/visor/visor.component';
import { TarjetaListado } from '../Golf/tarjeta/tarjeta-listado/tarjeta-listado.component';
import { DetalleTarjeta } from '../Golf/tarjeta/tarjeta-detalle/tarjeta-detalle.component';
import { CompetidorGolfComponent } from '../Golf/competidor-golf/competidor-golf.component';
import { GolfDetalleCompetidorComponent } from '../Golf/golf-detalle-competidor/golf-detalle-competidor.component';
// tslint:disable-next-line:max-line-length
import { AcreditacionDatosPersonalesComponent } from '../Acreditacion/acreditacion-datos-personales/acreditacion-datos-personales.component';
import { WebcamComponent } from 'app/site/view/components/multimedia/webcam/webcam.component';
import { ControlVisorComponent } from '../Golf/clasificatoria-golf/control-visor/control-visor.component';


export const GolfRoutes: Routes = [
  { path: 'jornada-golf/:eventoId', component: JornadaGolfComponent },
  { path: 'categoria-golf/:eventoId', component: CategoriaGolfComponent },
  {
    path: 'clasificatoria-golf/:eventoId/:buttons',
    component: ClasificatoriaGolfComponent
  },
  // { path: 'golf-Visor', component: VisorComponent },
  { path: 'grupos-golf/:eventoId', component: GruposGolfComponent },
  {
    path: 'resultados-finales/:eventoId',
    component: ResultadosFinalesComponent
  },
  { path: 'tarjeta/:eventoId', component: TarjetaListado },
  {
    path: 'detalle-tarjeta/:grupoId/:eventoId/:hora',
    component: DetalleTarjeta
  },
  {
    path: 'competidor-golf/:eventoId/:disciplinaId',
    component: CompetidorGolfComponent
  },
  {
    path: 'GolfDetalleCompetidor/:personaId/:eventoId/:disciplinaId',
    component: GolfDetalleCompetidorComponent
  },
  { path: 'control-visor/:eventoId', component: ControlVisorComponent }

];
