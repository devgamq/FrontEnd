import { Component, OnInit, Output, Input, EventEmitter, ɵConsole } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { DetallePersona } from '../../../domain/Acreditacion/detallePersona';
import { DetallePersonaService } from '../../../service/Acreditacion/detalle-persona.service';
import { DataListModule } from 'primeng/primeng';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-detalle-persona-acreditacion',
    templateUrl: './detalle-persona-acreditacion.component.html',
    styleUrls: ['./detalle-persona-acreditacion.component.css'],
    providers: [DetallePersonaService]
})
export class DetallePersonaAcreditacionComponent implements OnInit {

    detalle: DetallePersona[];
    foto: string;
    fotof: string;
    Sexo: string;

    @Input() PersonaId: number;
    @Output() DetalleAcrOutput = new EventEmitter();

    constructor(
        private http: Http,
        private detallePersonaService: DetallePersonaService, 
        public domSanitizer: DomSanitizer) { }

    ngOnInit() {
        this.Sexo="masculino";
        this.foto = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        this.doGetDetallAcreditacionPersona();
        this.doGetFotografia();
    }

    doGetDetallAcreditacionPersona() {
        this.detallePersonaService
            .getDetalleAcreditacionPersona(this.PersonaId)
            .then(res => {
                this.detalle = res;
                console.log('datos', this.detalle);
            });
    }
    public getSanitizeUrl(url : string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
      }

    doGetFotografia() {
        this.detallePersonaService.getFoto(this.PersonaId, this.Sexo)
            .then(res => {
                this.foto = res;
                this.fotof= "../../../../../../assets/fotos/"+this.foto;
                console.log('foto', this.foto);
                console.log('url', this.fotof);
                
            });
    }
}
