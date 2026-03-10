import * as path from 'path';
import { Consola } from './src/presentacion/Consola';
import { Aplicacion } from './src/presentacion/Aplicacion';
import { GestorTareas } from './src/servicios/GestorTareas';
import { RepositorioJson } from './src/servicios/RepositorioJson';

const RUTA_ARCHIVO_TAREAS = path.join(__dirname, '..', 'tasks.json');

(async function main() {
    // Inyección de dependencias
    const consola = new Consola();
    const repositorio = new RepositorioJson(RUTA_ARCHIVO_TAREAS);
    const gestor = new GestorTareas(repositorio);
    const app = new Aplicacion(consola, gestor);

    await app.ejecutar();
})();
