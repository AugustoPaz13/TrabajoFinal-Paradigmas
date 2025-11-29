import { Tarea } from "../modelos/Tarea";
import { Estado } from "../modelos/Estado";
import { Dificultad } from "../modelos/Dificultad";

/**
 * Módulo de Programación Lógica.
 * Se simulan predicados y reglas de inferencia.
 */

type Predicado<T> = (arg: T) => boolean;
type PredicadoBinario<T> = (arg1: T, arg2: T) => boolean;

// --- Hechos / Predicados Atómicos (Un predicado, una idea) ---

const tieneVencimiento: Predicado<Tarea> = (t) => t.vencimiento !== null;

const estaTerminada: Predicado<Tarea> = (t) => t.estado === Estado.TERMINADA;

const estaCancelada: Predicado<Tarea> = (t) => t.estado === Estado.CANCELADA;

const esDificil: Predicado<Tarea> = (t) => t.dificultad.codigo >= 3; // Consideramos difícil nivel 3

const estaPendiente: Predicado<Tarea> = (t) => t.estado === Estado.PENDIENTE;

const fechaYaPaso: Predicado<Tarea> = (t) => {
    return t.vencimiento !== null && t.vencimiento < new Date();
};

const compartenPalabrasClave: PredicadoBinario<Tarea> = (t1, t2) => {
    const palabras1 = t1.titulo.toLowerCase().split(" ");
    const palabras2 = t2.titulo.toLowerCase().split(" ");
    return palabras1.some(p => p.length > 3 && palabras2.includes(p));
};

const sonLaMismaTarea: PredicadoBinario<Tarea> = (t1, t2) => t1.id === t2.id;

// --- Reglas de Inferencia (Cláusulas ordenadas por restrictividad/eficiencia) ---

/**
 * Regla: esVencida(T) :- 
 *    tieneVencimiento(T), 
 *    NO estaTerminada(T), 
 *    NO estaCancelada(T), 
 *    fechaYaPaso(T).
 */
export const esVencida: Predicado<Tarea> = (t) =>
    tieneVencimiento(t) &&
    !estaTerminada(t) &&
    !estaCancelada(t) &&
    fechaYaPaso(t);

/**
 * Regla: esPrioridadAlta(T) :- 
 *    esDificil(T), 
 *    estaPendiente(T).
 */
export const esPrioridadAlta: Predicado<Tarea> = (t) =>
    esDificil(t) &&
    estaPendiente(t);

/**
 * Regla: esRelacionada(T1, T2) :- 
 *    NO sonLaMismaTarea(T1, T2), 
 *    compartenPalabrasClave(T1, T2).
 */
export const esRelacionada: PredicadoBinario<Tarea> = (t1, t2) =>
    !sonLaMismaTarea(t1, t2) &&
    compartenPalabrasClave(t1, t2);
