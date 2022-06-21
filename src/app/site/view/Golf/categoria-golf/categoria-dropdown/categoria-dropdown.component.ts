import { CategoriaService } from '../../../../service/Golf/categoria.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { ActivatedRoute } from '@angular/router';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'categoria-dropdown',
    templateUrl: './categoria-dropdown.component.html',
    providers: [CategoriaService]
})
// tslint:disable-next-line:component-class-suffix
export class CategoriaDropDown implements OnInit {
    categorias: SelectItem[];
    @Input() categoriaId: number;
    @Input() eventoId: number;
    @Input() agregarTodos = false;
    @Output() categoriaSelected = new EventEmitter();
    constructor(
        private categoriaService: CategoriaService,
        private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.doGetCategorias();
    }

    doGetCategorias() {
        this.categoriaService
            .getCategoriasList(this.eventoId)
            .then(res => {

                this.categorias = res.map(item => {
                    return {
                        label: item.Descripcion, value: { CategoriaId: item.CategoriaId, PruebaEventoId: item.PruebaEventoId }
                    };
                });
                if (this.agregarTodos) {
                    this.categorias.unshift({ label: '[Todos]', value: { CategoriaId: '0', PruebaEventoId: 0 } });
                }
                // tslint:disable-next-line:max-line-length
                this.categoriaSelected.emit({
                    categoriaId: this.categorias.length > 0 ? this.categorias[0].value.CategoriaId : 0,
                    descripcion: this.categorias[0].label,
                    PruebaEventoId: this.categorias[0].value.PruebaEventoId
                });
            });
    }

    onChangeCategoria($event) {
        this.categoriaSelected.emit({
            categoriaId: $event.value.CategoriaId,
            descripcion: $event.originalEvent.currentTarget.innerText,
            PruebaEventoId: $event.value.PruebaEventoId
        });
    }
}


