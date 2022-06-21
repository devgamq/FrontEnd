import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BreadcrumbModule, MenuItem } from 'primeng/primeng';
import 'rxjs/Rx';
import { GruposService } from '../../../../service/Golf/grupos.service';
import { GolfGrupos } from '../../../../domain/Golf/grupos';
import { JornadaDropDown } from '../../jornada-golf/jornada-dropdown/jornada-dropdown.component';
import { CategoriaDropDown } from '../../categoria-golf/categoria-dropdown/categoria-dropdown.component';
import { StepsComponent } from '../../../components/steps/steps.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tarjeta-listado',
    templateUrl: './tarjeta-listado.component.html',
    // tslint:disable-next-line:max-line-length
    styles: ['.buscador{ width:200px!important;    color: #ffffff;}.buscador label{color: #ffffff;}.back-to-top {position: fixed;bottom: 2em;right: 0px; z-index:1000;}'],
    providers: [GruposService]
})
// tslint:disable-next-line:component-class-suffix
export class TarjetaListado implements OnInit {
    eventoId: number;
    grupos: GolfGrupos[];
    grupo: GolfGrupos;
    jornadaId: number;
    categoriaId: number;
    crumb: MenuItem[];
    jugadas: any;
    vButton = false;
    constructor(private grupoService: GruposService, private activedRoute: ActivatedRoute, private router: Router) {
        this.eventoId = +this.activedRoute.snapshot.params['eventoId'];
    }

    ngOnInit() {
        this.doLoadCrumb();
    }

    doLoadCrumb() {
        this.crumb = [];
        this.crumb.push({ label: 'Golf' });
        this.crumb.push({ label: 'Listado Tarjetas' });
    }

    doLoadGrupos() {
        this.grupoService
            .getGolfGrupos(this.jornadaId, this.categoriaId)
            .then(res => {
                this.grupos = res;
            });
    }

    onChangeJornada($event) {

        this.jornadaId = $event.jornadaId;
        if (this.jornadaId && this.categoriaId) {
            this.doLoadGrupos();
        }
    }

    onChangeCategoria($event) {
        this.categoriaId = $event.categoriaId;
        if (this.jornadaId && this.categoriaId) {
            this.doLoadGrupos();
        }
    }

    onRowDblclickGrupo($event) {
        this.router.navigate(['/master/detalle-tarjeta', $event.data.GrupoId, this.eventoId, $event.data.Grupo]);
    }
    setPar() {
        this.router.navigate(['/master/detalle-tarjeta', this.jugadas.GrupoId, this.eventoId, this.jugadas.Grupo]);
    }
    onRowSelect($event) {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            this.vButton = true;
        }
    }
    onRowUnselect($event) {
        const userAgent = navigator.userAgent || navigator.vendor;
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            this.vButton = false;
        }
    }
    doReporte() {
        this.grupoService
            .GetDetalleGrupos(this.jornadaId, this.categoriaId, this.eventoId)
            .then(res => {
                window.open(URL.createObjectURL(res));
            });
    }
}
