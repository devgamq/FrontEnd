import { Routes } from '@angular/router';
import { DeportesIndividualComponent } from './deportes-individual/deportes-individual.component';
import { CronogramaIndividualComponent } from './cronograma-individual/cronograma-individual.component';
import { NuevoCronogramaIndividualComponent } from './nuevo-cronograma-individual/nuevo-cronograma-individual.component';


export const IndividualRoutes: Routes = [
    { path: 'individual/:eventoId/:deporteId', component: CronogramaIndividualComponent },
    {
        path: 'nuevocronogramaindividual/:eventoId/:deporteId/:CronogramaId/:Prueba/:Rama/:Estado',
        component: NuevoCronogramaIndividualComponent
      },
];
