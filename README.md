# Universidad Nacional de Villa Mercedes (UNViMe)
## Ingenieria en Sistemas de Información
### Cátedra: Paradigmas de la Programación

---

# Trabajo Práctico Final: Sistema de Gestión de Tareas Multiparadigma

*Alumnos:* Augusto Paz, Mauro Aguilar, Ramiro Fernandez, Ignacio Milone
*Fecha:* 29 de Noviembre de 2025

---

## 1. Introducción

El presente informe detalla el desarrollo e implementación de una aplicación de consola para la gestión de tareas (To-Do List), diseñada bajo un enfoque *multiparadigma. El objetivo principal del proyecto fue integrar y demostrar la aplicación práctica de los paradigmas de programación **Estructurado, **Orientado a Objetos, **Funcional* y *Lógico* en un único sistema coherente y robusto.

El sistema permite a los usuarios crear, leer, actualizar y eliminar tareas, así como realizar consultas avanzadas basadas en inferencias lógicas y obtener estadísticas sobre su productividad.

## 2. Objetivos Alcanzados

*   *Migración y Tipado:* Se migró una base de código JavaScript heredada a *TypeScript*, asegurando tipado estático y mayor seguridad en tiempo de compilación.
*   *Persistencia de Datos:* Implementación de almacenamiento persistente mediante archivos JSON.
*   *Arquitectura Modular:* Diseño de una arquitectura en capas (Model-View-Controller/Service) que desacopla la lógica de negocio de la presentación y la persistencia.
*   *Integración de Paradigmas:* Aplicación exitosa de cuatro paradigmas de programación distintos para resolver diferentes aspectos del problema.

## 3. Desarrollo y Paradigmas Aplicados

### 3.1. Paradigma Estructurado
Se aplicó en el punto de entrada de la aplicación (index.ts) y en la orquestación del flujo principal.
*   *Características:* Uso de secuencias, selección (if/switch) e iteración (while) claras.
*   *Modularización:* Descomposición de problemas grandes en procedimientos más pequeños.
*   *Validación:* Verificación robusta de entradas de usuario antes del procesamiento.

### 3.2. Paradigma Orientado a Objetos (POO)
Utilizado para modelar las entidades del dominio y la estructura arquitectónica del sistema.
*   *Encapsulamiento:* Las clases Tarea, Estado y Dificultad protegen su estado interno y exponen comportamientos seguros.
*   *Polimorfismo y Abstracción:* Uso de interfaces (Repositorio) para desacoplar la implementación concreta de la persistencia (RepositorioJson), siguiendo el Principio de Inversión de Dependencias (SOLID).
*   *Responsabilidad Única:* Separación clara entre GestorTareas (Lógica), Aplicacion (UI) y Consola (I/O).

### 3.3. Paradigma Funcional
Implementado para la transformación de datos, filtrado y operaciones sobre colecciones.
*   *Inmutabilidad:* La clase Tarea es inmutable; las actualizaciones retornan nuevas instancias en lugar de modificar el objeto original.
*   *Funciones Puras:* La lógica de filtrado, ordenamiento y cálculo de estadísticas se reside en funciones puras (src/funcional/operaciones.ts) sin efectos secundarios.
*   *Funciones de Orden Superior:* Uso extensivo de map, filter, reduce y funciones que retornan otras funciones (currificación) para crear filtros dinámicos.
*   *Composición:* Implementación de una utilidad tuberia (pipe) para encadenar operaciones de forma declarativa.

### 3.4. Paradigma Lógico
Se desarrolló un motor de inferencia simulado para realizar consultas complejas sobre la base de conocimientos (las tareas).
*   *Hechos y Predicados:* Definición de predicados atómicos como tieneVencimiento o esDificil.
*   *Reglas de Inferencia:* Construcción de reglas complejas como esVencida o esPrioridadAlta basadas en la combinación lógica de predicados más simples.
*   *Eficiencia:* Ordenamiento de cláusulas (Short-circuit evaluation) colocando las condiciones más restrictivas o computacionalmente baratas al principio.

## 4. Arquitectura del Sistema

El proyecto se estructura en los siguientes módulos:

*   src/modelos/: Definición de entidades (Tarea, Estado, Dificultad).
*   src/servicios/: Lógica de negocio (GestorTareas) y acceso a datos (RepositorioJson).
*   src/presentacion/: Interfaz de usuario (Aplicacion) y manejo de entrada/salida (Consola).
*   src/logica/: Predicados y reglas del paradigma lógico.
*   src/funcional/: Operaciones puras y transformaciones del paradigma funcional.
*   src/utilidades/: Herramientas genéricas (ej. composición funcional).

## 5. Funcionalidades

1.  *Gestión de Tareas (CRUD):* Alta, Baja y Modificación de tareas con validaciones.
2.  *Búsqueda y Filtrado:* Búsqueda por título y filtros por estado (Pendiente, En Curso, Terminada).
3.  *Ordenamiento Avanzado:* Por título, fecha de vencimiento, fecha de creación y dificultad.
4.  *Estadísticas:* Reportes automáticos de cantidad de tareas por estado y dificultad.
5.  *Inferencias Inteligentes:*
    *   Detección automática de tareas vencidas.
    *   Identificación de tareas de "Prioridad Alta" (Difíciles y Pendientes).
    *   Sugestión de tareas relacionadas por palabras clave en el título.

## 6. Conclusión

Este Trabajo Práctico Final demuestra cómo la combinación de diferentes paradigmas de programación permite construir software más robusto, mantenible y expresivo. Mientras que la POO ofrece una excelente estructura para el modelado del dominio, el paradigma Funcional brilla en el procesamiento de datos y la Lógica permite expresar reglas de negocio complejas de manera declarativa. La integración de estos enfoques resulta en una aplicación moderna y de alta calidad técnica.
