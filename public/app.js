// ===== Estado de la Aplicación =====
let tareas = [];
let filtroActual = 'todas';
let ordenActual = 'titulo';
let tareaViendoDetalle = null;
let tareaEditando = null;
let tareaAEliminar = null;

// ===== Elementos del DOM =====
const tasksContainer = document.getElementById('tasks-container');
const emptyState = document.getElementById('empty-state');
const contentTitle = document.getElementById('content-title');
const inputBuscar = document.getElementById('input-buscar');
const selectOrden = document.getElementById('select-orden');
const btnNueva = document.getElementById('btn-nueva');
const btnTheme = document.getElementById('btn-theme');

// Modal de tarea
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const formTarea = document.getElementById('form-tarea');
const inputId = document.getElementById('input-id');
const inputTitulo = document.getElementById('input-titulo');
const inputDescripcion = document.getElementById('input-descripcion');
const inputEstado = document.getElementById('input-estado');
const inputDificultad = document.getElementById('input-dificultad');
const inputVencimiento = document.getElementById('input-vencimiento');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelar = document.getElementById('btn-cancelar');

// Modal de eliminar
const modalEliminar = document.getElementById('modal-eliminar');
const tareaAEliminarTexto = document.getElementById('tarea-a-eliminar');
const btnCloseEliminar = document.getElementById('btn-close-eliminar');
const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');

// Modal de detalle
const modalDetalle = document.getElementById('modal-detalle');
const btnCloseDetalle = document.getElementById('btn-close-detalle');
const btnDetalleEditar = document.getElementById('btn-detalle-editar');
const btnDetalleEliminar = document.getElementById('btn-detalle-eliminar');

// Navegación
const navItems = document.querySelectorAll('.nav-item');

// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    cargarTareas();
    configurarEventListeners();
});

// ===== Tema Claro/Oscuro =====
function inicializarTema() {
    const temaGuardado = localStorage.getItem('tema') || 'light';
    document.documentElement.setAttribute('data-theme', temaGuardado);
}

function toggleTema() {
    const temaActual = document.documentElement.getAttribute('data-theme');
    const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('tema', nuevoTema);
}

// ===== API =====
async function cargarTareas() {
    try {
        const response = await fetch('/api/tareas');
        tareas = await response.json();
        renderizarTareas();
        actualizarEstadisticas();
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
}

async function crearTarea(datos) {
    try {
        const response = await fetch('/api/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        await cargarTareas();
        return true;
    } catch (error) {
        alert('Error: ' + error.message);
        return false;
    }
}

async function actualizarTarea(id, datos) {
    try {
        const response = await fetch(`/api/tareas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }
        await cargarTareas();
        return true;
    } catch (error) {
        alert('Error: ' + error.message);
        return false;
    }
}

async function eliminarTarea(id) {
    try {
        const response = await fetch(`/api/tareas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar');
        await cargarTareas();
        return true;
    } catch (error) {
        alert('Error: ' + error.message);
        return false;
    }
}

async function buscarTareas(query) {
    try {
        const response = await fetch(`/api/tareas/buscar/${encodeURIComponent(query)}`);
        return await response.json();
    } catch (error) {
        console.error('Error al buscar:', error);
        return [];
    }
}

async function fetchVencidas() {
    try {
        const response = await fetch('/api/tareas/vencidas');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener vencidas:', error);
        return [];
    }
}

async function fetchPrioridadAlta() {
    try {
        const response = await fetch('/api/tareas/prioridad-alta');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener prioridad alta:', error);
        return [];
    }
}

async function fetchRelacionadas(id) {
    try {
        const response = await fetch(`/api/tareas/${id}/relacionadas`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener relacionadas:', error);
        return [];
    }
}

// ===== Renderizado =====
function renderizarTareas() {
    let tareasFiltradas;

    // Los filtros de vencidas y prioridad-alta se manejan de forma asíncrona
    if (filtroActual === 'vencidas' || filtroActual === 'prioridad-alta') {
        // Estos se renderizan desde renderizarFiltroEspecial()
        return;
    }

    tareasFiltradas = filtrarTareas();
    _renderizarLista(tareasFiltradas);
}

async function renderizarFiltroEspecial(filtro) {
    tasksContainer.innerHTML = '<div class="loading">Cargando...</div>';
    emptyState.style.display = 'none';

    let lista = [];
    if (filtro === 'vencidas') lista = await fetchVencidas();
    else if (filtro === 'prioridad-alta') lista = await fetchPrioridadAlta();

    lista = ordenarTareas(lista);
    _renderizarLista(lista);
}

function _renderizarLista(lista) {
    tasksContainer.innerHTML = '';
    if (lista.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    lista.forEach(tarea => {
        const card = crearTarjetaTarea(tarea);
        tasksContainer.appendChild(card);
    });
}

function filtrarTareas() {
    const base = filtroActual === 'todas'
        ? [...tareas]
        : tareas.filter(t => t.estado === filtroActual);
    return ordenarTareas(base);
}

function ordenarTareas(lista) {
    return [...lista].sort((a, b) => {
        switch (ordenActual) {
            case 'titulo':
                return a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' });
            case 'vencimiento': {
                if (!a.vencimiento && !b.vencimiento) return 0;
                if (!a.vencimiento) return 1;
                if (!b.vencimiento) return -1;
                return new Date(a.vencimiento) - new Date(b.vencimiento);
            }
            case 'creacion':
                return new Date(a.creacion) - new Date(b.creacion);
            case 'dificultad':
                return b.dificultad - a.dificultad;
            default:
                return 0;
        }
    });
}

function crearTarjetaTarea(tarea) {
    const card = document.createElement('div');
    card.className = `task-card${tarea.estaVencida ? ' vencida' : ''}`;
    card.onclick = () => abrirModalDetalle(tarea);

    const estadoClase = obtenerClaseEstado(tarea.estado);

    card.innerHTML = `
        <div class="task-header">
            <h3 class="task-title">${escapeHtml(tarea.titulo)}</h3>
            <div class="task-badges">
                <span class="task-estado ${estadoClase}">${tarea.estadoEtiqueta}</span>
            </div>
        </div>
        ${tarea.descripcion ? `<p class="task-descripcion">${escapeHtml(tarea.descripcion)}</p>` : ''}
        <div class="task-meta">
            <div class="task-info">
                <span class="task-dificultad">${tarea.dificultadEstrellas} ${tarea.dificultadEtiqueta}</span>
                ${tarea.vencimiento ? `<span>📅 ${formatearFecha(tarea.vencimiento)}</span>` : ''}
                ${tarea.estaVencida ? '<span style="color: #dc3545;">⚠️ Vencida</span>' : ''}
                ${tarea.esPrioridadAlta ? '<span style="color: #ff922b;">🔥 Prioridad alta</span>' : ''}
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); abrirModalEditar(tareas.find(t => t.id === '${tarea.id}'))">✏️ Editar</button>
                <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); abrirModalEliminar(tareas.find(t => t.id === '${tarea.id}'))">🗑️ Eliminar</button>
            </div>
        </div>
    `;

    return card;
}

function obtenerClaseEstado(codigo) {
    const clases = {
        'P': 'pendiente',
        'E': 'encurso',
        'T': 'terminada',
        'C': 'cancelada'
    };
    return clases[codigo] || 'pendiente';
}

function actualizarEstadisticas() {
    // Contadores por estado
    const contadores = {
        todas: tareas.length,
        P: tareas.filter(t => t.estado === 'P').length,
        E: tareas.filter(t => t.estado === 'E').length,
        T: tareas.filter(t => t.estado === 'T').length,
        C: tareas.filter(t => t.estado === 'C').length,
        vencidas: tareas.filter(t => t.estaVencida).length,
        prioridadAlta: tareas.filter(t => t.esPrioridadAlta).length
    };

    document.getElementById('count-todas').textContent = contadores.todas;
    document.getElementById('count-pendientes').textContent = contadores.P;
    document.getElementById('count-encurso').textContent = contadores.E;
    document.getElementById('count-terminadas').textContent = contadores.T;
    document.getElementById('count-canceladas').textContent = contadores.C;
    document.getElementById('count-vencidas').textContent = contadores.vencidas;
    document.getElementById('count-prioridad-alta').textContent = contadores.prioridadAlta;

    // Estadísticas generales
    document.getElementById('stat-total').textContent = contadores.todas;
    document.getElementById('stat-vencidas').textContent = contadores.vencidas;
    document.getElementById('stat-prioridad').textContent = contadores.prioridadAlta;
}

// ===== Modal de Detalle =====
async function abrirModalDetalle(tarea) {
    tareaViendoDetalle = tarea;

    document.getElementById('detalle-titulo').textContent = tarea.titulo;
    document.getElementById('detalle-id').textContent = tarea.id;
    document.getElementById('detalle-creacion').textContent = formatearFechaCompleta(tarea.creacion);
    document.getElementById('detalle-ultima-edicion').textContent = formatearFechaCompleta(tarea.ultimaEdicion);

    const vencimientoRow = document.getElementById('detalle-vencimiento-row');
    if (tarea.vencimiento) {
        document.getElementById('detalle-vencimiento').textContent = formatearFecha(tarea.vencimiento);
        vencimientoRow.style.display = '';
    } else {
        vencimientoRow.style.display = 'none';
    }

    // Cargar relacionadas
    const listaEl = document.getElementById('detalle-relacionadas-lista');
    listaEl.innerHTML = '<span class="detalle-empty">Cargando...</span>';
    modalDetalle.classList.add('active');

    const relacionadas = await fetchRelacionadas(tarea.id);
    if (relacionadas.length === 0) {
        listaEl.innerHTML = '<span class="detalle-empty">No hay tareas relacionadas.</span>';
    } else {
        listaEl.innerHTML = relacionadas.map(r => `
            <div class="related-item" onclick="cerrarModalDetalle(); setTimeout(() => abrirModalDetalle(tareas.find(t => t.id === '${r.id}') || ${JSON.stringify(r)}), 200)">
                <span class="related-dot ${obtenerClaseEstado(r.estado)}"></span>
                <span class="related-titulo">${escapeHtml(r.titulo)}</span>
                <span class="related-dificultad">${r.dificultadEstrellas}</span>
            </div>
        `).join('');
    }
}

function cerrarModalDetalle() {
    modalDetalle.classList.remove('active');
    tareaViendoDetalle = null;
}

// ===== Modales de Editar/Nueva =====
function abrirModalNueva() {
    tareaEditando = null;
    modalTitle.textContent = 'Nueva tarea';
    formTarea.reset();
    inputId.value = '';
    modalOverlay.classList.add('active');
    inputTitulo.focus();
}

function abrirModalEditar(tarea) {
    tareaEditando = tarea;
    modalTitle.textContent = 'Editar tarea';
    inputId.value = tarea.id;
    inputTitulo.value = tarea.titulo;
    inputDescripcion.value = tarea.descripcion || '';
    inputEstado.value = tarea.estado;
    inputDificultad.value = tarea.dificultad;
    inputVencimiento.value = tarea.vencimiento ? tarea.vencimiento.split('T')[0] : '';
    modalOverlay.classList.add('active');
    inputTitulo.focus();
}

function cerrarModal() {
    modalOverlay.classList.remove('active');
    tareaEditando = null;
}

function abrirModalEliminar(tarea) {
    tareaAEliminar = tarea;
    tareaAEliminarTexto.textContent = `"${tarea.titulo}"`;
    modalEliminar.classList.add('active');
}

function cerrarModalEliminar() {
    modalEliminar.classList.remove('active');
    tareaAEliminar = null;
}

async function confirmarEliminar() {
    if (tareaAEliminar) {
        await eliminarTarea(tareaAEliminar.id);
        cerrarModalEliminar();
    }
}

// ===== Event Listeners =====
function configurarEventListeners() {
    // Tema
    btnTheme.addEventListener('click', toggleTema);

    // Nueva tarea
    btnNueva.addEventListener('click', abrirModalNueva);

    // Modal de tarea
    btnCloseModal.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) cerrarModal();
    });

    // Modal de eliminar
    btnCloseEliminar.addEventListener('click', cerrarModalEliminar);
    btnCancelarEliminar.addEventListener('click', cerrarModalEliminar);
    btnConfirmarEliminar.addEventListener('click', confirmarEliminar);
    modalEliminar.addEventListener('click', (e) => {
        if (e.target === modalEliminar) cerrarModalEliminar();
    });

    // Modal de detalle
    btnCloseDetalle.addEventListener('click', cerrarModalDetalle);
    modalDetalle.addEventListener('click', (e) => {
        if (e.target === modalDetalle) cerrarModalDetalle();
    });
    btnDetalleEditar.addEventListener('click', () => {
        const t = tareaViendoDetalle;
        cerrarModalDetalle();
        setTimeout(() => abrirModalEditar(t), 200);
    });
    btnDetalleEliminar.addEventListener('click', () => {
        const t = tareaViendoDetalle;
        cerrarModalDetalle();
        setTimeout(() => abrirModalEliminar(t), 200);
    });

    // Formulario
    formTarea.addEventListener('submit', async (e) => {
        e.preventDefault();

        const datos = {
            titulo: inputTitulo.value.trim(),
            descripcion: inputDescripcion.value.trim() || null,
            estado: inputEstado.value,
            dificultad: parseInt(inputDificultad.value),
            vencimiento: inputVencimiento.value || null
        };

        let exito;
        if (tareaEditando) {
            exito = await actualizarTarea(tareaEditando.id, datos);
        } else {
            exito = await crearTarea(datos);
        }

        if (exito) {
            cerrarModal();
        }
    });

    // Navegación (filtros)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            filtroActual = item.dataset.filter;
            contentTitle.textContent = obtenerTituloFiltro(filtroActual);

            if (filtroActual === 'vencidas' || filtroActual === 'prioridad-alta') {
                renderizarFiltroEspecial(filtroActual);
            } else {
                renderizarTareas();
            }
        });
    });

    // Ordenamiento
    selectOrden.addEventListener('change', () => {
        ordenActual = selectOrden.value;
        renderizarTareas();
    });

    // Búsqueda
    let timeoutBusqueda;
    inputBuscar.addEventListener('input', (e) => {
        clearTimeout(timeoutBusqueda);
        const query = e.target.value.trim();

        if (query === '') {
            cargarTareas();
            return;
        }

        timeoutBusqueda = setTimeout(async () => {
            tareas = await buscarTareas(query);
            filtroActual = 'todas';
            navItems.forEach(i => i.classList.remove('active'));
            navItems[0].classList.add('active');
            contentTitle.textContent = `Resultados: "${query}"`;
            renderizarTareas();
            actualizarEstadisticas();
        }, 300);
    });

    // Escape para cerrar modales
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarModal();
            cerrarModalEliminar();
            cerrarModalDetalle();
        }
    });
}

function obtenerTituloFiltro(filtro) {
    const titulos = {
        'todas': 'Todas las tareas',
        'P': 'Tareas pendientes',
        'E': 'Tareas en curso',
        'T': 'Tareas terminadas',
        'C': 'Tareas canceladas',
        'vencidas': '⚠️ Tareas vencidas',
        'prioridad-alta': '🔥 Prioridad alta'
    };
    return titulos[filtro] || 'Tareas';
}

// ===== Utilidades =====
function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function formatearFechaCompleta(fechaISO) {
    if (!fechaISO) return '-';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


