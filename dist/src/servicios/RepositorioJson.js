"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioJson = void 0;
const fs_1 = require("fs");
const Tarea_1 = require("../modelos/Tarea");
const Estado_1 = require("../modelos/Estado");
const Dificultad_1 = require("../modelos/Dificultad");
/**
 * Implementación del repositorio usando un archivo JSON.
 */
class RepositorioJson {
    constructor(rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }
    async cargar() {
        try {
            const data = await fs_1.promises.readFile(this.rutaArchivo, 'utf8');
            const json = JSON.parse(data);
            if (!Array.isArray(json))
                return [];
            return json.map((item) => this.mapearATarea(item)).filter((t) => t !== null);
        }
        catch (error) {
            if (error.code === 'ENOENT')
                return [];
            throw error;
        }
    }
    async guardar(tareas) {
        const json = tareas.map(t => this.mapearAJson(t));
        await fs_1.promises.writeFile(this.rutaArchivo, JSON.stringify(json, null, 2), 'utf8');
    }
    mapearATarea(json) {
        try {
            return new Tarea_1.Tarea({
                id: json.id,
                titulo: json.titulo,
                descripcion: json.descripcion,
                estado: this.mapearEstado(json.estado),
                dificultad: this.mapearDificultad(json.dificultad),
                creacion: new Date(json.creacion),
                ultimaEdicion: json.ultimaEdicion ? new Date(json.ultimaEdicion) : undefined,
                vencimiento: json.vencimiento ? new Date(json.vencimiento) : null
            });
        }
        catch (e) {
            return null;
        }
    }
    mapearAJson(tarea) {
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
    mapearEstado(val) {
        if (val === "PENDING")
            return Estado_1.Estado.PENDIENTE;
        if (val === "IN-PROGRESS")
            return Estado_1.Estado.EN_CURSO;
        if (val === "FINISHED")
            return Estado_1.Estado.TERMINADA;
        if (val === "CANCELED")
            return Estado_1.Estado.CANCELADA;
        return Estado_1.Estado.desde(val) || Estado_1.Estado.PENDIENTE;
    }
    mapearDificultad(val) {
        return Dificultad_1.Dificultad.desde(val) || Dificultad_1.Dificultad.FACIL;
    }
    mapearEstadoAJson(estado) {
        if (estado === Estado_1.Estado.PENDIENTE)
            return "PENDING";
        if (estado === Estado_1.Estado.EN_CURSO)
            return "IN-PROGRESS";
        if (estado === Estado_1.Estado.TERMINADA)
            return "FINISHED";
        if (estado === Estado_1.Estado.CANCELADA)
            return "CANCELED";
        return "PENDING";
    }
    mapearDificultadAJson(dificultad) {
        return dificultad.codigo;
    }
}
exports.RepositorioJson = RepositorioJson;
