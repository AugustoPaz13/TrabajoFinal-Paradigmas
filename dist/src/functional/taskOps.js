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
exports.statsPorDificultad = exports.statsPorEstado = exports.countBy = exports.obtenerPrioridadAlta = exports.obtenerVencidas = exports.buscarYOrdenar = exports.obtenerTerminadas = exports.obtenerEnCurso = exports.obtenerPendientes = exports.compareDificultadDesc = exports.compareCreacion = exports.compareVencimiento = exports.compareTitulo = exports.sortBy = exports.isRelacionada = exports.isPrioridadAlta = exports.isVencida = exports.byTitulo = exports.byEstado = exports.filterBy = void 0;
const Estado_1 = require("../models/Estado");
const fp_1 = require("../utils/fp");
const Logic = __importStar(require("../logic/predicates")); // Importamos el módulo lógico
// --- Funciones Puras de Filtrado (Higher-Order Functions) ---
const filterBy = (predicate) => (tareas) => tareas.filter(predicate);
exports.filterBy = filterBy;
const byEstado = (estado) => (t) => t.estado === Estado_1.Estado.from(estado.code);
exports.byEstado = byEstado;
const byTitulo = (query) => (t) => t.contieneTermino(query);
exports.byTitulo = byTitulo;
// [LOGICO] Usamos los predicados definidos en el módulo lógico
const isVencida = (t) => Logic.esVencida(t);
exports.isVencida = isVencida;
const isPrioridadAlta = (t) => Logic.esPrioridadAlta(t);
exports.isPrioridadAlta = isPrioridadAlta;
const isRelacionada = (target) => (t) => Logic.esRelacionada(target, t);
exports.isRelacionada = isRelacionada;
// --- Funciones Puras de Ordenamiento ---
const sortBy = (compareFn) => (tareas) => [...tareas].sort(compareFn);
exports.sortBy = sortBy;
const compareTitulo = (a, b) => a.titulo.localeCompare(b.titulo);
exports.compareTitulo = compareTitulo;
const compareVencimiento = (a, b) => {
    if (!a.vencimiento)
        return 1;
    if (!b.vencimiento)
        return -1;
    return a.vencimiento.getTime() - b.vencimiento.getTime();
};
exports.compareVencimiento = compareVencimiento;
const compareCreacion = (a, b) => a.creacion.getTime() - b.creacion.getTime();
exports.compareCreacion = compareCreacion;
const compareDificultadDesc = (a, b) => b.dificultad.code - a.dificultad.code;
exports.compareDificultadDesc = compareDificultadDesc;
// --- Composiciones Comunes (Point-free style) ---
exports.obtenerPendientes = (0, exports.filterBy)((0, exports.byEstado)(Estado_1.Estado.PENDIENTE));
exports.obtenerEnCurso = (0, exports.filterBy)((0, exports.byEstado)(Estado_1.Estado.EN_CURSO));
exports.obtenerTerminadas = (0, exports.filterBy)((0, exports.byEstado)(Estado_1.Estado.TERMINADA));
const buscarYOrdenar = (query) => (0, fp_1.pipe)((0, exports.filterBy)((0, exports.byTitulo)(query)), (0, exports.sortBy)(exports.compareTitulo));
exports.buscarYOrdenar = buscarYOrdenar;
exports.obtenerVencidas = (0, exports.filterBy)(exports.isVencida);
exports.obtenerPrioridadAlta = (0, exports.filterBy)(exports.isPrioridadAlta);
// --- Estadísticas (Reduce) ---
const countBy = (fn) => (items) => items.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
}, {});
exports.countBy = countBy;
exports.statsPorEstado = (0, exports.countBy)((t) => t.estado.label);
exports.statsPorDificultad = (0, exports.countBy)((t) => t.dificultad.label);
