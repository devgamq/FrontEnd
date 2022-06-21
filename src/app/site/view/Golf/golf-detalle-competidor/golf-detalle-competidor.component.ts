import { Component, OnInit } from '@angular/core';
import { Deportista } from '../../../domain/Golf/deportista';
import { ActivatedRoute, Router } from '@angular/router';
import { DeportistaService } from '../../../service/Golf/deportista.service';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GolfService } from '../../../service/Golf/golf.service';

@Component({
    selector: 'app-golf-detalle-competidor',
    templateUrl: './golf-detalle-competidor.component.html',
    styleUrls: ['./golf-detalle-competidor.component.css'],
    providers: [DeportistaService, GolfService]
})
export class GolfDetalleCompetidorComponent implements OnInit {
    eventoId: number;
    personaId: number;
    public depo: String[];
    nombre: string;
    paterno: string;
    materno: string;
    fechaNaci: Date;
    ci: string;
    sexo: string;
    handicp: string;
    categoria: string;
    club: string;
    tablas: string[];
    allTablas: string[];
    disciplinaId: number;

    constructor(private deportistaService: DeportistaService,
        private activedRoute: ActivatedRoute,
        private router: Router,
        private golfService: GolfService) {

        this.eventoId = this.activedRoute.snapshot.params['eventoId'];
        this.personaId = this.activedRoute.snapshot.params['personaId'];
        this.disciplinaId = this.activedRoute.snapshot.params['disciplinaId'];
    }

    ngOnInit() {
        // this.eventoId = 2;
        // this.personaId = 4023;
        this.doGetCompetidore();
        this.doGetResultados();
    }

    doGetCompetidore() {
        this.deportistaService
            .getDeportista(this.personaId)
            .then(res => {
                this.depo = res;
                this.doLlenarDatos(this.depo['0']);
            });
    }

    doGetResultados() {
        this.deportistaService
            .getResultados(this.personaId, this.eventoId)
            .then(res => {
                this.tablas = res;
                this.doGenerateTables(this.tablas);
            });
    }

    doLlenarDatos($envent) {
        this.nombre = $envent.Nombres;
        this.paterno = $envent.Paterno;
        this.materno = $envent.Materno;
        this.fechaNaci = $envent.FechaNacimiento;
        this.ci = $envent.CI;
        this.sexo = $envent.Sexo;
        this.handicp = $envent.Handicap;
        this.categoria = $envent.Descripcion;
        this.club = $envent.Club;
    }

    doGenerateTables($event) {
        this.allTablas = $event;
    }

    doVolver() {
        this.router.navigate(['/master/competidor-golf', this.eventoId, this.disciplinaId]);
    }

    doReporte() {
        this.golfService
            .GetDetallePersonaCompetidor(this.personaId, this.eventoId, this.categoria)
            .then(res => {
                window.open(URL.createObjectURL(res));
            });

    }
}
