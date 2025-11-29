import { Tarea } from "../modelos/Tarea";
import { Estado } from "../modelos/Estado";
import { tuberia } from "../utilidades/funcional";
import * as Logica from "../logica/predicados";

// --- Funciones Puras de Filtrado (Funciones de Orden Superior) ---

export const filtrarPor = (predicado: (t: Tarea) => boolean) => (tareas: Tarea[]): Tarea[] =>
    tareas.filter(predicado);

export const porEstado = (estado: Estado) => (t: Tarea) => t.estado === Estado.desde(estado.codigo);

export const porTitulo = (consulta: string) => (t: Tarea) => t.contieneTermino(consulta);

// [LOGICO] Usamos los predicados definidos en el módulo lógico
export const esVencida = (t: Tarea) => Logica.esVencida(t);

export const esPrioridadAlta = (t: Tarea) => Logica.esPrioridadAlta(t);

export const esRelacionada = (objetivo: Tarea) => (t: Tarea) => Logica.esRelacionada(objetivo, t);

// --- Funciones Puras de Ordenamiento ---

export const ordenarPor = (comparador: (a: Tarea, b: Tarea) => number) => (tareas: Tarea[]): Tarea[] =>
    [...tareas].sort(comparador);

export const compararTitulo = (a: Tarea, b: Tarea) => a.titulo.localeCompare(b.titulo);

export const compararVencimiento = (a: Tarea, b: Tarea) => {
    if (!a.vencimiento) return 1;
    if (!b.vencimiento) return -1;
    return a.vencimiento.getTime() - b.vencimiento.getTime();
};

export const compararCreacion = (a: Tarea, b: Tarea) => a.creacion.getTime() - b.creacion.getTime();

export const compararDificultadDesc = (a: Tarea, b: Tarea) => b.dificultad.codigo - a.dificultad.codigo;

// --- Composiciones Comunes (Estilo tácito / Point-free) ---

export const obtenerPendientes = filtrarPor(porEstado(Estado.PENDIENTE));
export const obtenerEnCurso = filtrarPor(porEstado(Estado.EN_CURSO));
export const obtenerTerminadas = filtrarPor(porEstado(Estado.TERMINADA));

export const buscarYOrdenar = (consulta: string) => tuberia(
    filtrarPor(porTitulo(consulta)),
    ordenarPor(compararTitulo)
);

export const obtenerVencidas = filtrarPor(esVencida);
export const obtenerPrioridadAlta = filtrarPor(esPrioridadAlta);

// --- Estadísticas (Reducción) ---

export const contarPor = <T>(fn: (item: T) => string) => (items: T[]): Record<string, number> =>
    items.reduce((acumulado, item) => {
        const clave = fn(item);
        acumulado[clave] = (acumulado[clave] || 0) + 1;
        return acumulado;
    }, {} as Record<string, number>);

export const estadisticasPorEstado = contarPor((t: Tarea) => t.estado.etiqueta);
export const estadisticasPorDificultad = contarPor((t: Tarea) => t.dificultad.etiqueta);
