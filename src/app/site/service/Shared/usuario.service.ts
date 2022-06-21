import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Usuario } from '../../domain/Shared/usuario.type';
import { Menu } from '../../domain/Shared/menu.type';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { TreeModule, TreeNode } from 'primeng/primeng';
import * as urls from '../../domain/Shared/global';
@Injectable()
export class UsuarioService {

    constructor(private http: Http) { }

    verificarPass(id: number, clave: string): Promise<boolean> {
        return this.http
            .get(`${urls.urlSecurity}/api/Security/verificarClave?id=${id}&clave=${clave}`)
            .toPromise()
            .then((r: Response) => r.json() as boolean)
            .catch(this.handleError);
    }
    getUsuariosRegistrados(): Promise<Usuario[]> {
        return this.http
            .get(`${urls.urlSecurity}/api/Security/GetUsuariosRegistrados`)
            .toPromise()
            .then((r: Response) => r.json() as Usuario[])
            .catch(this.handleError);
    }
    getUsuarioRegistrado(usuarioId: number): Promise<Usuario> {
        return this.http
            .get(`${urls.urlSecurity}/api/Security/getUsuario?usuarioId=${usuarioId}`)
            .toPromise()
            .then((r: Response) => r.json() as Usuario)
            .catch(this.handleError);
    }

    getUsuarios(): Promise<Usuario[]> {
        return this.http
            .get(`${urls.urlSecurity}/api/Security/GetUsuarios`)
            .toPromise()
            .then((r: Response) => r.json() as Usuario[])
            .catch(this.handleError);
    }

    getLogin(usuario: string, password: string): Promise<Usuario> {

        return this.http
            .get(`${urls.urlSecurity}/api/Security/GetUsuarioByPassword?usuario=${usuario}&password=${password}`)
            .toPromise()
            .then((r: Response) => r.json() as Usuario)
            .catch(this.handleError);
    }

    getUsuario(usuarioId: number): Promise<Usuario> {
        return this.http
            .get(`${urls.urlSecurity}/api/Security/GetUsuario?usuarioId=${usuarioId}`)
            .toPromise()
            .then((r: Response) => r.json() as Usuario)
            .catch(this.handleError);
    }
    getUsuarioreg(usuarioId: number): Promise<Usuario> {
        return this.http
            .get(`${urls.urlSecurity}/api/Security/GetUsuariorR?usuarioId=${usuarioId}`)
            .toPromise()
            .then((r: Response) => r.json() as Usuario)
            .catch(this.handleError);
    }
    getToc(usuario: string): Observable<any[]> {
        return this.http
            .get(`${urls.urlSecurity}/api/Security/GetListTocs?filename=${usuario}`)
            .map((r: Response) => r.json() as any[]);
    }
    
    //obtener usuario para actualizar
      getUser(usuarioId: number): Observable<Usuario> {
        return this.http
          .get(`${urls.urlSecurity}/api/Security/GetUsuario?usuarioId=${usuarioId}`)
          .map((r: Response) => r.json().data as Usuario);
      }
    updateUser(data: FormGroup): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${urls.urlSecurity}/api/Security/upUser`, data.value, options);
    }
    getMasterRelease(): Observable<string> {

        return this.http
            .get(`${urls.urlSecurity}/api/Security/GetMasterRelease`)
            .map((r: Response) => r.json() as string);
    }

    getFotoPerfil(usuarioId): Promise<string> {
        return this.http
            .get(`${urls.urlSecurity}/api/Security/GetFotoPerfil?usuarioId=${usuarioId}`)
            .toPromise()
            .then((r: Response) => r.json() as string)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
    setJsonPrivilegio(data: any, usuarioId): Observable<Response> {
        let d = '[';
        let ip = 0;
        data.forEach(function (padre: any) {
            if (padre.selected || padre.partialSelection) {
                if (padre.children.length) {

                    // tslint:disable-next-line:max-line-length
                    d = d + '{' + '"label":' + '"' + padre.label + '"' + ',"icon":' + '"' + padre.icon + '"' + ',"partialSelection":' + padre.partialSelection + ',"selected":' + padre.selected + ',"expanded":' + padre.expanded + ',"items":[';
                    let ih = 0;
                    padre.children.forEach(function (hijo: any) {
                        if (hijo.selected) {
                            if (ih === 0) {
                                // tslint:disable-next-line:max-line-length
                                d = d + '{' + '"label":' + '"' + hijo.label + '"' + ',"icon":' + '"' + hijo.icon + '"' + ',"routerLink":' + '["' + hijo.routerLink + '"]' + ',"selected":' + hijo.selected + ',"expanded":' + padre.expanded + '}';
                            } else {

                                // tslint:disable-next-line:max-line-length
                                d = d + ',{' + '"label":' + '"' + hijo.label + '"' + ',"icon":' + '"' + hijo.icon + '"' + ',"routerLink":' + '["' + hijo.routerLink + '"]' + ',"selected":' + hijo.selected + ',"expanded":' + padre.expanded + '}';
                            }
                            ih++;
                        }
                    });

                    if (ip === 0) { d = d + ']}'; } else { d = d + ']},'; }
                    ip++;
                } else {
                    // tslint:disable-next-line:max-line-length
                    d = d + '{' + '"label":' + '"' + padre.label + '"' + ',"icon":' + '"' + padre.icon + '"' + ',"routerLink":' + '["' + padre.routerLink + '"]' + ',"selected":' + padre.selected + ',"expanded":' + padre.expanded + '},';
                    ip++;
                }
            }
        });
        d = d + ']';
        const dataset = { UsuarioId: usuarioId, TOCJson: d }
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${urls.urlSecurity}/api/Security/setJsonPrivilegioUsuario`, dataset, options);
    }

    //M.eliminar Usuario
    deleteUsuario(usuarioId: number): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.delete(
        `${urls.urlSecurity}/api/Security/DeleteUser?usuarioId=${usuarioId}`,
        options
        );
    }
    setPassword(data: FormGroup): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${urls.urlSecurity}/api/Security/SaveNewPass`, data.value, options);
    }
    setUsuario(data: FormGroup): Observable<Response> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(`${urls.urlSecurity}/api/Security/AddUsuario`, data.value, options);
    }




}
