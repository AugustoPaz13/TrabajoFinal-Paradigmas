import { promises as fs } from 'fs';
import { Repositorio } from './Repositorio';
import { Tarea } from '../modelos/Tarea';
import { Estado } from '../modelos/Estado';
import { Dificultad } from '../modelos/Dificultad';

/**
 * Implementación del repositorio usando un archivo JSON.
 */
export class RepositorioJson implements Repositorio {
    constructor(private rutaArchivo: string) { }

    async cargar(): Promise<Tarea[]> {
        try {
            const data = await fs.readFile(this.rutaArchivo, 'utf8');
            const json = JSON.parse(data);
            if (!Array.isArray(json)) return [];

            return json.map((item: any) => this.mapearATarea(item)).filter((t): t is Tarea => t !== null);
        } catch (error: any) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    async guardar(tareas: Tarea[]): Promise<void> {
        const json = tareas.map(t => this.mapearAJson(t));
        await fs.writeFile(this.rutaArchivo, JSON.stringify(json, null, 2), 'utf8');
    }

    private mapearATarea(json: any): Tarea | null {
        try {
            return new Tarea({
                id: json.id,
                titulo: json.titulo,
                descripcion: json.descripcion,
                estado: this.mapearEstado(json.estado),
                dificultad: this.mapearDificultad(json.dificultad),
                creacion: new Date(json.creacion),
                ultimaEdicion: json.ultimaEdicion ? new Date(json.ultimaEdicion) : undefined,
                vencimiento: json.vencimiento ? new Date(json.vencimiento) : null
            });
        } catch (e) {
            return null;
        }
    }

    private mapearAJson(tarea: Tarea): any {
        return {
            id: tarea.id,
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            estado: this.mapearEstadoAJson(tarea.estado),
            dificultad: this.mapearDificultadAJson(tarea.dificultad),
            creacion: tarea.creacion.toISOString(),
            ultimaEdicion: tarea.ultimaEdicion.toISOString(),
            vencimiento: tarea.vencimiento?.toISOString() || null
        };
    }

    private mapearEstado(val: string): Estado {
        if (val === "PENDING") return Estado.PENDIENTE;
        if (val === "IN-PROGRESS") return Estado.EN_CURSO;
        if (val === "FINISHED") return Estado.TERMINADA;
        if (val === "CANCELED") return Estado.CANCELADA;
        return Estado.desde(val) || Estado.PENDIENTE;
    }

    private mapearDificultad(val: number): Dificultad {
        return Dificultad.desde(val) || Dificultad.FACIL;
    }

    private mapearEstadoAJson(estado: Estado): string {
        if (estado === Estado.PENDIENTE) return "PENDING";
        if (estado === Estado.EN_CURSO) return "IN-PROGRESS";
        if (estado === Estado.TERMINADA) return "FINISHED";
        if (estado === Estado.CANCELADA) return "CANCELED";
        return "PENDING";
    }

    private mapearDificultadAJson(dificultad: Dificultad): number {
        return dificultad.codigo;
    }
}
