import { Component, OnInit } from '@angular/core';
import { JasperService } from '../../../service/Conjunto/jasper.service';
import { SelectItem, Message } from 'primeng/primeng';
import { DeporteService } from '../../../service/Acreditacion/deporte.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-reporte-jornada',
  templateUrl: './reporte-jornada.component.html',
  styleUrls: ['./reporte-jornada.component.css'],
  providers: [DeporteService, JasperService]
})
export class ReporteJornadaComponent implements OnInit {
  deportes: SelectItem[];
  deporteId: number;
  eventoId: number;
  fecha: Date;
  msgs: Message[] = [];
  constructor(
    private deporteService: DeporteService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private JasperService: JasperService
  ) {
    this.eventoId = this.route.snapshot.params['eventoId'];
  }

  ngOnInit() {
    this.fecha = new Date();
    this.doGetDeportes();
  }

  doGetDeportes() {
    this.deporteService.getDeportes(this.eventoId).then(res => {
      this.deportes = res.map(item => {
        return {
          value: item.DeporteId,
          label: item.DeporteDescripcion
        };
      });
      this.deportes.push({ label: 'Seleccione Deporte', value: null });
    });
  }

  generarReporteJornada() {
    const fecha_actual =
      this.fecha.getFullYear() +
      '-' +
      (this.fecha.getMonth() + 1) +
      '-' +
      this.fecha.getDate();

    if (this.deporteId) {
      this.JasperService.getProgramacion(
        this.eventoId,
        this.deporteId,
        fecha_actual
      ).then(res => {
        window.open(URL.createObjectURL(res));
      });
    } else {
      this.msgs.push({
        severity: 'danger',
        summary: 'Error!',
        detail: 'Error seleccione deporte'
      });
    }
  }
}
