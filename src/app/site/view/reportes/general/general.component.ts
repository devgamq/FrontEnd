import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MedalleroService } from '../../../service/conjunto/medallero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JasperService } from '../../../service/Conjunto/jasper.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
  providers: [MedalleroService, JasperService],
  encapsulation: ViewEncapsulation.None
})
export class GeneralComponent implements OnInit {
  data: any[];
  cantidad: number;
  EventoId: any;
  oro: number;
  plata: number;
  bronce: number;
  total: number;

  constructor(
    private medalleroService: MedalleroService,
    private route: ActivatedRoute,private JasperService: JasperService
  ) {
    this.data = [];
    this.EventoId = this.route.snapshot.params['eventoId'];
  }

  ngOnInit() {
    this.cargarMedallero();
  }
  private cargarMedallero() {
    this.oro = 0;
    this.plata = 0;
    this.bronce = 0;
    this.total = 0;

    this.medalleroService.GetMedalleroGeneral(this.EventoId).then(res => {
      if (res.length > 0) {
        this.data = res;
        this.cantidad = res.length;

        res.forEach(element => {
          this.oro += element.ORO;
          this.plata += element.PLATA;
          this.bronce += element.BRONCE;
          this.total += element.Total;
        });
      }
    });
  }
  imprimir() {
    this.JasperService.getMedalleroGeneral(this.EventoId).then(res => {
      window.open(URL.createObjectURL(res));
    });
  }
}
