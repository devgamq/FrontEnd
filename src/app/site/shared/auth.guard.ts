import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        try {
            const usuarioActual = JSON.parse(sessionStorage.getItem('resu'));
            if (usuarioActual.UsuarioId > 0) {
                return true;
            }
            this.router.navigate(['/login']);
            return false;
        } catch (e) {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
