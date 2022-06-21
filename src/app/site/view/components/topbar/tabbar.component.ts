import { Component, Inject, forwardRef } from '@angular/core';
import { MasterPage } from '../mastePage/master-page.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './tabbar.component.html',
    styleUrls: ['./tabbar.component.css']
})

// tslint:disable-next-line:component-class-suffix
export class AppTopBar {

    constructor( @Inject(forwardRef(() => MasterPage)) public app: MasterPage) { }

// tslint:disable-next-line:eofline
}