import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../../service/Shared/usuario.service';
import { Usuario } from '../../../../domain/Shared/usuario.type';
import { ButtonModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'usuario-detalle',
    templateUrl: './usuario-detalle.component.html',
    styleUrls: ['./usuario-detalle.component.css'],
    providers: [UsuarioService]
})
export class DetalleUsuarioComponent implements OnInit {
    usuario: Usuario;
    foto: string;
    checked = true;
    constructor(private router: Router, private usuarioService: UsuarioService, private activedRoute: ActivatedRoute) {
        this.usuario = new Usuario();
        this.usuario.UsuarioId = +this.activedRoute.snapshot.params['usuarioId'];
    }

    ngOnInit() {

        this.foto = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        this.usuarioService.getUsuario(this.usuario.UsuarioId)
            .then(res => {
                this.usuario = res;

            }
            );

        this.doGetFotografia();
    }

    doGetFotografia() {
        this.usuarioService.getFotoPerfil(this.usuario.UsuarioId)
            .then(res => {
                this.foto = res;
            });
    }
    regresar() {
        this.router.navigate(['master/userList/']);
    }
   /*editar()
    {
    
    }*/
}
