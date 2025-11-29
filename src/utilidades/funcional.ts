/**
 * Función de composición (Tuberia) para encadenar operaciones.
 * Permite pasar el resultado de una función a la siguiente.
 */
export const tuberia = <T>(...funciones: Array<(arg: T) => T>) => (valor: T) =>
    funciones.reduce((acumulado, funcion) => funcion(acumulado), valor);

/**
 * Helper para Currificación.
 */
export const currificar = (fn: Function) => {
    const currificada = (...args: any[]): any => {
        if (args.length >= fn.length) {
            return fn.apply(null, args);
        }
        return (...siguientesArgs: any[]) => currificada.apply(null, args.concat(siguientesArgs));
    };
    return currificada;
};
