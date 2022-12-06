import { BrowserModule } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Input, Output } from '@angular/core';
import { DropdownModule, SelectItem } from 'primeng/primeng';
import { DetallePersonaService } from '../../../service/Acreditacion/detalle-persona.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DetallePersona } from '../../../domain/Acreditacion/detallePersona';
import { Delegacion } from '../../../domain/Acreditacion/delegacion';
import { AcreditacionService } from '../../../service/Acreditacion/acreditacion.service';
import { DelegacionDropdownComponent } from './delegacion-dropdown/delegacion-dropdown.component';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Component({
  selector: 'app-acreditacion-inscripcion-evento',
  templateUrl: './acreditacion-inscripcion-evento.component.html',
  styleUrls: ['./acreditacion-inscripcion-evento.component.css'],
  providers: [DetallePersonaService, AcreditacionService]
})
export class AcreditacionInscripcionEventoComponent implements OnInit {


  eventoId: number;
  inscripcion: DetallePersona[];
  personaId: any;
  delegacionId: number;
  delegacion: string;
  // delegacion: Delegacion[];
  url;

  constructor(
    private http: Http,
    private detallePersonaService: DetallePersonaService,
    private acreditacionService: AcreditacionService,
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.eventoId = +this.route.snapshot.params['eventoId'];
    this.delegacionId = 0;
    this.delegacion = 'Todos';
    //this.doGetInscripcionEventoDelegacion();
    this.doGetInscripcionEvento();
    console.log('Todos inscritos',this.inscripcion);
  }

  doGetInscripcionEvento() {
    this.detallePersonaService
      .getDetalleInscripcionEnvento(this.eventoId)
      .then(res => {
        this.inscripcion = res;
      });
  }

  doGetInscripcionEventoDelegacion() {
    this.detallePersonaService
      .getDetalleInscripcionEnventoDelegacion(this.eventoId, this.delegacionId)
      .then(res => {
        this.inscripcion = res;
      });
  }

  rowDoubleClick($event) {
    console.log('ESteEvento:',this.eventoId, 'Estas persona: ',this.personaId.PersonaId);
    this.router.navigate([`/master/detalle-acreditacion/${this.eventoId}/${this.personaId.PersonaId}`]);
  }

  onChangeDelegacion($event) {
    this.delegacionId = $event.delegacionId;
    this.delegacion = $event.Nombre;
    this.doGetInscripcionEventoDelegacion();
  }

  doGetReporte() {
    this.acreditacionService
      .getAcreditacionInscritos(this.eventoId, this.delegacionId, this.delegacion)
      .then(res => {
        window.open(URL.createObjectURL(res));
      });
  }
}

