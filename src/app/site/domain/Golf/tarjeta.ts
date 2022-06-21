export class GolfTarjeta {
    JugadasId = 0;
    CompetidorJornadaId = 0;
    HoyoParId = 0;
    Golpes = 0;
    UsuarioId = 0;
    Hoyo = 0;
    Par = 0;
    DescripcionNroTiros?: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    changeDescripcionTiro(tipoTiros) {
        const tipoTi = this.Golpes - this.Par;
        if (this.Golpes === 0) {
            this.DescripcionNroTiros = 'Eliminar';
        }
        if (this.Golpes === 1) {
            this.DescripcionNroTiros = tipoTiros[6].Descripcion;
        } else {
            if (this.Golpes === (this.Par + 3)) {
                this.DescripcionNroTiros = '';
            } else {
                for (let i = 0; i < (tipoTiros.length - 1); i++) {
                    if (tipoTi === parseInt(tipoTiros[i].Abreviatura, 10)) {
                        this.DescripcionNroTiros = tipoTiros[i].Descripcion;
                    }
                }
            }
        }
    }
}
