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
exports.Tarea = void 0;
const crypto = __importStar(require("crypto"));
const Estado_1 = require("./Estado");
const Dificultad_1 = require("./Dificultad");
/**
 * Entidad principal que representa una Tarea.
 * [FUNCIONAL] Inmutable. Los métodos de modificación devuelven nuevas instancias.
 */
class Tarea {
    constructor(props) {
        this.validarTitulo(props.titulo);
        this.validarDescripcion(props.descripcion);
        this.id = props.id || crypto.randomUUID();
        this.titulo = props.titulo.trim();
        this.descripcion = props.descripcion ? props.descripcion.trim() : null;
        this.estado = props.estado || Estado_1.Estado.PENDIENTE;
        this.dificultad = props.dificultad || Dificultad_1.Dificultad.FACIL;
        this.creacion = props.creacion || new Date();
        this.ultimaEdicion = props.ultimaEdicion || new Date(this.creacion);
        this.vencimiento = props.vencimiento || null;
    }
    // --- Comportamiento (Inmutable) ---
    /**
     * Crea una nueva instancia de Tarea con los datos actualizados.
     * (Copia-al-escribir / Copy-on-write)
     */
    actualizar(datos) {
        const nuevosDatos = { ...datos }; // Copia superficial
        if (nuevosDatos.titulo !== undefined) {
            this.validarTitulo(nuevosDatos.titulo);
            nuevosDatos.titulo = nuevosDatos.titulo.trim();
        }
        if (nuevosDatos.descripcion !== undefined) {
            this.validarDescripcion(nuevosDatos.descripcion);
            nuevosDatos.descripcion = nuevosDatos.descripcion ? nuevosDatos.descripcion.trim() : null;
        }
        return new Tarea({
            id: this.id,
            titulo: nuevosDatos.titulo ?? this.titulo,
            descripcion: nuevosDatos.descripcion !== undefined ? nuevosDatos.descripcion : this.descripcion,
            estado: nuevosDatos.estado ?? this.estado,
            dificultad: nuevosDatos.dificultad ?? this.dificultad,
            vencimiento: nuevosDatos.vencimiento !== undefined ? nuevosDatos.vencimiento : this.vencimiento,
            creacion: this.creacion,
            ultimaEdicion: new Date() // Efecto secundario controlado: nueva fecha
        });
    }
    /**
     * Verifica si la tarea está vencida. (Pura)
     */
    estaVencida() {
        if (!this.vencimiento)
            return false;
        if (this.estado === Estado_1.Estado.TERMINADA || this.estado === Estado_1.Estado.CANCELADA)
            return false;
        return this.vencimiento < new Date();
    }
    /**
     * Verifica si la tarea coincide con un término de búsqueda. (Pura)
     */
    contieneTermino(termino) {
        const t = termino.toLowerCase();
        return this.titulo.toLowerCase().includes(t) ||
            (this.descripcion?.toLowerCase().includes(t) ?? false);
    }
    /**
     * Verifica si es de alta prioridad. (Pura)
     */
    esPrioridadAlta() {
        return this.dificultad.codigo >= 3 && this.estado === Estado_1.Estado.PENDIENTE;
    }
    /**
     * Verifica si está relacionada con otra tarea. (Pura)
     */
    esRelacionadaCon(otra) {
        if (this.id === otra.id)
            return false;
        const misPalabras = this.titulo.toLowerCase().split(" ");
        const susPalabras = otra.titulo.toLowerCase().split(" ");
        return misPalabras.some(p => p.length > 3 && susPalabras.includes(p));
    }
    // --- Validaciones Privadas ---
    validarTitulo(t) {
        if (!t || t.trim().length === 0 || t.trim().length > 100) {
            throw new Error("Título inválido: obligatorio, 1..100 caracteres.");
        }
    }
    validarDescripcion(d) {
        if (d && d.length > 500) {
            throw new Error("Descripción inválida: hasta 500 caracteres.");
        }
    }
}
exports.Tarea = Tarea;
