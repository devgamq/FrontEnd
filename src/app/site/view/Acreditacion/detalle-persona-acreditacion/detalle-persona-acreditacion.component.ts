import { Component, OnInit, Output, Input, EventEmitter, ɵConsole } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { DetallePersona } from '../../../domain/Acreditacion/detallePersona';
import { DetallePersonaService } from '../../../service/Acreditacion/detalle-persona.service';
import { DataListModule } from 'primeng/primeng';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as fs from 'fs'


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
    pat: string;
    @Input() EventoId: number;
    @Input() PersonaId: number;
    
    @Output() DetalleAcrOutput = new EventEmitter();

    constructor(
        private http: Http,
        private detallePersonaService: DetallePersonaService, 
        public domSanitizer: DomSanitizer) { }

    ngOnInit() {
        console.log('Id',this.PersonaId);
        console.log('evento:', this.EventoId);
        this.pat="M";
        this.Sexo="masculino";
        this.foto = 'data:image/png;base64,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';
        this.doGetDetallAcreditacionPersona();
        
            
            
              
        
    }

    doGetDetallAcreditacionPersona() {
        this.detallePersonaService
            .getDetalleAcreditacionPersona(this.PersonaId)
            .then(res => {
                if (res)
                {this.detalle = res;
                this.fotof= res[0].FotoUrl;
                if (this.fotof.length<200)
                    this.fotof= this.foto;
                this.pat=this.PersonaId+".png"
                if (this.PersonaId>=193910)
                   { this.fotof=this.pat
                     console.log('imagen es :', this.pat)    
                   } 

                console.log('datos: ', this.detalle);
                console.log('foto : ', this.fotof);
                }
            });
    }
    public getSanitizeUrl(url : string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
      }

    /*doGetFotografia() {
     console.log('el carnet es: ', this.pat)
        this.detallePersonaService.getFoto(this.pat)
            .then(res => {
                this.fotof = res;
                //this.fotof= "assets/fotos/"+this.foto;
                //console.log('foto', this.foto);
                console.log('url', this.fotof);
                
            });

            
    }*/
}
