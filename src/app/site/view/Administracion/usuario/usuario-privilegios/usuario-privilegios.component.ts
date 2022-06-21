import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Menu } from '../../../../domain/Shared/menu.type';
import { UsuarioService } from '../../../../service/Shared/usuario.service';
import { TreeModule, TreeNode } from 'primeng/primeng';
import { Usuario } from '../../../../domain/Shared/usuario.type';
import { BreadcrumbModule, MenuItem } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { Message, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

declare var jQuery: any;
declare var $: any;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'usuario-privilegios',
    templateUrl: './usuario-privilegios.component.html',
    styleUrls: ['./usuario-privilegios.component.css']
})


export class UsuarioPrivilegiosComponent implements OnInit {
    // @Input() menus: Menu[];
    usuario: Usuario;
    master: any[] = [];
    hash = {};
    menu: MenuItem[];
    selectedNodes: any[] = [];
    arreglo: any[] = [];
    listaMenu: any;
    Idusuario: any;
    value = false;
    mensaje: Message[] = [];
    style_titulo: any;
    todo: any;
    constructor(private usuarioService: UsuarioService, private activedRoute: ActivatedRoute) {
        this.todo = 0;
        this.usuario = new Usuario();
        this.Idusuario = this.activedRoute.snapshot.params['usuarioId'];
        this.style_titulo = { width: '400px' };

    }
    ngOnInit() {

        const UsuarioId = this.activedRoute.snapshot.params['usuarioId'];

        if (!this.usuario.UsuarioId) {
            this.usuario.UsuarioId = 0;
        }

        this.usuarioService
            .getMasterRelease()
            .subscribe(res => {
                this.master = JSON.parse(res);

                this.usuarioService
                    .getToc(UsuarioId)
                    // tslint:disable-next-line:no-shadowed-variable
                    .subscribe(res => {
                        this.listaMenu = res;
                        this.listaMenu = JSON.parse(this.listaMenu);

                        this.hash = this.buildDataHierarchy(this.master, this.listaMenu);
                    });
            });
    }
    seleccionar_todo() {
        if (Number(this.todo) === 1) {
            this.master.forEach(node => {
                this.seleccionar(true);
            });
        } else {
            this.seleccionar(false);
        }
        this.updateSelected();
        this.SacarSeleccion();
    }
    private seleccionar(valor: boolean) {
        this.master.forEach(node => {
            node.selected = valor;
            this.seleccionar_hijos(node);

        });
    }
    loadCrumb() {
        this.menu = [];
        this.menu.push({ label: 'Administración' });
        this.menu.push({ label: 'Listado de Usuarios' });
        this.menu.push({ label: 'Detalle de Usuario' });


    }
    buildDataHierarchy(data: any[], tocs: any[]): any {
        let id = 1;
        const hash = {};
        const parentId = 1;
        let i = 0;
        let u = 0;
        // tslint:disable-next-line:prefer-const
        let todoSeleccionado;
        const vacioPadre = 0;
        const vaciohijo = 0;
        let existe;

        // tslint:disable-next-line:no-shadowed-variable
        const setNodeID = (node: any, parentId: number, selec: boolean, p: number, h: number, hp: number) => {

            hash[id] = node;
            if (h === 1) {
                if (tocs) {
                    existe = this.existeElemento(node.label, tocs, h);
                    if (existe.length > 0) {
                        console.log(existe[0].partialSelection);
                        if (existe[0].partialSelection === true) {

                            node['partialSelection'] = true;
                            selec = false;
                        } else {
                            node['partialSelection'] = false;
                            selec = true;
                        }

                    }
                }
            } else
                if (h === 0) {
                    if (tocs) {
                        existe = this.existeElemento(node.label, tocs, h);
                        if (existe.length > 0) {

                            selec = true;
                        }
                    }
                }
            node['selected'] = selec;
            node['nodeId'] = id;
            node['parentNodeId'] = parentId;
            if (node.children.length) {
                // tslint:disable-next-line:no-shadowed-variable
                const parentId = id;
                let u2 = 0;
                // tslint:disable-next-line:no-shadowed-variable
                node.children.forEach(function (node: any) {
                    id++;
                    setNodeID(node, parentId, data[p]['children'][u2]['selected'], p, 0, u2);
                    u2++;
                });
            }
            id++;
            i++;
        };
        data.forEach(function (node: any) {
            setNodeID(node, 0, data[u]['selected'], u, 1, 0);
            u++;
        });
        return hash;
    }

    existeElemento(elemento: any, local: any, tipo: any) {
        let consulta1;
        if (tipo === 1) {
            consulta1 = local.filter(function (c) {
                return c.label === elemento;
            });
        } else
            if (tipo === 0) {
                const submenus = [];


                local.forEach(function (node: any) {
                    try {
                        node.items.forEach(function (node2: any) {
                            submenus.push(node2);
                        });
                    } catch (e) {

                    }
                });

                consulta1 = submenus.filter(function (c) {
                    return c.label === elemento;
                });
            }
        return consulta1;
    }
    private seleccionar_hijos(toggleNode: any) {
        const toggleChildren = (node: any) => {

            node.children.forEach(function (child: any) {

                child.selected = node.selected;
                if (child.children.length) {
                    toggleChildren(child);
                }
            });
        };
        toggleChildren(toggleNode);
    }
    private seleccionar_padre(toggleNode: any) {
        const updateParent = (node: any) => {
            if (node.parentNodeId !== 0) {
                const parentNode = this.hash[node.parentNodeId];
                const siblings = parentNode.children;
                parentNode.partialSelection = false;
                let equalSiblings = true;
                siblings.forEach(function (sibling: any) {
                    if (sibling.selected !== node.selected) {
                        equalSiblings = false;
                    }
                });
                if (equalSiblings) {
                    parentNode.selected = node.selected;
                    if (parentNode.parentNodeId !== 0) {
                        updateParent(parentNode);
                    }
                } else {
                    parentNode.partialSelection = true;
                }
            }
        };
        updateParent(toggleNode);
    }

    nodeSelected(toggleNode: any) {
        // selecciona y desselecciona todos los hijos (recursivo)
        this.seleccionar_hijos(toggleNode);
        // actualiza al padre si es necesario (recursivo)
        this.seleccionar_padre(toggleNode);

        this.updateSelected();
        this.SacarSeleccion();
    }

    updateSelected() {
        this.selectedNodes = [];
        for (const node in this.hash) {
            if (this.hash[node].selected) {
                let currentNode = this.hash[node];
                let nodeLabel = currentNode['label'];
                while (currentNode.parentNodeId !== 0) {
                    currentNode = this.hash[currentNode.parentNodeId];
                    nodeLabel = currentNode['label'] + ' > ' + nodeLabel;
                }
                this.selectedNodes.push(nodeLabel);
            }
        }


    }

    SacarSeleccion() {

        const arreglo = this.selectedNodes;
        const pjsonprivilegios: any = this.master;
        if (this.selectedNodes.length) {
            pjsonprivilegios.forEach(function (padre: any) {
                const consulta3 = arreglo.filter(function (c) {
                    return c === padre['label'];
                });
                /*verifica padre si existe en los seleccionados */
                if (consulta3.length > 0) {
                    padre['selected'] = true;
                }
                padre.children.forEach(function (hijo: any) {
                    const consulta4 = arreglo.filter(function (c) {
                        return c === padre['label'] + '>' + hijo['label'];
                    });
                    /*verifica el hijo si existe en los seleccionados */
                    if (consulta4.length > 0) {
                        hijo['selected'] = true;
                    }
                });
            });


        }
        console.log(pjsonprivilegios);
        this.mensaje = [];
        this.usuarioService.setJsonPrivilegio(pjsonprivilegios, this.Idusuario).subscribe(res => {
            const resp = res.json();
            console.log(resp);
            if (resp) {
                this.mensaje.push({ severity: 'success', summary: 'Exito', detail: 'Se agrego correctamente el Item' });
            }
        });
    }



}
