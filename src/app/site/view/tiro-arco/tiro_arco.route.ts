import { Routes } from '@angular/router';
import { CronogramaTaComponent } from '../../view/tiro-arco/cronograma-ta/cronograma-ta.component';
import { MarcadorTiroArcoComponent } from '../../view/tiro-arco/marcador-tiro-arco/marcador-tiro-arco.component';

export const TiroArcoRoutes: Routes = [
    {
        path: 'cronograma_ta/:eventoId/:deporteId',
        component: CronogramaTaComponent
    },
    {
        path: 'marcador_ta/:eventoId/:deporteId',
        component: MarcadorTiroArcoComponent
    }

];
