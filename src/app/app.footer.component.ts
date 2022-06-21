import { Component, Inject, forwardRef } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
    selector: 'app-footer',
    template: `
       
        <p-toolbar>

        <div class="ui-g-3"> <img src="../../../../../assets/erpHammer/images/hammerLogoH.png"  style="width: 150px; height: 25px"/></div>
        
        <div class="ui-toolbar-group-right"> <span style="color: #fff;">All Rights Reserved</span>
        <button pButton type="button" icon="ui-icon-verified-user"></button>
        <i class="fa fa-bars"></i>
    </div>
        </p-toolbar>
    `
})
// tslint:disable-next-line:component-class-suffix
export class AppFooter {

}
