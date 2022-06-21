import {
    Component, Input, OnInit, EventEmitter, ViewChild, trigger,
    state, transition, style, animate, Inject, forwardRef
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/primeng';
import { AppComponent } from './app.component';
import { Usuario } from './site/domain/Shared/usuario.type';
import { UsuarioService } from './site/service/Shared/usuario.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'inline-profile',
    template: `
        <div class="profile" [ngClass]="{'profile-expanded':active}">
                <div class="fotoPerfil" [ngStyle]="{'background-image':'url(' + foto + ')'}"></div>
            <a href="#" (click)="onClick($event)">
                <span class="profile-name">{{usuario.Usuario}}</span>
                <i class="material-icons">keyboard_arrow_down</i>
            </a>
        </div>

        <ul class="ultima-menu profile-menu" [@menu]="active ? 'visible' : 'hidden'">
            <li role="menuitem">
                <a href="#" class="ripplelink" [attr.tabindex]="!active ? '-1' : null">
                    <i class="material-icons">person</i>
                    <span>Perfil</span>
                </a>
            </li>
            <li role="menuitem">
                <a href="#" class="ripplelink" [attr.tabindex]="!active ? '-1' : null">
                    <i class="material-icons">settings_application</i>
                    <span>Configuraciones</span>
                </a>
            </li>
            <li role="menuitem">
                <a href="#" (click)="closeLoggin()" class="ripplelink" [attr.tabindex]="!active ? '-1' : null">
                    <i class="material-icons">power_settings_new</i>
                    <span>Cerrar Sesi&oacute;n</span>
                </a>
            </li>
            <li role="menuitem">
                <a href="#/master/repass/1"  class="ripplelink" [attr.tabindex]="!active ? '-1' : null">
                    <i class="material-icons">lock</i>
                    <span>Cambiar Contraseña</span>
                </a>
            </li>
        </ul>
    `,
    animations: [
        trigger('menu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ],
    providers: [UsuarioService],
    styleUrls: ['./app.profile.component.css']
})
export class InlineProfileComponent implements OnInit {

    active: boolean;
    usuario: Usuario;
    foto: string;
    constructor(private router: Router, private usuarioService: UsuarioService) {

    }

    ngOnInit() {
        this.foto = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        this.usuario = JSON.parse(sessionStorage.getItem('resu'));
        this.usuarioService.getFotoPerfil(this.usuario.UsuarioId)
            .then(res => {
                this.foto = res;
            });
    }

    closeLoggin() {
        sessionStorage.setItem('resu', '');
        this.router.navigate(['/login']);
        return false;
    }

    onClick(event) {
        this.active = !this.active;
        event.preventDefault();
    }
}
