export class Card {
    id: number;
    descripcion: string;
    icon: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
