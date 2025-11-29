"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.estadisticasPorDificultad = exports.estadisticasPorEstado = exports.contarPor = exports.obtenerPrioridadAlta = exports.obtenerVencidas = exports.buscarYOrdenar = exports.obtenerTerminadas = exports.obtenerEnCurso = exports.obtenerPendientes = exports.compararDificultadDesc = exports.compararCreacion = exports.compararVencimiento = exports.compararTitulo = exports.ordenarPor = exports.esRelacionada = exports.esPrioridadAlta = exports.esVencida = exports.porTitulo = exports.porEstado = exports.filtrarPor = void 0;
const Estado_1 = require("../modelos/Estado");
const funcional_1 = require("../utilidades/funcional");
const Logica = __importStar(require("../logica/predicados"));
// --- Funciones Puras de Filtrado (Funciones de Orden Superior) ---
const filtrarPor = (predicado) => (tareas) => tareas.filter(predicado);
exports.filtrarPor = filtrarPor;
const porEstado = (estado) => (t) => t.estado === Estado_1.Estado.desde(estado.codigo);
exports.porEstado = porEstado;
const porTitulo = (consulta) => (t) => t.contieneTermino(consulta);
exports.porTitulo = porTitulo;
// [LOGICO] Usamos los predicados definidos en el módulo lógico
const esVencida = (t) => Logica.esVencida(t);
exports.esVencida = esVencida;
const esPrioridadAlta = (t) => Logica.esPrioridadAlta(t);
exports.esPrioridadAlta = esPrioridadAlta;
const esRelacionada = (objetivo) => (t) => Logica.esRelacionada(objetivo, t);
exports.esRelacionada = esRelacionada;
// --- Funciones Puras de Ordenamiento ---
const ordenarPor = (comparador) => (tareas) => [...tareas].sort(comparador);
exports.ordenarPor = ordenarPor;
const compararTitulo = (a, b) => a.titulo.localeCompare(b.titulo);
exports.compararTitulo = compararTitulo;
const compararVencimiento = (a, b) => {
    if (!a.vencimiento)
        return 1;
    if (!b.vencimiento)
        return -1;
    return a.vencimiento.getTime() - b.vencimiento.getTime();
};
exports.compararVencimiento = compararVencimiento;
const compararCreacion = (a, b) => a.creacion.getTime() - b.creacion.getTime();
exports.compararCreacion = compararCreacion;
const compararDificultadDesc = (a, b) => b.dificultad.codigo - a.dificultad.codigo;
exports.compararDificultadDesc = compararDificultadDesc;
// --- Composiciones Comunes (Estilo tácito / Point-free) ---
exports.obtenerPendientes = (0, exports.filtrarPor)((0, exports.porEstado)(Estado_1.Estado.PENDIENTE));
exports.obtenerEnCurso = (0, exports.filtrarPor)((0, exports.porEstado)(Estado_1.Estado.EN_CURSO));
exports.obtenerTerminadas = (0, exports.filtrarPor)((0, exports.porEstado)(Estado_1.Estado.TERMINADA));
const buscarYOrdenar = (consulta) => (0, funcional_1.tuberia)((0, exports.filtrarPor)((0, exports.porTitulo)(consulta)), (0, exports.ordenarPor)(exports.compararTitulo));
exports.buscarYOrdenar = buscarYOrdenar;
exports.obtenerVencidas = (0, exports.filtrarPor)(exports.esVencida);
exports.obtenerPrioridadAlta = (0, exports.filtrarPor)(exports.esPrioridadAlta);
// --- Estadísticas (Reducción) ---
const contarPor = (fn) => (items) => items.reduce((acumulado, item) => {
    const clave = fn(item);
    acumulado[clave] = (acumulado[clave] || 0) + 1;
    return acumulado;
}, {});
exports.contarPor = contarPor;
exports.estadisticasPorEstado = (0, exports.contarPor)((t) => t.estado.etiqueta);
exports.estadisticasPorDificultad = (0, exports.contarPor)((t) => t.dificultad.etiqueta);
