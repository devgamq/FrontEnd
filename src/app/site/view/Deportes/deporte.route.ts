import { Routes } from '@angular/router';
import { GrupoComponent } from '../../view/Deportes/grupo/grupo.component';


export const DeporteRoutes: Routes = [
  {
    path: 'grupo/:eventoId',
    component: GrupoComponent
  }
 
];
