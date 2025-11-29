import { Tarea } from "../modelos/Tarea";
import { Repositorio } from "./Repositorio";
import { Estado } from "../modelos/Estado";
import * as Ops from "../funcional/operaciones";

export interface Estadisticas {
    total: number;
    porEstado: Record<string, number>;
    porDificultad: Record<string, number>;
}

/**
 * Clase que gestiona la lógica de negocio de la colección de tareas.
 */
export class GestorTareas {
    private tareas: Tarea[] = [];

    constructor(private repositorio: Repositorio) { }

    async iniciar(): Promise<void> {
        this.tareas = await this.repositorio.cargar();
    }

    async guardarCambios(): Promise<void> {
        await this.repositorio.guardar(this.tareas);
    }

    agregarTarea(tarea: Tarea): void {
        this.tareas = [...this.tareas, tarea];
    }

    eliminarTarea(id: string): void {
        this.tareas = this.tareas.filter(t => t.id !== id);
    }

    editarTarea(id: string, tareaActualizada: Tarea): void {
        this.tareas = this.tareas.map(t => t.id === id ? tareaActualizada : t);
    }

    // --- Delegación a Funciones Puras ---

    buscarPorTitulo(consulta: string): Tarea[] {
        return Ops.buscarYOrdenar(consulta)(this.tareas);
    }

    filtrarPorEstado(estado: Estado): Tarea[] {
        return Ops.filtrarPor(Ops.porEstado(estado))(this.tareas);
    }

    // --- Ordenamiento ---

    ordenarPorTitulo(): Tarea[] {
        return Ops.ordenarPor(Ops.compararTitulo)(this.tareas);
    }

    ordenarPorVencimiento(): Tarea[] {
        return Ops.ordenarPor(Ops.compararVencimiento)(this.tareas);
    }

    ordenarPorCreacion(): Tarea[] {
        return Ops.ordenarPor(Ops.compararCreacion)(this.tareas);
    }

    ordenarPorDificultad(): Tarea[] {
        return Ops.ordenarPor(Ops.compararDificultadDesc)(this.tareas);
    }

    // --- Estadísticas e Inferencias ---

    obtenerEstadisticas(): Estadisticas {
        return {
            total: this.tareas.length,
            porEstado: Ops.estadisticasPorEstado(this.tareas),
            porDificultad: Ops.estadisticasPorDificultad(this.tareas)
        };
    }

    obtenerVencidas(): Tarea[] {
        return Ops.obtenerVencidas(this.tareas);
    }

    obtenerPrioridadAlta(): Tarea[] {
        return Ops.obtenerPrioridadAlta(this.tareas);
    }

    obtenerRelacionadas(tarea: Tarea): Tarea[] {
        return Ops.filtrarPor(Ops.esRelacionada(tarea))(this.tareas);
    }
}
