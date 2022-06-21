import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-acreditacion-detalle',
    templateUrl: './acreditacion-detalle.component.html',
    styleUrls: ['./acreditacion-detalle.component.css']
})
export class AcreditacionDetalleComponent implements OnInit {
    personaId: number;
    eventoId: number;
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        // tslint:disable-next-line:no-debugger
  
        this.eventoId = this.route.snapshot.params['eventoId'];
        this.personaId = this.route.snapshot.params['personaId'];
    }
}
