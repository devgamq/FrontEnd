import { Routes } from '@angular/router';
import { CronogramaConjuntoComponent } from '../../component/grilla/cronograma-conjunto/cronograma-conjunto.component';
import { CronometroPanelComponent } from '../../component/widgets/cronometro-panel/cronometro-panel.component';
import { ControlSwitchComponent } from '../../component/screen/control-switch/control-switch.component';
import { NuevoEquipoComponent } from '../../view/Equipos/nuevo-equipo/nuevo-equipo.component';
import { SaveEquipoComponent } from '../../view/Equipos/save-equipo/save-equipo.component';
import { InscripcionEquiposComponent } from '../../view/Equipos/inscripcion-equipos/inscripcion-equipos.component';

import { ListAthletesComponent } from '../frog/list-athletes/list-athletes.component';
import { AddAthletesComponent } from '../frog/add-athletes/add-athletes.component';

export const EquipoRoutes: Routes = [
  {
    path: 'nuevoEquipo/:eventoId',
    component: NuevoEquipoComponent
  },
  {
    path: 'inscritos-frog',
    component: ListAthletesComponent
  },
  {
    path: 'add-deportista-frog',
    component: AddAthletesComponent
  },
  {
    path: 'crearEquipo/:eventoId',
    component: SaveEquipoComponent
  },
  {
    path: 'inscripcionEquipos/:eventoId/:equipoId/:deporteId/:delegacionId',
    component: InscripcionEquiposComponent
  }
];
