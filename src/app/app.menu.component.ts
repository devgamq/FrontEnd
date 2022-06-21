import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  ViewChild,
  Inject,
  forwardRef
} from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/primeng";
import { AppComponent } from "./app.component";

import { Menu } from "./site/domain/Shared/menu.type";
import { Usuario } from "./site/domain/Shared/usuario.type";
import { UsuarioService } from "./site/service/Shared/usuario.service";

import "rxjs/Rx";

@Component({
  selector: "app-menu",
  template: `
        <ul app-submenu [item]="model" root="true" class="ultima-menu ultima-main-menu clearfix" [reset]="reset" visible="true"></ul>
    `,
  providers: [UsuarioService]
})
export class AppMenuComponent implements OnInit {
  @Input() reset: boolean;
  model: any[];
  menuItem: any;
  listaMenu: any;
  hash: any[];

  constructor(
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
      const item_copia = [];
      const usuario = JSON.parse(sessionStorage.getItem("resu"));
      this.changeTheme("dark-blue");
      this.usuarioService.getToc(usuario.UsuarioId).subscribe(res => {
      this.listaMenu = res;
      this.listaMenu = JSON.parse(this.listaMenu);
      this.model = this.listaMenu;
    });
  }
  /*
        buildDataHierarchy(data: any[]): any {
            let id = 1;
            let hash = {};
            let parentId = 1;
            let i = 0;
            var u=0;
            let vacios=0;
            let itemsMenu:any[]=[];
            let itemMenu:any;
            let subitemMenu:any;
            let subitemMenus:any[]=[];
            let setNodeID = (node : any, parentId: number,selec:boolean,p:number,h:number) => {
                 if(h==0){
                    if(selec){
                    itemMenu={label:node['label'],icon:node['icon'],items:[]};
                    itemsMenu.push(itemMenu);
                    hash[id] = node;
                    }else{
                    vacios++;
                    }
                }
                else
                if(h==1){
                    if(selec){
                    subitemMenu={label:node['label'],icon:node['icon'],routerLink:node['routerLink']};
                    console.log(itemsMenu[p-vacios]);
                    itemsMenu[p-vacios].items.push(subitemMenu);
                    }
                }
                if (node.items.length){
                    const parentId = id;
                    var u2=0;
                    node.items.forEach(function(node: any){
                        id++;
                       setNodeID(node, parentId,data[p]["items"][u2]["selected"],p,1);
                       u2++;
                    });
                }
                id++;
                i++;
            }
            data.forEach(function(node: any){
                setNodeID(node, 0,data[u]["selected"],u,0);
                u++;
            });
            return itemsMenu;
        }*/

  changeTheme(theme) {
    const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById(
      "theme-css"
    );
    const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById(
      "layout-css"
    );

    themeLink.href = "assets/theme/theme-" + theme + ".css";
    layoutLink.href = "assets/layout/css/layout-" + theme + ".css";
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: "[app-submenu]",
  template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" 
                class="ripplelink" *ngIf="!child.routerLink" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i class="material-icons">{{child.icon}}</i>
                    <span>{{child.label}}</span>
                    <i class="material-icons" *ngIf="child.items">keyboard_arrow_down</i>
                </a>
                <a (click)="itemClick($event,child,i)" class="ripplelink" *ngIf="child.routerLink"
                    [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink" 
                    [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i class="material-icons">{{child.icon}}</i>
                    <span>{{child.label}}</span>
                    
                </a>
                <ul app-submenu [item]="child" *ngIf="child.items" [@children]="isActive(i) ? 'visible' : 'hidden'" 
                [visible]="isActive(i)" [reset]="reset"></ul>
            </li>
        </ng-template>
    `,
  animations: [
    trigger("children", [
      state(
        "hidden",
        style({
          height: "0px"
        })
      ),
      state(
        "visible",
        style({
          height: "*"
        })
      ),
      transition(
        "visible => hidden",
        animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
      ),
      transition(
        "hidden => visible",
        animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")
      )
    ])
  ]
})
// tslint:disable-next-line:component-class-suffix
export class AppSubMenu {
  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  _reset: boolean;

  activeIndex: number;

  constructor(
    @Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
    public router: Router,
    public location: Location
  ) {}

  itemClick(event: Event, item: MenuItem, index: number) {
    /*avoid processing disabled items*/
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    /*activate current item and deactivate active sibling if any*/
    this.activeIndex = this.activeIndex === index ? null : index;

    /*execute command*/
    if (item.command) {
      item.command({
        originalEvent: event,
        item: item
      });
    }

    /*prevent hash change*/
    if (item.items || (!item.url && !item.routerLink)) {
      event.preventDefault();
    }
    /*hide menu*/
    if (!item.items) {
      if (this.app.isHorizontal()){
        this.app.resetMenu = true;
      }else {
        this.app.resetMenu = false;
      }

      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input()
  get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset && this.app.isHorizontal()) {
      this.activeIndex = null;
    }
  }
}
