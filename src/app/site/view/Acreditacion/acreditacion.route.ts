import { Routes } from '@angular/router';
import { FormularioAcreditacionComponent } from '../Acreditacion/acreditacion-formulario/acreditacion-formulario.component';
// tslint:disable-next-line:max-line-length
import { AcreditacionDatosPersonalesComponent } from '../Acreditacion/acreditacion-datos-personales/acreditacion-datos-personales.component';
import { PrivilegiosAcreditacionComponent } from '../Acreditacion/privilegios-acreditacion/privilegios-acreditacion.component';
import { ReporteCredencialComponent } from '../Acreditacion/acreditacion-reporte-credencial/acreditacion-reporte-credencial';
import { AcreditacionDetalleComponent } from './acreditacion-detalle/acreditacion-detalle.component';
// tslint:disable-next-line:max-line-length
import { AcreditacionInscripcionEventoComponent } from '../Acreditacion/acreditacion-inscripcion-evento/acreditacion-inscripcion-evento.component';
import { AcreditacionDeporteComponent } from '../Acreditacion/accreditationSteps/acreditacion-deporte/acreditacion-deporte.component';
import { AcreditacionPruebaComponent } from '../Acreditacion/accreditationSteps/acreditacion-prueba/acreditacion-prueba.component';
import { AcreditacionSexoComponent } from '../Acreditacion/accreditationSteps/acreditacion-sexo/acreditacion-sexo.component';
import { AcreditacionTipoComponent } from '../Acreditacion/accreditationSteps/acreditacion-tipo/acreditacion-tipo.component';



export const AcreditacionRoutes: Routes = [
  
    { path: 'formulario-acreditacion/:eventoId', component: FormularioAcreditacionComponent },
    { path: 'DatosPersonales-acreditacion', component: AcreditacionDatosPersonalesComponent },
    { path: 'privilegios-acreditacion', component: PrivilegiosAcreditacionComponent },
    { path: 'reporte-credencial', component: ReporteCredencialComponent },
    { path: 'detalle-acreditacion/:eventoId/:personaId', component: AcreditacionDetalleComponent },
    { path: 'inscripcion-evento/:eventoId', component: AcreditacionInscripcionEventoComponent },
    { path: 'deporte-acreditacion', component: AcreditacionDeporteComponent },
    { path: 'sexo-acreditacion', component: AcreditacionSexoComponent },
    { path: 'tipo-acreditacion', component: AcreditacionTipoComponent },
    { path: 'deporte-acreditacion', component: AcreditacionDeporteComponent },
    { path: 'prueba-acreditacion', component: AcreditacionPruebaComponent }
];
