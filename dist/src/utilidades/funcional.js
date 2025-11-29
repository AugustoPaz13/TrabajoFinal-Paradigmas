"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currificar = exports.tuberia = void 0;
/**
 * Función de composición (Tuberia) para encadenar operaciones.
 * Permite pasar el resultado de una función a la siguiente.
 */
const tuberia = (...funciones) => (valor) => funciones.reduce((acumulado, funcion) => funcion(acumulado), valor);
exports.tuberia = tuberia;
/**
 * Helper para Currificación.
 */
const currificar = (fn) => {
    const currificada = (...args) => {
        if (args.length >= fn.length) {
            return fn.apply(null, args);
        }
        return (...siguientesArgs) => currificada.apply(null, args.concat(siguientesArgs));
    };
    return currificada;
};
exports.currificar = currificar;
