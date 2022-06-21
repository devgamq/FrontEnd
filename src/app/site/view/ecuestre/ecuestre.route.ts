import { Routes } from '@angular/router';
import { RegistroCompeticionComponent } from '../../view/ecuestre/registro-competicion/registro-competicion.component';
import { PunteoLeccionesComponent } from '../../view/ecuestre/punteo-lecciones/punteo-lecciones.component';

export const EcuestreRoutes: Routes = [
    {
        path: 'competicion_ecuestre/:eventoId',
        component: RegistroCompeticionComponent
    }
];
