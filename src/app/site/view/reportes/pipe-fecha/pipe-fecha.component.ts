import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'PipeFechaComponent' })
export class PipeFechaComponent implements PipeTransform {
  transform(value: any, exponent: string): string {
    if (exponent === 'fecha') {
      const fecha = new Date(value);
      const dia_nombre = this.getNombreDia(fecha.getDay());
      return (
        dia_nombre +
        ' ' +
        fecha.getDate() +
        ', ' +
        this.getNombreMes(fecha.getMonth())
      );
    }
    if (exponent === 'hora') {
      return String(value).substring(0, 5);
    }
    return '';
  }

  private getNombreDia(dia: number) {
    switch (dia) {
      case 1:
        return 'Lunes';
      case 2:
        return 'Martes';
      case 3:
        return 'Miercoles';
      case 4:
        return 'Jueves';
      case 5:
        return 'Viernes';
      case 6:
        return 'Sábado';
      case 0:
        return 'Domingo';
    }
  }
  private getNombreMes(dia: number) {
    switch (dia) {
      case 1:
        return 'Febrero';
      case 2:
        return 'Marzo';
      case 3:
        return 'Abril';
      case 4:
        return 'Mayo';
      case 5:
        return 'Junio';
      case 6:
        return 'Julio';
      case 7:
        return 'Agosto';
      case 8:
        return 'Septiembre';
      case 9:
        return 'Octubre';
      case 10:
        return 'Noviembre';
      case 11:
        return 'Diciembre';
      case 0:
        return 'Enero';
    }
  }
}
