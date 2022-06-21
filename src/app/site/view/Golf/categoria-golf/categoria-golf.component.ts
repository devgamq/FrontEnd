import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { MenuItem, DataTableModule, SharedModule, GrowlModule, Message, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { ActivatedRoute } from '@angular/router';
import { GolfCategoria } from '../../../domain/Golf/categoria';
import { CategoriaService } from '../../../service/Golf/categoria.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

enum DialogType { Insert, Update }
@Component({
    selector: 'app-categoria-golf',
    templateUrl: './categoria-golf.component.html',
    styleUrls: ['./categoria-golf.component.css'],
    providers: [CategoriaService, ConfirmationService]
})
export class CategoriaGolfComponent implements OnInit {
    categoriaForm: FormGroup;
    categorias: GolfCategoria[];
    categoria: GolfCategoria;
    eventoId: number;
    hideElement = false;
    display = false;
    msgs: Message[] = [];
    type = DialogType;
    constructor(private formBuilder: FormBuilder,
        private http: Http,
        private categoriaService: CategoriaService,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService) {
        this.cleanForm();
    }
    cleanForm() {
        this.categoriaForm = this.formBuilder.group({
            CategoriaId: [''],
            Descripcion: ['', Validators.required],
            Porcentaje: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+(?:\(\d+\))?$')])],
            EventoDeportivoId: ['']
        });
    }
    ngOnInit() {
        this.eventoId = +this.route.snapshot.params['eventoId'];
        this.doGetCategorias();
    }
    doGetCategorias() {
        this.categoriaService
            .getCategoriasList(this.eventoId)
            .then(res => {
                this.categorias = res;
            });
    }
    doSetCategoria(event: any) {
        this.categoriaForm.controls['EventoDeportivoId'].setValue(this.eventoId);
        if (this.categoriaForm.valid) {
            this.categoriaService.setCategoria(this.categoriaForm).subscribe(res => {
                const resp = res.json();
                if (resp === true) {
                    this.doGetCategorias();
                    this.display = false;
                    this.showMessage();
                }
            });
        } else {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'Complete todos los campos correctamente' });
        }
    }
    doGetCategoria() {
        this.categoriaService
            .getCategoria(this.categoria.CategoriaId)
            .then(res => {
                this.categoriaForm.controls['CategoriaId'].setValue(res.CategoriaId);
                this.categoriaForm.controls['Descripcion'].setValue(res.Descripcion);
                this.categoriaForm.controls['Porcentaje'].setValue(res.Porcentaje);
                this.categoriaForm.controls['EventoDeportivoId'].setValue(res.EventoDeportivoId);
                this.display = true;
            });
    }
    onRowSelect(event) {
        this.hideElement = true;
    }
    showMessage() {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Categoria Guardada' });
    }
    showDialog(typeDialog: DialogType) {
        this.cleanForm();
        if (typeDialog === DialogType.Update) {
            this.doGetCategoria();
        } else {
            this.display = true;
        }
    }
    confirmDelete() {
        this.confirmationService.confirm({
            message: '¿Esta seguro de eliminar la categoria?',
            header: 'Eliminar Categoria',
            icon: 'fa fa-trash',
            accept: () => {
                this.categoriaService.deleteCategoria(this.categoria.CategoriaId).subscribe(res => {
                    const resp = res.json();
                    this.msgs = [];
                    if (resp === true) {
                        this.doGetCategorias();
                        this.msgs.push({ severity: 'success', summary: 'Exito!', detail: 'Categoría Eliminada' });
                    } else {
                        this.msgs.push({ severity: 'error', summary: 'Error!', detail: 'Ocurrio un error Inesperado' });
                    }
                });
            }
        });
    }
}
