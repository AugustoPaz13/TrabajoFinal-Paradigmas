import { Tarea } from "../modelos/Tarea";

/**
 * Interfaz para el repositorio de tareas.
 * Permite desacoplar la persistencia de la lógica de negocio.
 */
export interface Repositorio {
    cargar(): Promise<Tarea[]>;
    guardar(tareas: Tarea[]): Promise<void>;
}
