import * as readline from 'readline';

/**
 * Clase encargada de la Entrada/Salida por consola.
 */
export class Consola {
    private rl: readline.Interface;

    constructor() {
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    }

    preguntar(pregunta: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(pregunta, (respuesta) => resolve(respuesta));
        });
    }

    cerrar(): void {
        this.rl.close();
    }
}
