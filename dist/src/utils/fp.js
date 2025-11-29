"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curry = exports.pipe = void 0;
/**
 * Función de composición (Pipe) para encadenar operaciones.
 * Permite pasar el resultado de una función a la siguiente.
 */
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);
exports.pipe = pipe;
/**
 * Curry function helper.
 */
const curry = (fn) => {
    const curried = (...args) => {
        if (args.length >= fn.length) {
            return fn.apply(null, args);
        }
        return (...nextArgs) => curried.apply(null, args.concat(nextArgs));
    };
    return curried;
};
exports.curry = curry;
