export class Util {
    public lpad(caracter: string, length: number, texto: string) {
        while (texto.length < length) { texto = caracter + texto; }
        return texto;
    }
    public lpad_generico(caracter: string, length: number, texto: any) {
        let variable = String(texto);
        while (variable.length < length) { variable = caracter + variable; }
        return variable;
    }
    public capitalize(input: string) {
        const first = input.substring(0, 1).toUpperCase();
        const all = input.substr(1).toLowerCase();
        return first + all;
    }

    public quitarEspacios(input: string) {
        //  var lista=input
        return input.replace(' ', '');
    }
}
