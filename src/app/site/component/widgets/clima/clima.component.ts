import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { MedalleroService } from '../../../service/conjunto/medallero.service';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.component.html',
  styleUrls: ['./clima.component.css'],
  providers: [MedalleroService]
})
export class ClimaComponent implements OnInit, OnChanges {
  clima: any;
  temperatura: number;
  timer: any;
  nombre: string;
  icono: string;

  @Input() lugar = 'Cochabamba';
  constructor(private medalleroService: MedalleroService) {
    this.icono = 'vacio';
  }

  ngOnInit() {
    this.initClima();
    this.goTimer();
  }
  private initClima() {
    try {
      if (this.lugar === undefined) {
        this.lugar = 'cochabamba';
      }

      this.medalleroService
        .GetClima(this.lugar.replace(/"/g, ''))
        .then(res => {
          this.clima = res;

          this.temperatura = Math.round(Number(this.clima.main.temp) - 273);
          this.nombre =
            String(this.clima.name) === 'Potosi'
              ? 'Potosí'
              : String(this.clima.name);
          this.icono = String(this.clima.weather[0].icon);
        });
    } catch (error) {
      this.temperatura = 0;
      this.nombre = '';
    }
  }
  private goTimer() {
    let c = 0;
    this.timer = setInterval(() => {
      c++;
      this.initClima();
      if (c === 60) {
        clearInterval(this.timer);
        this.goTimer();
      }
    }, 3600000);
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      const pararEvent = changes['lugar'];

      this.lugar = pararEvent.currentValue === undefined ? 'Cochabamba' : JSON.stringify(pararEvent.currentValue);
      clearInterval(this.timer);
      this.initClima();
      this.goTimer();
    } catch (error) { }
  }
}
