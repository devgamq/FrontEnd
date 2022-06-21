import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConjuntoService } from 'app/site/service/Conjunto/conjunto.service';
import * as urls from 'app/site/domain/Shared/global';

@Component({
  selector: 'app-list-athletes',
  templateUrl: './list-athletes.component.html',
  styleUrls: ['./list-athletes.component.css'],
  providers: [ConjuntoService]
})
export class ListAthletesComponent implements OnInit {

  user: any;
  tabla: any;
  equipo: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conjuntoService: ConjuntoService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('resu'));
    this.equipo = this.user.ConfigUsuario[0].Equipo;
    this.getPersonasEquipo();
  }

  ngOnInit() {
    
  }

  addDeportista() {
    this.router.navigate(['/master/add-deportista-frog/']);
  }

  getPersonasEquipo(){
    this.conjuntoService.getPersonasEquipoFrog(this.user.OficinaId)
      .then(response => {
        console.log(response);
        this.tabla = response;
      });
  }

  private openPdf() {
    window.open(`${urls.urlGeneric}/Resources/ReportList.pdf`);
  }
}
