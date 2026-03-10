/**
 * Función de composición (Tuberia) para encadenar operaciones.
 * Permite pasar el resultado de una función a la siguiente.
 */
export const tuberia = <T>(...funciones: Array<(arg: T) => T>) => (valor: T) =>
    funciones.reduce((acumulado, funcion) => funcion(acumulado), valor);

