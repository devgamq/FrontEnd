import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BreadcrumbModule, MenuItem } from 'primeng/primeng';
import 'rxjs/Rx';
import { UsuarioService } from '../../../../service/Shared/usuario.service';
import { Usuario } from '../../../../domain/Shared/usuario.type';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'usuario-listado',
    templateUrl: './usuario-listado.component.html',
    providers: [UsuarioService]
})
export class UsuarioListadoComponent implements OnInit {
    crumb: MenuItem[];
    usuarios: Usuario[];
    usuarioSelected = Usuario;
    constructor(private router: Router, private usuarioService: UsuarioService) {
    }

    ngOnInit() {
        this.doLoadCrumb();
        this.doLoadUsuarios();
    }

    doLoadCrumb() {
        this.crumb = [];
        this.crumb.push({ label: 'Administración' });
        this.crumb.push({ label: 'Listado de Usuarios' });
    }

    doLoadUsuarios() {
        this.usuarioService
            .getUsuarios()
            .then(res => {
                this.usuarios = res;
            });
    }

    handleRowDblclickUsuario($event) {
        this.usuarioSelected = $event.data;
        this.router.navigate(['/master/detalle-usuario', $event.data.UsuarioId]);
    }
}
