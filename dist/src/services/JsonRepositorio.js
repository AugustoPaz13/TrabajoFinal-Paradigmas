"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRepositorio = void 0;
const fs_1 = require("fs");
const Tarea_1 = require("../models/Tarea");
const Estado_1 = require("../models/Estado");
const Dificultad_1 = require("../models/Dificultad");
/**
 * Implementación del repositorio usando un archivo JSON.
 */
class JsonRepositorio {
    constructor(filePath) {
        this.filePath = filePath;
    }
    async cargar() {
        try {
            const data = await fs_1.promises.readFile(this.filePath, 'utf8');
            const json = JSON.parse(data);
            if (!Array.isArray(json))
                return [];
            return json.map((item) => this.mapToTarea(item)).filter((t) => t !== null);
        }
        catch (error) {
            if (error.code === 'ENOENT')
                return [];
            throw error;
        }
    }
    async guardar(tareas) {
        const json = tareas.map(t => this.mapToJson(t));
        await fs_1.promises.writeFile(this.filePath, JSON.stringify(json, null, 2), 'utf8');
    }
    mapToTarea(json) {
        try {
            return new Tarea_1.Tarea({
                id: json.id,
                titulo: json.titulo,
                descripcion: json.descripcion,
                estado: this.mapEstado(json.estado),
                dificultad: this.mapDificultad(json.dificultad),
                creacion: new Date(json.creacion),
                ultimaEdicion: json.ultimaEdicion ? new Date(json.ultimaEdicion) : undefined,
                vencimiento: json.vencimiento ? new Date(json.vencimiento) : null
            });
        }
        catch (e) {
            return null;
        }
    }
    mapToJson(tarea) {
        return {
            id: tarea.id,
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            estado: this.mapEstadoToJson(tarea.estado),
            dificultad: this.mapDificultadToJson(tarea.dificultad),
            creacion: tarea.creacion.toISOString(),
            ultimaEdicion: tarea.ultimaEdicion.toISOString(),
            vencimiento: tarea.vencimiento?.toISOString() || null
        };
    }
    mapEstado(val) {
        // Mapeo legacy
        if (val === "PENDING")
            return Estado_1.Estado.PENDIENTE;
        if (val === "IN-PROGRESS")
            return Estado_1.Estado.EN_CURSO;
        if (val === "FINISHED")
            return Estado_1.Estado.TERMINADA;
        if (val === "CANCELED")
            return Estado_1.Estado.CANCELADA;
        return Estado_1.Estado.from(val) || Estado_1.Estado.PENDIENTE;
    }
    mapDificultad(val) {
        return Dificultad_1.Dificultad.from(val) || Dificultad_1.Dificultad.FACIL;
    }
    mapEstadoToJson(estado) {
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
    mapDificultadToJson(dificultad) {
        return dificultad.code;
    }
}
exports.JsonRepositorio = JsonRepositorio;
