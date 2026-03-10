import * as path from 'path';
import express, { Request, Response } from 'express';
import { GestorTareas } from './src/servicios/GestorTareas';
import { RepositorioJson } from './src/servicios/RepositorioJson';
import { Tarea, PropiedadesTarea } from './src/modelos/Tarea';
import { Estado } from './src/modelos/Estado';
import { Dificultad } from './src/modelos/Dificultad';

const app = express();
const PORT = 3000;

// Usar process.cwd() que devuelve el directorio desde donde se ejecutó el comando
const RUTA_RAIZ = process.cwd();
const RUTA_PUBLIC = path.join(RUTA_RAIZ, 'public');
const RUTA_ARCHIVO_TAREAS = path.join(RUTA_RAIZ, 'tasks.json');

console.log('Directorio raíz:', RUTA_RAIZ);
console.log('Directorio public:', RUTA_PUBLIC);

// Middleware
app.use(express.json());
app.use(express.static(RUTA_PUBLIC));

// Ruta raíz explícita
app.get('/', (_req, res) => {
    res.sendFile(path.join(RUTA_PUBLIC, 'index.html'));
});

// Inicializar el gestor
const repositorio = new RepositorioJson(RUTA_ARCHIVO_TAREAS);
const gestor = new GestorTareas(repositorio);

// Iniciar el gestor y servidor
(async () => {
    await gestor.iniciar();
    console.log('Tareas cargadas desde el archivo JSON.');

    // --- API REST ---

    // Obtener todas las tareas
    app.get('/api/tareas', (_req: Request, res: Response) => {
        const tareas = gestor.ordenarPorCreacion();
        res.json(tareas.map(t => serializarTarea(t)));
    });

    // Obtener tareas filtradas por estado
    app.get('/api/tareas/estado/:estado', (req: Request, res: Response) => {
        const estado = Estado.desde(req.params.estado);
        if (!estado) {
            res.status(400).json({ error: 'Estado inválido' });
            return;
        }
        const tareas = gestor.filtrarPorEstado(estado);
        res.json(tareas.map(t => serializarTarea(t)));
    });

    // Buscar tareas
    app.get('/api/tareas/buscar/:query', (req: Request, res: Response) => {
        const tareas = gestor.buscarPorTitulo(req.params.query);
        res.json(tareas.map(t => serializarTarea(t)));
    });

    // Obtener estadísticas
    app.get('/api/estadisticas', (_req: Request, res: Response) => {
        const stats = gestor.obtenerEstadisticas();
        const vencidas = gestor.obtenerVencidas();
        const prioridadAlta = gestor.obtenerPrioridadAlta();
        res.json({
            ...stats,
            vencidas: vencidas.length,
            prioridadAlta: prioridadAlta.length
        });
    });

    // Crear nueva tarea
    app.post('/api/tareas', async (req: Request, res: Response) => {
        try {
            const datos = req.body as PropiedadesTarea;
            const nueva = new Tarea({
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                estado: Estado.desde(datos.estado as unknown as string) || Estado.PENDIENTE,
                dificultad: Dificultad.desde(datos.dificultad as unknown as string | number) || Dificultad.FACIL,
                vencimiento: datos.vencimiento ? new Date(datos.vencimiento as unknown as string) : null
            });
            gestor.agregarTarea(nueva);
            await gestor.guardarCambios();
            res.status(201).json(serializarTarea(nueva));
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    // Actualizar tarea
    app.put('/api/tareas/:id', async (req: Request, res: Response) => {
        try {
            const tareas = gestor.ordenarPorCreacion();
            const tarea = tareas.find(t => t.id === req.params.id);
            if (!tarea) {
                res.status(404).json({ error: 'Tarea no encontrada' });
                return;
            }

            const datos = req.body;
            const actualizaciones: Partial<PropiedadesTarea> = {};

            if (datos.titulo !== undefined) actualizaciones.titulo = datos.titulo;
            if (datos.descripcion !== undefined) actualizaciones.descripcion = datos.descripcion;
            if (datos.estado !== undefined) {
                const estado = Estado.desde(datos.estado);
                if (estado) actualizaciones.estado = estado;
            }
            if (datos.dificultad !== undefined) {
                const dificultad = Dificultad.desde(datos.dificultad);
                if (dificultad) actualizaciones.dificultad = dificultad;
            }
            if (datos.vencimiento !== undefined) {
                actualizaciones.vencimiento = datos.vencimiento ? new Date(datos.vencimiento) : null;
            }

            const tareaActualizada = tarea.actualizar(actualizaciones);
            gestor.editarTarea(tarea.id, tareaActualizada);
            await gestor.guardarCambios();
            res.json(serializarTarea(tareaActualizada));
        } catch (e: any) {
            res.status(400).json({ error: e.message });
        }
    });

    // Obtener tareas vencidas
    app.get('/api/tareas/vencidas', (_req: Request, res: Response) => {
        const tareas = gestor.obtenerVencidas();
        res.json(tareas.map(t => serializarTarea(t)));
    });

    // Obtener tareas de prioridad alta
    app.get('/api/tareas/prioridad-alta', (_req: Request, res: Response) => {
        const tareas = gestor.obtenerPrioridadAlta();
        res.json(tareas.map(t => serializarTarea(t)));
    });

    // Obtener tareas relacionadas con una tarea específica
    app.get('/api/tareas/:id/relacionadas', (req: Request, res: Response) => {
        const todasLasTareas = gestor.ordenarPorCreacion();
        const tarea = todasLasTareas.find(t => t.id === req.params.id);
        if (!tarea) {
            res.status(404).json({ error: 'Tarea no encontrada' });
            return;
        }
        const relacionadas = gestor.obtenerRelacionadas(tarea);
        res.json(relacionadas.map(t => serializarTarea(t)));
    });

    // Eliminar tarea
    app.delete('/api/tareas/:id', async (req: Request, res: Response) => {
        const tareas = gestor.ordenarPorCreacion();
        const tarea = tareas.find(t => t.id === req.params.id);
        if (!tarea) {
            res.status(404).json({ error: 'Tarea no encontrada' });
            return;
        }
        gestor.eliminarTarea(tarea.id);
        await gestor.guardarCambios();
        res.status(204).send();
    });

    // Iniciar servidor
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
})();

// Helper para serializar tareas
function serializarTarea(tarea: Tarea) {
    return {
        id: tarea.id,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        estado: tarea.estado.codigo,
        estadoEtiqueta: tarea.estado.etiqueta,
        dificultad: tarea.dificultad.codigo,
        dificultadEtiqueta: tarea.dificultad.etiqueta,
        dificultadEstrellas: tarea.dificultad.estrellas,
        creacion: tarea.creacion.toISOString(),
        ultimaEdicion: tarea.ultimaEdicion.toISOString(),
        vencimiento: tarea.vencimiento?.toISOString() || null,
        estaVencida: tarea.estaVencida(),
        esPrioridadAlta: tarea.esPrioridadAlta()
    };
}
