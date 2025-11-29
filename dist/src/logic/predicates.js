"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esRelacionada = exports.esPrioridadAlta = exports.esVencida = void 0;
const Estado_1 = require("../models/Estado");
// --- Hechos / Predicados Atómicos (Un predicado, una idea) ---
const tieneVencimiento = (t) => t.vencimiento !== null;
const estaTerminada = (t) => t.estado === Estado_1.Estado.TERMINADA;
const estaCancelada = (t) => t.estado === Estado_1.Estado.CANCELADA;
const esDificil = (t) => t.dificultad.code >= 3; // Consideramos difícil nivel 3
const estaPendiente = (t) => t.estado === Estado_1.Estado.PENDIENTE;
const fechaYaPaso = (t) => {
    return t.vencimiento !== null && t.vencimiento < new Date();
};
const compartenPalabrasClave = (t1, t2) => {
    const palabras1 = t1.titulo.toLowerCase().split(" ");
    const palabras2 = t2.titulo.toLowerCase().split(" ");
    return palabras1.some(p => p.length > 3 && palabras2.includes(p));
};
const sonLaMismaTarea = (t1, t2) => t1.id === t2.id;
// --- Reglas de Inferencia (Cláusulas ordenadas por restrictividad/eficiencia) ---
/**
 * Regla: esVencida(T) :-
 *    tieneVencimiento(T),
 *    NO estaTerminada(T),
 *    NO estaCancelada(T),
 *    fechaYaPaso(T).
 *
 * Orden: Chequeos de propiedad (rápidos) -> Chequeos de estado -> Comparación de fechas (más costoso).
 */
const esVencida = (t) => tieneVencimiento(t) &&
    !estaTerminada(t) &&
    !estaCancelada(t) &&
    fechaYaPaso(t);
exports.esVencida = esVencida;
/**
 * Regla: esPrioridadAlta(T) :-
 *    esDificil(T),
 *    estaPendiente(T).
 *
 * Orden: Dificultad (propiedad estática) -> Estado (propiedad mutable).
 */
const esPrioridadAlta = (t) => esDificil(t) &&
    estaPendiente(t);
exports.esPrioridadAlta = esPrioridadAlta;
/**
 * Regla: esRelacionada(T1, T2) :-
 *    NO sonLaMismaTarea(T1, T2),
 *    compartenPalabrasClave(T1, T2).
 */
const esRelacionada = (t1, t2) => !sonLaMismaTarea(t1, t2) &&
    compartenPalabrasClave(t1, t2);
exports.esRelacionada = esRelacionada;
