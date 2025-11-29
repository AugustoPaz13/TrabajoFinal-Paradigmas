"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dificultad = void 0;
/**
 * Representa la dificultad de una tarea.
 */
class Dificultad {
    constructor(codigo, etiqueta, estrellas) {
        this.codigo = codigo;
        this.etiqueta = etiqueta;
        this.estrellas = estrellas;
    }
    static valores() {
        return [this.FACIL, this.MEDIO, this.DIFICIL];
    }
    static desde(valor) {
        if (!valor)
            return null;
        const v = valor.toString().trim().toUpperCase();
        if (v === "1" || v === "F" || v === "FACIL" || v === "FÁCIL")
            return this.FACIL;
        if (v === "2" || v === "M" || v === "MEDIO")
            return this.MEDIO;
        if (v === "3" || v === "D" || v === "DIFICIL" || v === "DIFÍCIL")
            return this.DIFICIL;
        return null;
    }
    toString() {
        return `${this.etiqueta} (${this.estrellas})`;
    }
}
exports.Dificultad = Dificultad;
Dificultad.FACIL = new Dificultad(1, "Fácil", "★☆☆");
Dificultad.MEDIO = new Dificultad(2, "Medio", "★★☆");
Dificultad.DIFICIL = new Dificultad(3, "Difícil", "★★★");
