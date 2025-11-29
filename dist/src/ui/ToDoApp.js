"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToDoApp = void 0;
const Tarea_1 = require("../models/Tarea");
const Estado_1 = require("../models/Estado");
const Dificultad_1 = require("../models/Dificultad");
/**
 * Clase principal de la aplicación (Capa de Presentación).
 * Maneja la interacción con el usuario y delega la lógica al GestorTareas.
 */
class ToDoApp {
    constructor(io, gestor) {
        this.io = io;
        this.gestor = gestor;
        this.username = "Usuario";
    }
    async run() {
        try {
            await this.gestor.iniciar();
            await this.pauseMsg("Presiona Enter para iniciar...");
        }
        catch (e) {
            console.error("Error al iniciar la aplicación.");
            this.io.close();
            return;
        }
        let salir = false;
        while (!salir) {
            console.clear();
            this.mostrarMenuPrincipal();
            const op = (await this.io.ask("> ")).trim();
            if (op === "0") {
                salir = true;
            }
            else {
                await this.procesarOpcionPrincipal(op);
            }
        }
        await this.gestor.guardarCambios();
        this.io.close();
        console.log("¡Hasta luego!");
    }
    mostrarMenuPrincipal() {
        console.log(`¡Hola ${this.username}!\n`);
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
            default: await this.pauseMsg("Opción inválida.");
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
            const op = (await this.io.ask("> ")).trim();
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
                    await this.pauseMsg("Opción inválida.");
                    continue;
            }
            if (lista.length > 0) {
                await this.listadoTareas(lista, titulo);
            }
            else {
                await this.pauseMsg("(No hay tareas)");
            }
        }
    }
    async listadoTareas(lista, titulo) {
        let volver = false;
        while (!volver) {
            console.clear();
            console.log(`${titulo}.\n`);
            lista.forEach((t, i) => console.log(`[${i + 1}] ${t.titulo} (${t.estado.label})`));
            console.log("\n[N] Ver detalles de una tarea | [0] Volver");
            const op = (await this.io.ask("> ")).trim().toUpperCase();
            if (op === "0")
                return;
            const idx = parseInt(op);
            if (!isNaN(idx) && idx >= 1 && idx <= lista.length) {
                await this.menuDetallesTarea(lista[idx - 1]);
            }
            else {
                console.log("Introduce el número de la tarea:");
                const num = parseInt((await this.io.ask("> ")).trim());
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
            const op = (await this.io.ask("> ")).trim().toUpperCase();
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
        console.log(`Estado:     ${tarea.estado.label}`);
        console.log(`Dificultad: ${tarea.dificultad.toString()}`);
        console.log(`Vence:      ${this.formatFecha(tarea.vencimiento)}`);
        console.log(`Creada:     ${this.formatFecha(tarea.creacion)}`);
        console.log(`Editada:    ${this.formatFecha(tarea.ultimaEdicion)}\n`);
        console.log("[E] Editar | [D] Eliminar | [R] Relacionadas | [0] Volver");
    }
    async eliminarTareaUI(tarea) {
        const confirm = await this.io.ask("¿Eliminar? (S/N): ");
        if (confirm.toUpperCase() === "S") {
            this.gestor.eliminarTarea(tarea.id);
            await this.gestor.guardarCambios();
            console.log("Eliminada.");
            await this.pauseMsg("");
        }
    }
    async verRelacionadas(tarea) {
        const relacionadas = this.gestor.obtenerRelacionadas(tarea);
        console.log(`\n--- Relacionadas con "${tarea.titulo}" ---`);
        if (relacionadas.length === 0)
            console.log("Ninguna encontrada.");
        relacionadas.forEach(t => console.log(`- ${t.titulo}`));
        await this.pauseMsg("");
    }
    async menuEdicionTarea(tarea) {
        console.clear();
        console.log(`Editando: ${tarea.titulo}`);
        console.log("(Dejar en blanco para mantener valor actual)\n");
        const desc = await this.io.ask("Descripción: ");
        const estStr = await this.io.ask("Estado (P/E/T/C): ");
        const difStr = await this.io.ask("Dificultad (1/2/3): ");
        const venStr = await this.io.ask("Vencimiento (YYYY-MM-DD): ");
        try {
            const updates = {};
            if (desc !== "")
                updates.descripcion = desc === " " ? null : desc;
            if (estStr !== "") {
                const e = Estado_1.Estado.from(estStr);
                if (e)
                    updates.estado = e;
            }
            if (difStr !== "") {
                const d = Dificultad_1.Dificultad.from(difStr);
                if (d)
                    updates.dificultad = d;
            }
            if (venStr !== "") {
                updates.vencimiento = venStr === " " ? null : this.parseFecha(venStr);
            }
            // [FUNCIONAL] Inmutabilidad: actualizar devuelve una nueva tarea
            const tareaActualizada = tarea.actualizar(updates);
            // Actualizamos en el gestor
            this.gestor.editarTarea(tarea.id, tareaActualizada);
            await this.gestor.guardarCambios();
            console.log("Guardado.");
        }
        catch (e) {
            console.log(`Error: ${e.message}`);
        }
        await this.pauseMsg("");
    }
    async menuAgregarTarea() {
        console.clear();
        console.log("Nueva Tarea\n");
        const tit = await this.io.ask("Título: ");
        const desc = await this.io.ask("Descripción: ");
        const estStr = await this.io.ask("Estado (P/E/T/C): ");
        const difStr = await this.io.ask("Dificultad (1/2/3): ");
        const venStr = await this.io.ask("Vencimiento (YYYY-MM-DD): ");
        try {
            const nueva = new Tarea_1.Tarea({
                titulo: tit,
                descripcion: desc,
                estado: Estado_1.Estado.from(estStr) || Estado_1.Estado.PENDIENTE,
                dificultad: Dificultad_1.Dificultad.from(difStr) || Dificultad_1.Dificultad.FACIL,
                vencimiento: venStr ? this.parseFecha(venStr) : null
            });
            this.gestor.agregarTarea(nueva);
            await this.gestor.guardarCambios();
            console.log("Creada.");
        }
        catch (e) {
            console.log(`Error: ${e.message}`);
        }
        await this.pauseMsg("");
    }
    async menuBuscarTarea() {
        console.clear();
        const q = (await this.io.ask("Buscar: ")).trim();
        if (!q)
            return;
        const res = this.gestor.buscarPorTitulo(q);
        if (res.length > 0)
            await this.listadoTareas(res, "Resultados");
        else
            await this.pauseMsg("No se encontraron resultados.");
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
        await this.pauseMsg("");
    }
    async pauseMsg(msg) {
        await this.io.ask(msg ? `\n${msg}` : "\nPresiona Enter...");
    }
    // Helpers de UI
    formatFecha(d) {
        if (!d)
            return "Sin datos";
        const pad = (n) => (n < 10 ? "0" + n : n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    parseFecha(s) {
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    }
}
exports.ToDoApp = ToDoApp;
