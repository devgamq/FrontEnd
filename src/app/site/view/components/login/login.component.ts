import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { MessagesModule, Message } from 'primeng/primeng';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../service/Shared/usuario.service';
import { Usuario } from '../../../domain/Shared/usuario.type';
import { SocketService } from '../../../service/Shared/socket.service';
import 'rxjs/Rx';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UsuarioService, SocketService]
})
// tslint:disable-next-line:component-class-suffix
export class Login implements OnInit {
    msgs: Message[] = [];
    loginForm: FormGroup;
    usuario: Usuario;
    connection;

    constructor(private formBuilder: FormBuilder,
        private http: Http,
        private usuarioService: UsuarioService,
        private router: Router,
        private socket: SocketService) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    doLogin() {
        this.usuarioService.getLogin(this.loginForm.value.userName, this.loginForm.value.password)
            .then(res => {
                this.usuario = res;
                if (this.usuario.UsuarioId > 0) {
                    sessionStorage.setItem('resu', JSON.stringify(this.usuario));
                    if(this.usuario.OficinaId == '0') {
                        this.router.navigate(['/master']);
                    } else {
                        this.router.navigate(['/master/inscritos-frog']);
                    }
                } else {
                    this.msgs = [];
                    this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Error de autentificación' });
                    setTimeout(() => { this.msgs = []; }, 2500);
                }
            }).catch(
            error => {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: 'Error', detail: 'Error de conexión con el servidor' });
                setTimeout(() => { this.msgs = []; }, 2500);
            });
    }
}
