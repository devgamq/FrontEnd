
import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AcreditacionService } from '../../../service/Acreditacion/acreditacion.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'reporte-credencial',
    templateUrl: './acreditacion-reporte-credencial.html',
    providers: [AcreditacionService]
})
export class ReporteCredencialComponent implements OnInit {
    @Input() personaId: number;
    @Input() eventoId: number;
    url;
    constructor(private domSanitizer: DomSanitizer,
        private acreditacionService: AcreditacionService,
        private activedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.acreditacionService
            .getAcreditacionCredencial(this.personaId, this.eventoId)
            .then(res => {
                this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
            });
    }
}
