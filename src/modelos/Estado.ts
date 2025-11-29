/**
 * Representa el estado de una tarea.
 * Utiliza el patrón Singleton/Flyweight para los valores predefinidos.
 */
export class Estado {
    private constructor(
        public readonly codigo: string,
        public readonly etiqueta: string
    ) { }

    static readonly PENDIENTE = new Estado("P", "Pendiente");
    static readonly EN_CURSO = new Estado("E", "En curso");
    static readonly TERMINADA = new Estado("T", "Terminada");
    static readonly CANCELADA = new Estado("C", "Cancelada");

    /**
     * Obtiene todos los estados disponibles.
     */
    static valores(): Estado[] {
        return [this.PENDIENTE, this.EN_CURSO, this.TERMINADA, this.CANCELADA];
    }

    /**
     * Busca un estado por su código o etiqueta.
     * @param valor String de búsqueda.
     */
    static desde(valor: string | undefined): Estado | null {
        if (!valor) return null;
        const v = valor.trim().toUpperCase();
        if (v === "P" || v === "PENDIENTE") return this.PENDIENTE;
        if (v === "E" || v === "EN CURSO" || v === "EN_CURSO") return this.EN_CURSO;
        if (v === "T" || v === "TERMINADA") return this.TERMINADA;
        if (v === "C" || v === "CANCELADA") return this.CANCELADA;
        return null;
    }

    toString(): string {
        return this.etiqueta;
    }
}
