import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { JornadaService } from '../../../service/Golf/jornada.service';
import { HoyoPar } from '../../../domain/Golf/hoyoPar';
import { CategoriaDropDown } from '../categoria-golf/categoria-dropdown/categoria-dropdown.component';
import { JornadaDropDown } from '../jornada-golf/jornada-dropdown/jornada-dropdown.component';
import { LeyendaColorComponent } from './leyenda-color/leyenda-color.component';
import { LeyendaColorMovilComponent } from './leyenda-color-movil/leyenda-color-movil.component';
import { Observable } from 'rxjs/Observable';
import { DropdownModule } from 'primeng/primeng';
import { CellBgColorComponent } from './cell-bg-color/cell-bg-color.component';
import { GridResultadosComponent } from './grid-resultados/grid-resultados.component';
import { GolfService } from '../../../service/Golf/golf.service';
import 'rxjs/Rx';


@Component({
    selector: 'app-clasificatoria-golf',
    templateUrl: './clasificatoria-golf.component.html',
    styleUrls: ['./clasificatoria-golf.component.css'],
    providers: [JornadaService, GolfService]
})
export class ClasificatoriaGolfComponent implements OnInit, AfterViewInit {

    clasificatorias: string[];
    hoyoPar: HoyoPar[];
    eventoId: number;
    buttons: boolean;
    jornadaId: number;
    categoriaId: number;
    stateLoad = false;
    jornada: string;
    categoria: string;
    cols: any[] = [];
    bandera:Boolean;
    DelegacionId:number;
    imageBandera = '/assets/erpHammer/images/logoB.png';

    leyendaGrid: string;

    connection;
    constructor(
        private jornadaService: JornadaService,
        private activedRoute: ActivatedRoute,
        private router: Router,
        private golfService: GolfService
        , private domSanitizer: DomSanitizer
    ) {
        this.eventoId = this.activedRoute.snapshot.params['eventoId'];
        this.buttons = this.activedRoute.snapshot.params['buttons'] === '1';

        //    this.eventoId = 2;
    }

    ngOnInit() {
        this.leyendaGrid = 'leyendaGrid' ;
    }

    ngAfterViewInit() {
        this.doGetHoyoPar();
    }
    doGetHoyoPar() {
        this.jornadaService
            .getHoyoPar(1)
            .then(res => {
                this.hoyoPar = res;
                this.doGetClasificatorias();
                this.stateLoad = true;
            });
    }

    doGetClasificatorias() {
        this.jornadaService
            .getClasificatoriaList(this.jornadaId, this.categoriaId)
            .then(res => {
                this.clasificatorias = res;
        
          
                this.cols = [];
          
                  // tslint:disable-next-line:forin
                  for (const key in res['0']) {
                    this.cols.push({ field: key, header: key });
                  }
                  for (let i = 0; i < res.length; i++) {
                    const x = res[`${i}`]['Score'];
                   
                    if (x > 0) {
                      res[`${i}`]['Score'] = `+${x}`;
                    }
                  
                  }

        

                  this.clasificatorias = res;
                  var cantidadDeClaves = Object.keys(res[0]).length;
           
                  if (cantidadDeClaves == 30) {
                    this.bandera = false;
                  
                    
                  } else {
                    this.bandera = true;
                 
                  }
         
               
            });
    }

    handleCategoria($event) {
        this.categoriaId = $event.categoriaId;
        this.categoria = $event.descripcion;

        if (this.stateLoad) {
            if (this.jornadaId && this.categoriaId) {
                this.doGetClasificatorias();
            }
        }
    }

    handleJornada($event) {
        this.jornadaId = $event.jornadaId;
        this.jornada = $event.descripcion;
        if (this.stateLoad) {
            if (this.jornadaId && this.categoriaId) {
                this.doGetClasificatorias();
            }
        }
    }

    doOpenVisor() {
        // this.router.navigate(['/master/golf-Visor', this.jornadaId, this.categoriaId]);
        window.open(`#/visor-golf/${this.eventoId}`);
    }

    doReporte() {
        this.golfService
            .getRptListadoGolf(this.eventoId, this.jornadaId, this.categoriaId, this.jornada, this.categoria)
            .then(res => {
                // let url = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
                window.open(URL.createObjectURL(res));
            });
    }
}
