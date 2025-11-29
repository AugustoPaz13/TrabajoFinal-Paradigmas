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
exports.GestorTareas = void 0;
const Ops = __importStar(require("../funcional/operaciones"));
/**
 * Clase que gestiona la lógica de negocio de la colección de tareas.
 */
class GestorTareas {
    constructor(repositorio) {
        this.repositorio = repositorio;
        this.tareas = [];
    }
    async iniciar() {
        this.tareas = await this.repositorio.cargar();
    }
    async guardarCambios() {
        await this.repositorio.guardar(this.tareas);
    }
    agregarTarea(tarea) {
        this.tareas = [...this.tareas, tarea];
    }
    eliminarTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
    }
    editarTarea(id, tareaActualizada) {
        this.tareas = this.tareas.map(t => t.id === id ? tareaActualizada : t);
    }
    // --- Delegación a Funciones Puras ---
    buscarPorTitulo(consulta) {
        return Ops.buscarYOrdenar(consulta)(this.tareas);
    }
    filtrarPorEstado(estado) {
        return Ops.filtrarPor(Ops.porEstado(estado))(this.tareas);
    }
    // --- Ordenamiento ---
    ordenarPorTitulo() {
        return Ops.ordenarPor(Ops.compararTitulo)(this.tareas);
    }
    ordenarPorVencimiento() {
        return Ops.ordenarPor(Ops.compararVencimiento)(this.tareas);
    }
    ordenarPorCreacion() {
        return Ops.ordenarPor(Ops.compararCreacion)(this.tareas);
    }
    ordenarPorDificultad() {
        return Ops.ordenarPor(Ops.compararDificultadDesc)(this.tareas);
    }
    // --- Estadísticas e Inferencias ---
    obtenerEstadisticas() {
        return {
            total: this.tareas.length,
            porEstado: Ops.estadisticasPorEstado(this.tareas),
            porDificultad: Ops.estadisticasPorDificultad(this.tareas)
        };
    }
    obtenerVencidas() {
        return Ops.obtenerVencidas(this.tareas);
    }
    obtenerPrioridadAlta() {
        return Ops.obtenerPrioridadAlta(this.tareas);
    }
    obtenerRelacionadas(tarea) {
        return Ops.filtrarPor(Ops.esRelacionada(tarea))(this.tareas);
    }
}
exports.GestorTareas = GestorTareas;
