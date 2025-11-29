"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aplicacion = void 0;
const Tarea_1 = require("../modelos/Tarea");
const Estado_1 = require("../modelos/Estado");
const Dificultad_1 = require("../modelos/Dificultad");
/**
 * Clase principal de la aplicación (Capa de Presentación).
 */
class Aplicacion {
    constructor(consola, gestor) {
        this.consola = consola;
        this.gestor = gestor;
        this.usuario = "Usuario";
    }
    async ejecutar() {
        try {
            await this.gestor.iniciar();
            await this.pausa("Presiona Enter para iniciar...");
        }
        catch (e) {
            console.error("Error al iniciar la aplicación.");
            this.consola.cerrar();
            return;
        }
        let salir = false;
        while (!salir) {
            console.clear();
            this.mostrarMenuPrincipal();
            const op = (await this.consola.preguntar("> ")).trim();
            if (op === "0") {
                salir = true;
            }
            else {
                await this.procesarOpcionPrincipal(op);
            }
        }
        await this.gestor.guardarCambios();
        this.consola.cerrar();
        console.log("¡Hasta luego!");
    }
    mostrarMenuPrincipal() {
        console.log(`¡Hola ${this.usuario}!\n`);
        console.log("¿Qué desea hacer?\n");
        console.log("[1] Ver mis tareas");
        console.log("[2] Buscar una tarea");
        console.log("[3] Agregar una tarea");
        console.log("[4] Estadísticas e Inferencias");
        console.log("[0] Salir\n");
    }
    async procesarOpcionPrincipal(op) {
        switch (op) {
            case "1":
                await this.menuVerMisTareas();
                break;
            case "2":
                await this.menuBuscarTarea();
                break;
            case "3":
                await this.menuAgregarTarea();
                break;
            case "4":
                await this.menuEstadisticas();
                break;
            default: await this.pausa("Opción inválida.");
        }
    }
    async menuVerMisTareas() {
        let volver = false;
        while (!volver) {
            console.clear();
            console.log("¿Qué tarea desea ver?\n");
            console.log("[1] Todas (Orden: Título)");
            console.log("[2] Pendientes");
            console.log("[3] En curso");
            console.log("[4] Terminadas");
            console.log("[5] Ordenar por Vencimiento");
            console.log("[6] Ordenar por Creación");
            console.log("[7] Ordenar por Dificultad (Desc)");
            console.log("[0] Volver\n");
            const op = (await this.consola.preguntar("> ")).trim();
            if (op === "0") {
                volver = true;
                continue;
            }
            let lista = [];
            let titulo = "";
            switch (op) {
                case "1":
                    lista = this.gestor.ordenarPorTitulo();
                    titulo = "Todas";
                    break;
                case "2":
                    lista = this.gestor.filtrarPorEstado(Estado_1.Estado.PENDIENTE);
                    titulo = "Pendientes";
                    break;
                case "3":
                    lista = this.gestor.filtrarPorEstado(Estado_1.Estado.EN_CURSO);
                    titulo = "En Curso";
                    break;
                case "4":
                    lista = this.gestor.filtrarPorEstado(Estado_1.Estado.TERMINADA);
                    titulo = "Terminadas";
                    break;
                case "5":
                    lista = this.gestor.ordenarPorVencimiento();
                    titulo = "Por Vencimiento";
                    break;
                case "6":
                    lista = this.gestor.ordenarPorCreacion();
                    titulo = "Por Creación";
                    break;
                case "7":
                    lista = this.gestor.ordenarPorDificultad();
                    titulo = "Por Dificultad";
                    break;
                default:
                    await this.pausa("Opción inválida.");
                    continue;
            }
            if (lista.length > 0) {
                await this.listadoTareas(lista, titulo);
            }
            else {
                await this.pausa("(No hay tareas)");
            }
        }
    }
    async listadoTareas(lista, titulo) {
        let volver = false;
        while (!volver) {
            console.clear();
            console.log(`${titulo}.\n`);
            lista.forEach((t, i) => console.log(`[${i + 1}] ${t.titulo} (${t.estado.etiqueta})`));
            console.log("\n[N] Ver detalles de una tarea | [0] Volver");
            const op = (await this.consola.preguntar("> ")).trim().toUpperCase();
            if (op === "0")
                return;
            const idx = parseInt(op);
            if (!isNaN(idx) && idx >= 1 && idx <= lista.length) {
                await this.menuDetallesTarea(lista[idx - 1]);
            }
            else {
                console.log("Introduce el número de la tarea:");
                const num = parseInt((await this.consola.preguntar("> ")).trim());
                if (!isNaN(num) && num >= 1 && num <= lista.length) {
                    await this.menuDetallesTarea(lista[num - 1]);
                }
            }
        }
    }
    async menuDetallesTarea(tarea) {
        let volver = false;
        while (!volver) {
            console.clear();
            this.mostrarDetalle(tarea);
            const op = (await this.consola.preguntar("> ")).trim().toUpperCase();
            if (op === "0")
                return;
            if (op === "E") {
                await this.menuEdicionTarea(tarea);
                return;
            }
            if (op === "D") {
                await this.eliminarTareaUI(tarea);
                return;
            }
            if (op === "R") {
                await this.verRelacionadas(tarea);
            }
        }
    }
    mostrarDetalle(tarea) {
        console.log("--- Detalle de Tarea ---\n");
        console.log(`Título:     ${tarea.titulo}`);
        console.log(`Desc:       ${tarea.descripcion || "-"}`);
        console.log(`Estado:     ${tarea.estado.etiqueta}`);
        console.log(`Dificultad: ${tarea.dificultad.toString()}`);
        console.log(`Vence:      ${this.formatearFecha(tarea.vencimiento)}`);
        console.log(`Creada:     ${this.formatearFecha(tarea.creacion)}`);
        console.log(`Editada:    ${this.formatearFecha(tarea.ultimaEdicion)}\n`);
        console.log("[E] Editar | [D] Eliminar | [R] Relacionadas | [0] Volver");
    }
    async eliminarTareaUI(tarea) {
        const confirm = await this.consola.preguntar("¿Eliminar? (S/N): ");
        if (confirm.toUpperCase() === "S") {
            this.gestor.eliminarTarea(tarea.id);
            await this.gestor.guardarCambios();
            console.log("Eliminada.");
            await this.pausa("");
        }
    }
    async verRelacionadas(tarea) {
        const relacionadas = this.gestor.obtenerRelacionadas(tarea);
        console.log(`\n--- Relacionadas con "${tarea.titulo}" ---`);
        if (relacionadas.length === 0)
            console.log("Ninguna encontrada.");
        relacionadas.forEach(t => console.log(`- ${t.titulo}`));
        await this.pausa("");
    }
    async menuEdicionTarea(tarea) {
        console.clear();
        console.log(`Editando: ${tarea.titulo}`);
        console.log("(Dejar en blanco para mantener valor actual)\n");
        const desc = await this.consola.preguntar("Descripción: ");
        const estStr = await this.consola.preguntar("Estado (P/E/T/C): ");
        const difStr = await this.consola.preguntar("Dificultad (1/2/3): ");
        const venStr = await this.consola.preguntar("Vencimiento (YYYY-MM-DD): ");
        try {
            const actualizaciones = {};
            if (desc !== "")
                actualizaciones.descripcion = desc === " " ? null : desc;
            if (estStr !== "") {
                const e = Estado_1.Estado.desde(estStr);
                if (e)
                    actualizaciones.estado = e;
            }
            if (difStr !== "") {
                const d = Dificultad_1.Dificultad.desde(difStr);
                if (d)
                    actualizaciones.dificultad = d;
            }
            if (venStr !== "") {
                actualizaciones.vencimiento = venStr === " " ? null : this.parsearFecha(venStr);
            }
            const tareaActualizada = tarea.actualizar(actualizaciones);
            this.gestor.editarTarea(tarea.id, tareaActualizada);
            await this.gestor.guardarCambios();
            console.log("Guardado.");
        }
        catch (e) {
            console.log(`Error: ${e.message}`);
        }
        await this.pausa("");
    }
    async menuAgregarTarea() {
        console.clear();
        console.log("Nueva Tarea\n");
        const tit = await this.consola.preguntar("Título: ");
        const desc = await this.consola.preguntar("Descripción: ");
        const estStr = await this.consola.preguntar("Estado (P/E/T/C): ");
        const difStr = await this.consola.preguntar("Dificultad (1/2/3): ");
        const venStr = await this.consola.preguntar("Vencimiento (YYYY-MM-DD): ");
        try {
            const nueva = new Tarea_1.Tarea({
                titulo: tit,
                descripcion: desc,
                estado: Estado_1.Estado.desde(estStr) || Estado_1.Estado.PENDIENTE,
                dificultad: Dificultad_1.Dificultad.desde(difStr) || Dificultad_1.Dificultad.FACIL,
                vencimiento: venStr ? this.parsearFecha(venStr) : null
            });
            this.gestor.agregarTarea(nueva);
            await this.gestor.guardarCambios();
            console.log("Creada.");
        }
        catch (e) {
            console.log(`Error: ${e.message}`);
        }
        await this.pausa("");
    }
    async menuBuscarTarea() {
        console.clear();
        const q = (await this.consola.preguntar("Buscar: ")).trim();
        if (!q)
            return;
        const res = this.gestor.buscarPorTitulo(q);
        if (res.length > 0)
            await this.listadoTareas(res, "Resultados");
        else
            await this.pausa("No se encontraron resultados.");
    }
    async menuEstadisticas() {
        console.clear();
        const stats = this.gestor.obtenerEstadisticas();
        console.log("--- Estadísticas ---\n");
        console.log(`Total: ${stats.total}`);
        Object.entries(stats.porEstado).forEach(([k, v]) => console.log(`${k}: ${v}`));
        console.log("\n--- Inferencias ---\n");
        const vencidas = this.gestor.obtenerVencidas();
        console.log(`Vencidas: ${vencidas.length}`);
        const altas = this.gestor.obtenerPrioridadAlta();
        console.log(`Prioridad Alta: ${altas.length}`);
        await this.pausa("");
    }
    async pausa(msg) {
        await this.consola.preguntar(msg ? `\n${msg}` : "\nPresiona Enter...");
    }
    // Helpers de UI
    formatearFecha(d) {
        if (!d)
            return "Sin datos";
        const pad = (n) => (n < 10 ? "0" + n : n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    parsearFecha(s) {
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    }
}
exports.Aplicacion = Aplicacion;
