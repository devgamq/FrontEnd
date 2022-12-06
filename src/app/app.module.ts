import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routes';
import { SignalRModule } from 'ng2-signalr';
import { SignalRConfiguration } from 'ng2-signalr';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { ImageViewerModule } from 'ngx-image-viewer';

import 'rxjs/add/operator/toPromise';

import { ReplacePipe } from './site/shared/help.pipe';

import { AccordionModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { BreadcrumbModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CarouselModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ChipsModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/primeng';
import { SharedModule } from 'primeng/primeng';
import { ContextMenuModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { DataScrollerModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { GalleriaModule } from 'primeng/primeng';
import { GMapModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { LightboxModule } from 'primeng/primeng';
import { ListboxModule } from 'primeng/primeng';
import { MegaMenuModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MenubarModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { MessageModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { OrderListModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import { ProgressBarModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { RatingModule } from 'primeng/primeng';
import { ScheduleModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { SlideMenuModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { TerminalModule } from 'primeng/primeng';
import { TieredMenuModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenu } from './app.menu.component';
import { AppTopBar } from './site/view/components/topbar/tabbar.component';
import { AppFooter } from './app.footer.component';
import { InlineProfileComponent } from './app.profile.component';

import { AuthGuard } from './site/shared/auth.guard';
import { Login } from './site/view/components/login/login.component';
import { MasterPage } from './site/view/components/mastePage/master-page.component';
import { UsuarioListadoComponent } from './site/view/Administracion/usuario/usuario-listado/usuario-listado.component';
import { DetalleUsuarioComponent } from './site/view/Administracion/usuario/usuario-detalle/usuario-detalle.component';
import { UsuarioPrivilegiosComponent } from './site/view/Administracion/usuario/usuario-privilegios/usuario-privilegios.component';

import { StepsComponent } from './site/view/components/steps/steps.component';

import { JornadaGolfComponent } from './site/view/Golf/jornada-golf/jornada-golf.component';
import { JornadaDropDown } from './site/view/Golf/jornada-golf/jornada-dropdown/jornada-dropdown.component';
import { TarjetaListado } from './site/view/Golf/tarjeta/tarjeta-listado/tarjeta-listado.component';
import { TarjetaJugada } from './site/view/Golf/tarjeta/tarjeta-jugada/tarjeta-jugada.component';

import { DetalleTarjeta } from './site/view/Golf/tarjeta/tarjeta-detalle/tarjeta-detalle.component';

import { CategoriaGolfComponent } from './site/view/Golf/categoria-golf/categoria-golf.component';
import { ClasificatoriaGolfComponent } from './site/view/Golf/clasificatoria-golf/clasificatoria-golf.component';
import { CategoriaDropDown } from './site/view/Golf/categoria-golf/categoria-dropdown/categoria-dropdown.component';

import { GruposGolfComponent } from './site/view/Golf/grupos-golf/grupos-golf.component';
import { CompetidorGolfComponent } from './site/view/Golf/competidor-golf/competidor-golf.component';
import { CellBgColorComponent } from './site/view/Golf/clasificatoria-golf/cell-bg-color/cell-bg-color.component';
import { LeyendaColorComponent } from './site/view/Golf/clasificatoria-golf/leyenda-color/leyenda-color.component';
import { ResultadosFinalesComponent } from './site/view/Golf/resultados-finales/resultados-finales.component';
import { GolfDetalleCompetidorComponent } from './site/view/Golf/golf-detalle-competidor/golf-detalle-competidor.component';
// tslint:disable-next-line:max-line-length
import { AcreditacionDatosPersonalesComponent } from './site/view/Acreditacion/acreditacion-datos-personales/acreditacion-datos-personales.component';
import { PrivilegiosAcreditacionComponent } from './site/view/Acreditacion/privilegios-acreditacion/privilegios-acreditacion.component';
import { GridResultadosComponent } from './site/view/Golf/clasificatoria-golf/grid-resultados/grid-resultados.component';
import { VisorComponent } from './site/view/Golf/clasificatoria-golf/visor/visor.component';

import { FormularioAcreditacionComponent } from './site/view/Acreditacion/acreditacion-formulario/acreditacion-formulario.component';
import { WebcamComponent } from './site/view/components/multimedia/webcam/webcam.component';
// tslint:disable-next-line:max-line-length
import { ReporteCredencialComponent } from './site/view/Acreditacion/acreditacion-reporte-credencial/acreditacion-reporte-credencial';
import { DetallePersonaAcreditacionComponent } from './site/view/Acreditacion/detalle-persona-acreditacion/detalle-persona-acreditacion.component';
import { AcreditacionDetalleComponent } from './site/view/Acreditacion/acreditacion-detalle/acreditacion-detalle.component';
// tslint:disable-next-line:max-line-length
import { AcreditacionInscripcionEventoComponent } from './site/view/Acreditacion/acreditacion-inscripcion-evento/acreditacion-inscripcion-evento.component';
// tslint:disable-next-line:max-line-length
import { ControlVisorComponent } from './site/view/Golf/clasificatoria-golf/control-visor/control-visor.component';

// tslint:disable-next-line:max-line-length
import { AcreditacionDeporteComponent } from './site/view/Acreditacion/accreditationSteps/acreditacion-deporte/acreditacion-deporte.component';
import { AcreditacionPruebaComponent } from './site/view/Acreditacion/accreditationSteps/acreditacion-prueba/acreditacion-prueba.component';
import { AcreditacionTipoComponent } from './site/view/Acreditacion/accreditationSteps/acreditacion-tipo/acreditacion-tipo.component';
// tslint:disable-next-line:max-line-length
import { AcreditacionSexoComponent } from './site/view/Acreditacion/accreditationSteps/acreditacion-sexo/acreditacion-sexo.component';
import { CardDeporteComponent } from './site/view/Acreditacion/accreditationSteps/card-deporte/card-deporte.component';
// tslint:disable-next-line:max-line-length
import { DelegacionDropdownComponent } from './site/view/Acreditacion/acreditacion-inscripcion-evento/delegacion-dropdown/delegacion-dropdown.component';
import { UsersListComponent } from './site/view/Administracion/usuario/users-list/users-list.component';
import { UserPassComponent } from './site/view/Administracion/usuario/user-pass/user-pass.component';
import { GridMovilComponent } from './site/view/Golf/clasificatoria-golf/grid-movil/grid-movil.component';
import { VisorHoyosComponent } from './site/view/Golf/clasificatoria-golf/visor-hoyos/visor-hoyos.component';
import { CronogramaConjuntoComponent } from './site/component/grilla/cronograma-conjunto/cronograma-conjunto.component';
import { CronometroComponent } from './site/component/widgets/cronometro/cronometro.component';
import { InscripcionJugadoresComponent } from './site/component/widgets/inscripcion-jugadores/inscripcion-jugadores.component';
import { InscripcionAddComponent } from './site/component/widgets/inscripcion-add/inscripcion-add.component';
import { DeportesComponent } from './site/component/dropdown/deportes/deportes.component';
import { UsuarioRegistroComponent } from './site/view/Administracion/usuario/usuario-registro/usuario-registro.component';
import { LeyendaColorMovilComponent } from './site/view/Golf/clasificatoria-golf/leyenda-color-movil/leyenda-color-movil.component';
import { VisorMovilComponent } from './site/view/Golf/clasificatoria-golf/visor-movil/visor-movil.component';
import { MarcadorEventoComponent } from './site/view/Futbol/marcador-evento/marcador-evento.component';
import { AutocompleteComponent } from './site/component/searchpersona/autocomplete/autocomplete.component';
import { DialogoConjuntoComponent } from './site/component/dialogo/dialogo-conjunto/dialogo-conjunto.component';
import { BotonConjuntoComponent } from './site/component/boton/boton-conjunto/boton-conjunto.component';
import { PlanillaComponent } from './site/view/Futbol/planilla/planilla.component';
import { BuscarPersonaComponent } from './site/component/searchpersona/buscar-persona/buscar-persona.component';
import { CambioJugadorComponent } from './site/view/Futbol/cambio-jugador/cambio-jugador.component';
import { EventoEncuentroComponent } from './site/view/Futbol/evento-encuentro/evento-encuentro.component';
import { ControlSwitchComponent } from './site/component/screen/control-switch/control-switch.component';
import { ScreenSwitchComponent } from './site/component/screen/screen-switch/screen-switch.component';
import { CronometroPanelComponent } from './site/component/widgets/cronometro-panel/cronometro-panel.component';
import { CronometroEditComponent } from './site/component/widgets/cronometro-edit/cronometro-edit.component';
import { TableroComponent } from './site/component/widgets/tablero/tablero.component';
import { MedalleroComponent } from './site/component/widgets/medallero/medallero.component';
import { PodioComponent } from './site/component/widgets/podio/podio.component';
import { PodioDeporteComponent } from './site/component/widgets/podio-deporte/podio-deporte.component';
import { TableroPanelComponent } from './site/component/widgets/tablero-panel/tablero-panel.component';
import { PantallaSwitchComponent } from './site/component/screen/pantalla-switch/pantalla-switch.component';
import { RelojComponent } from './site/component/widgets/reloj/reloj.component';
import { ClimaComponent } from './site/component/widgets/clima/clima.component';
import { TablaPartidoComponent } from './site/component/widgets/tabla-partido/tabla-partido.component';
import { MedalleroAtletismoComponent } from './site/component/widgets/medallero-atletismo/medallero-atletismo.component';
import { MedalleroAtletismoAddComponent } from './site/component/widgets/medallero-atletismo-add/medallero-atletismo-add.component';
import { DeportesIndividualComponent } from './site/view/individual/deportes-individual/deportes-individual.component';
import { TempoAddComponent } from './site/component/widgets/tempo-add/tempo-add.component';
import { SorteoConfigComponent } from './site/view/Futbol/sorteo-config/sorteo-config.component';
import { SorteoGrupoComponent } from './site/view/Futbol/sorteo-grupo/sorteo-grupo.component';
import { SorteoComponent } from './site/component/widgets/sorteo/sorteo.component';
import { GridClasificatorioComponent } from './site/view/Golf/clasificatoria-golf/grid-clasificatorio/grid-clasificatorio.component';
import { FormularioComponent } from './site/view/AcreditacionV2/formulario/formulario.component';
import { DetalleComponent } from './site/view/AcreditacionV2/formulario/detalle/detalle.component';
import { PerfilAlumnoComponent } from './site/component/widgets/perfil-alumno/perfil-alumno.component';
import { ResumenJornadaComponent } from './site/component/widgets/resumen-jornada/resumen-jornada.component';
import { CronometroCodesurComponent } from './site/component/widgets/cronometro-codesur/cronometro-codesur.component';
import { PanelCodesurComponent } from './site/component/widgets/panel-codesur/panel-codesur.component';
import { ControlCodesurComponent } from './site/component/screen/control-codesur/control-codesur.component';
import { MarcasIndividualesComponent } from './site/component/widgets/marcas-individuales/marcas-individuales.component';
import { MarcadorConjuntoComponent } from './site/view/Futbol/marcador-conjunto/marcador-conjunto.component';
import { BotonJugadorComponent } from './site/component/boton-jugador/boton-jugador.component';
import { CronogramasComponent } from './site/view/Deportes/cronogramas/cronogramas.component';
import { MedalleroConjuntoComponent } from './site/view/Futbol/medallero-conjunto/medallero-conjunto.component';
import { TablaPosicionesComponent } from './site/view/reportes/tabla-posiciones/tabla-posiciones.component';
import { GeneralComponent } from './site/view/reportes/general/general.component';
import { RolPartidoComponent } from './site/view/reportes/rol-partido/rol-partido.component';
import { PipeFechaComponent } from './site/view/reportes/pipe-fecha/pipe-fecha.component';
import { ResumenPartidoComponent } from './site/view/reportes/resumen-partido/resumen-partido.component';
import { ReporteJornadaComponent } from './site/view/reportes/reporte-jornada/reporte-jornada.component';
import { BuscarCompetidorComponent } from './site/component/buscar-competidor/buscar-competidor.component';
import { DeportesAcreditacionComponent } from './site/view/AcreditacionV3/deportes-acreditacion/deportes-acreditacion.component';
// tslint:disable-next-line:max-line-length
import { BotonDeporteAcreditacionComponent } from './site/view/AcreditacionV3/boton-deporte-acreditacion/boton-deporte-acreditacion.component';
import { PmenuComponent } from './site/view/pmenu/pmenu.component';
import { MarcadorComponent } from './site/component/widgets/marcador/marcador.component';
import { AlineacionComponent } from './site/component/widgets/alineacion/alineacion.component';

import { ObtenerTicketComponent } from './site/view/Ticket-print/ObtenerTicket.component';
import { MirarTicketComponent } from './site/view/Mirartkt/MirarTicket.component';
import { AtencionClienteComponent } from './site/view/Atc/AtencionCliente.component';
import { VersusComponent } from './site/component/widgets/versus/versus.component';
import { RolEncuentroComponent } from './site/view/reportes/rol-encuentro/rol-encuentro.component';
import { ResumenVersusComponent } from './site/component/widgets/resumen-versus/resumen-versus.component';
import { GrupoComponent } from './site/view/Deportes/grupo/grupo.component';

import { NuevoEquipoComponent } from './site/view/Equipos/nuevo-equipo/nuevo-equipo.component';
import { SaveEquipoComponent } from './site/view/Equipos/save-equipo/save-equipo.component';
import { InscripcionEquiposComponent } from './site/view/Equipos/inscripcion-equipos/inscripcion-equipos.component';
import { VisorJornadasComponent } from './site/view/Golf/clasificatoria-golf/visor-jornadas/visor-jornadas.component';
// tslint:disable-next-line:max-line-length
import { VisorJornadasDeporteComponent } from './site/view/Golf/clasificatoria-golf/visor-jornadas-deporte/visor-jornadas-deporte.component';
import { VisorGruposComponent } from './site/view/Golf/clasificatoria-golf/visor-grupos/visor-grupos.component';
import { VisorPieComponent } from './site/view/Golf/clasificatoria-golf/visor-pie/visor-pie.component';
import { MarcadorSquashComponent } from './site/view/Deportes/marcador-squash/marcador-squash.component';
import { TableroSquashComponent } from './site/view/Deportes/tablero-squash/tablero-squash.component';
import { MarcadorBalonmanoComponent } from './site/view/Deportes/marcador-balonmano/marcador-balonmano.component';
import { TableroBalonmanoComponent } from './site/view/Deportes/tablero-balonmano/tablero-balonmano.component';
import { VisorPronosticoComponent } from './site/view/visor-pronostico/visor-pronostico.component';
import { CronogramaIndividualComponent } from './site/view/individual/cronograma-individual/cronograma-individual.component';
// tslint:disable-next-line:max-line-length
import { NuevoCronogramaIndividualComponent } from './site/view/individual/nuevo-cronograma-individual/nuevo-cronograma-individual.component';
import { TableroBadmintonComponent } from './site/view/Deportes/tablero-badminton/tablero-badminton.component';
import { TableroTenisMesaComponent } from './site/view/Deportes/tablero-tenis-mesa/tablero-tenis-mesa.component';

import { CronometroBalonmanoDComponent } from './site/component/widgets/cronometro-balonmano-d/cronometro-balonmano-d.component';
import { CronometroBalonmanoComponent } from './site/component/widgets/cronometro-balonmano/cronometro-balonmano.component';
import { TableroPelotaVascaComponent } from './site/view/Deportes/tablero-pelota-vasca/tablero-pelota-vasca.component';
import { RegistroCompeticionComponent } from './site/view/ecuestre/registro-competicion/registro-competicion.component';
import { PunteoLeccionesComponent } from './site/view/ecuestre/punteo-lecciones/punteo-lecciones.component';
import { CronogramaTaComponent } from './site/view/tiro-arco/cronograma-ta/cronograma-ta.component';
import { MarcadorTiroArcoComponent } from './site/view/tiro-arco/marcador-tiro-arco/marcador-tiro-arco.component';
import { CompetidorTaComponent } from './site/view/tiro-arco/competidor-ta/competidor-ta.component';
import { PeriodoTaComponent } from './site/view/tiro-arco/periodo-ta/periodo-ta.component';
import { PuntajeComponent } from './site/view/tiro-arco/puntaje/puntaje.component';
import { SetTotalTaComponent } from './site/view/tiro-arco/set-total-ta/set-total-ta.component';
import { TableroTiroArcoComponent } from './site/view/tiro-arco/tablero-tiro-arco/tablero-tiro-arco.component';

import { MarcadorWaterPoloComponent } from './site/view/Deportes/marcador-water-polo/marcador-water-polo.component';
import { TableroWaterPoloComponent } from './site/view/Deportes/tablero-water-polo/tablero-water-polo.component';
import { CronometroWaterPoloComponent } from './site/component/widgets/cronometro-water-polo/cronometro-water-polo.component';
import { CronometroWaterPoloDComponent } from './site/component/widgets/cronometro-water-polo-d/cronometro-water-polo-d.component';
import { MarcasJornadaComponent } from './site/component/widgets/marcas-jornada/marcas-jornada.component';
import { SportTimingComponent } from './site/component/widgets/sport-timing/sport-timing.component';
import { PushComponent } from './site/component/push/push.component';
import { CiclismoComponent } from './site/component/maps/ciclismo/ciclismo.component';
import { JornadaCiclismoComponent } from './site/component/ciclismo/jornada-ciclismo/jornada-ciclismo.component';
import { TableroRaquetbolComponent } from './site/view/Deportes/tablero-raquetbol/tablero-raquetbol.component';
import { ControlVisorDeporteComponent } from './site/view/Golf/clasificatoria-golf/control-visor-deporte/control-visor-deporte.component';
import { RolFixtureComponent } from './site/view/reportes/rol-fixture/rol-fixture.component';
import { ListAthletesComponent } from './site/view/frog/list-athletes/list-athletes.component';
import { AddAthletesComponent } from './site/view/frog/add-athletes/add-athletes.component';


export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'testHub';
  c.qs = { name: 'donald' };
  c.url = 'http://localhost:61428';
  c.logging = true;
  return c;
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    HttpModule,
    SignalRModule.forRoot(createConfig),
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MessageModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    NguiAutoCompleteModule,
    ImageViewerModule.forRoot({
      btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
        zoomIn: 'fa fa-plus',
        zoomOut: 'fa fa-minus',
        rotateClockwise: 'fa ui-icon-refresh',
        rotateCounterClockwise: 'fa ui-icon-replay',
        next: 'fa fa-arrow-right',
        prev: 'fa fa-arrow-left',
        fullscreen: 'fa ui-icon-zoom-out-map',
      },
      btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: true,
        prev: true
      }
    })
  ],
  declarations: [
    ReplacePipe,
    AppComponent,
    AppMenuComponent,
    AppSubMenu,
    AppTopBar,
    AppFooter,
    InlineProfileComponent,
    Login,
    MasterPage,
    JornadaGolfComponent,
    CategoriaGolfComponent,
    TarjetaListado,
    JornadaDropDown,
    GruposGolfComponent,
    ClasificatoriaGolfComponent,
    CategoriaDropDown,
    CompetidorGolfComponent,
    CellBgColorComponent,
    LeyendaColorComponent,
    DetalleTarjeta,
    TarjetaJugada,
    ResultadosFinalesComponent,
    GolfDetalleCompetidorComponent,
    AcreditacionDatosPersonalesComponent,
    PrivilegiosAcreditacionComponent,
    StepsComponent,
    FormularioAcreditacionComponent,
    GridResultadosComponent,
    VisorComponent,
    WebcamComponent,
    ReporteCredencialComponent,
    DetallePersonaAcreditacionComponent,
    AcreditacionDetalleComponent,
    UsuarioListadoComponent,
    DetalleUsuarioComponent,
    UsuarioPrivilegiosComponent,
    AcreditacionInscripcionEventoComponent,
    ControlVisorComponent,
    AcreditacionDeporteComponent,
    AcreditacionPruebaComponent,
    AcreditacionTipoComponent,
    AcreditacionSexoComponent,
    CardDeporteComponent,
    DelegacionDropdownComponent,
    UsersListComponent,
    UserPassComponent,
    GridMovilComponent,
    VisorHoyosComponent,
    UsuarioRegistroComponent,
    LeyendaColorMovilComponent,
    VisorMovilComponent,
    MarcadorEventoComponent,
    AutocompleteComponent,
    DialogoConjuntoComponent,
    BotonConjuntoComponent,
    CronogramaConjuntoComponent,
    CronometroComponent,
    InscripcionJugadoresComponent,
    InscripcionAddComponent,
    DeportesComponent,
    PlanillaComponent,
    BuscarPersonaComponent,
    CambioJugadorComponent,
    EventoEncuentroComponent,
    ScreenSwitchComponent,
    ControlSwitchComponent,
    CronometroPanelComponent,
    CronometroEditComponent,
    TableroComponent,
    MedalleroComponent,
    PodioComponent,
    PodioDeporteComponent,
    TableroPanelComponent,
    PantallaSwitchComponent,
    RelojComponent,
    ClimaComponent,
    TablaPartidoComponent,
    MedalleroAtletismoComponent,
    MedalleroAtletismoAddComponent,
    DeportesIndividualComponent,
    TempoAddComponent,
    SorteoComponent,
    SorteoConfigComponent,
    SorteoGrupoComponent,
    GridClasificatorioComponent,
    FormularioComponent,
    DetalleComponent,
    PerfilAlumnoComponent,
    ResumenJornadaComponent,
    CronometroCodesurComponent,
    CronometroBalonmanoComponent,
    CronometroBalonmanoDComponent,
    PanelCodesurComponent,
    ControlCodesurComponent,
    MarcadorConjuntoComponent,
    BotonJugadorComponent,
    MarcasIndividualesComponent,
    CronogramasComponent,
    MedalleroConjuntoComponent,
    TablaPosicionesComponent,
    GeneralComponent,
    RolPartidoComponent,
    PipeFechaComponent,
    ResumenPartidoComponent,
    ReporteJornadaComponent,
    BuscarCompetidorComponent,
    PipeFechaComponent,
    DeportesAcreditacionComponent,
    BotonDeporteAcreditacionComponent,
    PmenuComponent,
    MarcadorComponent,
    AlineacionComponent,
    ObtenerTicketComponent,
    MirarTicketComponent,
    AtencionClienteComponent,
    PmenuComponent,
    VersusComponent,
    RolEncuentroComponent,
    ResumenVersusComponent,
    GrupoComponent,
    NuevoEquipoComponent,
    SaveEquipoComponent,
    InscripcionEquiposComponent,
    VisorJornadasComponent,
    VisorJornadasDeporteComponent,
    VisorGruposComponent,
    VisorPieComponent,
    MarcadorSquashComponent,
    TableroSquashComponent,
    MarcadorBalonmanoComponent,
    TableroBalonmanoComponent,
    VisorPronosticoComponent,
    CronogramaIndividualComponent,
    NuevoCronogramaIndividualComponent,
    TableroBadmintonComponent,
    TableroTenisMesaComponent,
    TableroPelotaVascaComponent,
    RegistroCompeticionComponent,
    PunteoLeccionesComponent,
    CronogramaTaComponent,
    MarcadorTiroArcoComponent,
    CompetidorTaComponent,
    PeriodoTaComponent,
    PuntajeComponent,
    SetTotalTaComponent,
    TableroTiroArcoComponent,
    MarcadorWaterPoloComponent,
    TableroWaterPoloComponent,
    CronometroWaterPoloComponent,
    CronometroWaterPoloDComponent,
    MarcasJornadaComponent,
    SportTimingComponent,
    PushComponent,
    CiclismoComponent,
    JornadaCiclismoComponent,
    TableroRaquetbolComponent,
    ControlVisorDeporteComponent,
    RolFixtureComponent,
    ListAthletesComponent,
    AddAthletesComponent
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
