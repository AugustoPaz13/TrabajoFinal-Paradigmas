"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estado = void 0;
/**
 * Representa el estado de una tarea.
 * Utiliza el patrón Singleton/Flyweight para los valores predefinidos.
 */
class Estado {
    constructor(codigo, etiqueta) {
        this.codigo = codigo;
        this.etiqueta = etiqueta;
    }
    /**
     * Obtiene todos los estados disponibles.
     */
    static valores() {
        return [this.PENDIENTE, this.EN_CURSO, this.TERMINADA, this.CANCELADA];
    }
    /**
     * Busca un estado por su código o etiqueta.
     * @param valor String de búsqueda.
     */
    static desde(valor) {
        if (!valor)
            return null;
        const v = valor.trim().toUpperCase();
        if (v === "P" || v === "PENDIENTE")
            return this.PENDIENTE;
        if (v === "E" || v === "EN CURSO" || v === "EN_CURSO")
            return this.EN_CURSO;
        if (v === "T" || v === "TERMINADA")
            return this.TERMINADA;
        if (v === "C" || v === "CANCELADA")
            return this.CANCELADA;
        return null;
    }
    toString() {
        return this.etiqueta;
    }
}
exports.Estado = Estado;
Estado.PENDIENTE = new Estado("P", "Pendiente");
Estado.EN_CURSO = new Estado("E", "En curso");
Estado.TERMINADA = new Estado("T", "Terminada");
Estado.CANCELADA = new Estado("C", "Cancelada");
