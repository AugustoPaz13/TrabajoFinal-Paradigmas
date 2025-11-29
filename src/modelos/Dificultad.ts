/**
 * Representa la dificultad de una tarea.
 */
export class Dificultad {
    private constructor(
        public readonly codigo: number,
        public readonly etiqueta: string,
        public readonly estrellas: string
    ) { }

    static readonly FACIL = new Dificultad(1, "Fácil", "★☆☆");
    static readonly MEDIO = new Dificultad(2, "Medio", "★★☆");
    static readonly DIFICIL = new Dificultad(3, "Difícil", "★★★");

    static valores(): Dificultad[] {
        return [this.FACIL, this.MEDIO, this.DIFICIL];
    }

    static desde(valor: string | number | undefined): Dificultad | null {
        if (!valor) return null;
        const v = valor.toString().trim().toUpperCase();
        if (v === "1" || v === "F" || v === "FACIL" || v === "FÁCIL") return this.FACIL;
        if (v === "2" || v === "M" || v === "MEDIO") return this.MEDIO;
        if (v === "3" || v === "D" || v === "DIFICIL" || v === "DIFÍCIL") return this.DIFICIL;
        return null;
    }

    toString(): string {
        return `${this.etiqueta} (${this.estrellas})`;
    }
}
