import { v4 as uuidv4 } from 'uuid';
import { Estado } from './Estado';
import { Dificultad } from './Dificultad';

export interface PropiedadesTarea {
    id?: string;
    titulo: string;
    descripcion?: string | null;
    estado?: Estado;
    dificultad?: Dificultad;
    vencimiento?: Date | null;
    creacion?: Date;
    ultimaEdicion?: Date;
}

/**
 * Entidad principal que representa una Tarea.
 * [FUNCIONAL] Inmutable. Los métodos de modificación devuelven nuevas instancias.
 */
export class Tarea {
    public readonly id: string;
    public readonly titulo: string;
    public readonly descripcion: string | null;
    public readonly estado: Estado;
    public readonly dificultad: Dificultad;
    public readonly creacion: Date;
    public readonly ultimaEdicion: Date;
    public readonly vencimiento: Date | null;

    constructor(props: PropiedadesTarea) {
        this.validarTitulo(props.titulo);
        this.validarDescripcion(props.descripcion);

        this.id = props.id || uuidv4();
        this.titulo = props.titulo.trim();
        this.descripcion = props.descripcion ? props.descripcion.trim() : null;
        this.estado = props.estado || Estado.PENDIENTE;
        this.dificultad = props.dificultad || Dificultad.FACIL;
        this.creacion = props.creacion || new Date();
        this.ultimaEdicion = props.ultimaEdicion || new Date(this.creacion);
        this.vencimiento = props.vencimiento || null;
    }

    // --- Comportamiento (Inmutable) ---

    /**
     * Crea una nueva instancia de Tarea con los datos actualizados.
     * (Copia-al-escribir / Copy-on-write)
     */
    actualizar(datos: Partial<PropiedadesTarea>): Tarea {
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
    estaVencida(): boolean {
        if (!this.vencimiento) return false;
        if (this.estado === Estado.TERMINADA || this.estado === Estado.CANCELADA) return false;
        return this.vencimiento < new Date();
    }

    /**
     * Verifica si la tarea coincide con un término de búsqueda. (Pura)
     */
    contieneTermino(termino: string): boolean {
        const t = termino.toLowerCase();
        return this.titulo.toLowerCase().includes(t) ||
            (this.descripcion?.toLowerCase().includes(t) ?? false);
    }

    /**
     * Verifica si es de alta prioridad. (Pura)
     */
    esPrioridadAlta(): boolean {
        return this.dificultad.codigo >= 3 && this.estado === Estado.PENDIENTE;
    }

    /**
     * Verifica si está relacionada con otra tarea. (Pura)
     */
    esRelacionadaCon(otra: Tarea): boolean {
        if (this.id === otra.id) return false;
        const misPalabras = this.titulo.toLowerCase().split(" ");
        const susPalabras = otra.titulo.toLowerCase().split(" ");
        return misPalabras.some(p => p.length > 3 && susPalabras.includes(p));
    }

    // --- Validaciones Privadas ---

    private validarTitulo(t: string): void {
        if (!t || t.trim().length === 0 || t.trim().length > 100) {
            throw new Error("Título inválido: obligatorio, 1..100 caracteres.");
        }
    }

    private validarDescripcion(d: string | null | undefined): void {
        if (d && d.length > 500) {
            throw new Error("Descripción inválida: hasta 500 caracteres.");
        }
    }
}
