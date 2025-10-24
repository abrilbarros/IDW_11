// ==================== Datos y configuración ====================
import { MEDICOS_SEED, ESPECIALIDADES_SEED } from './data-medicos.js';

const KEY = 'medicos';
const LIMITE = 3;
let expandido = false;

// ==================== Referencias HTML ====================
const grilla = document.getElementById('staffGrid');
const buscador = document.getElementById('busqueda');
const filtroEspecialidad = document.getElementById('filtroEspecialidad');

// ==================== localStorage ====================
function leer() {
  const contenidoGuardado = localStorage.getItem(KEY);
  if (!contenidoGuardado) return [];
  try {
    const contenido = JSON.parse(contenidoGuardado);
    return Array.isArray(contenido)
      ? contenido
      : (contenido && Array.isArray(contenido.data) ? contenido.data : []);
  } catch {
    return [];
  }
}

function escribir(lista) {
  localStorage.setItem(KEY, JSON.stringify(lista));
}

function inicializar() {
  if (leer().length === 0) escribir(MEDICOS_SEED);
}

// ==================== Búsqueda ====================
function filtrar() {
  const texto = (buscador?.value || '').trim().toLowerCase();
  const esp = filtroEspecialidad?.value || '';
  return leer().filter(medico => {
    const nombre = (medico.apellidoNombre || '').toLowerCase();
    const especialidad = (medico.especialidad || '').toLowerCase();
    const coincideTexto = !texto || nombre.includes(texto) || especialidad.includes(texto);
    const coincideEsp = !esp || medico.especialidad === esp;
    return coincideTexto && coincideEsp;
  });
}

// ==================== Botón Ver más / Ver menos ====================
function botonVerMas(mostrar, estado) {
  let contenedor = document.getElementById('contenedorVerMas');
  if (!contenedor) {
    grilla.insertAdjacentHTML(
      'afterend',
      '<div id="contenedorVerMas" class="d-grid justify-content-center mt-3"></div>'
    );
    contenedor = document.getElementById('contenedorVerMas');
  }

  if (!mostrar) {
    contenedor.style.display = 'none';
    return;
  }

  contenedor.style.display = '';
  let boton = document.getElementById('btnVerMas');
  if (!boton) {
    contenedor.innerHTML =
      '<button id="btnVerMas" class="btn btn-outline-primary border-2 rounded-pill fw-semibold px-4">Ver más</button>';
    boton = document.getElementById('btnVerMas');
    boton.addEventListener('click', () => {
      expandido = !expandido;
      actualizarListado();
      grilla.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  boton.textContent = estado ? 'Ver menos' : 'Ver más';
}

// ==================== Mostrar la grilla de médicos ====================
function actualizarListado() {
  if (!grilla) return;

  const medicos = filtrar();
  if (medicos.length === 0) {
    grilla.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center mb-0">
          No encontramos profesionales con esos criterios.
        </div>
      </div>`;
    botonVerMas(false, false);
    return;
  }

  const visibles = expandido ? medicos : medicos.slice(0, LIMITE);
  grilla.innerHTML = visibles
    .map(medico => {
      const foto = medico.foto || 'img/doctor-placeholder.png';
      const nombre = medico.apellidoNombre || 'Profesional';
      const especialidad = medico.especialidad || '';
      const matricula = medico.matricula ? ` · ${medico.matricula}` : '';
      const bio = medico.bio
        ? `<p class="card-text small mb-3">${medico.bio}</p>`
        : '';
      const honorarios = Number(medico.honorarios || 0).toLocaleString('es-AR');
      const obras = Array.isArray(medico.obrasSociales)
        ? medico.obrasSociales
        : [];
      const etiquetasObras = obras
        .map(o => `<span class="badge bg-light text-dark border">${o}</span>`)
        .join(' ');

      return `
        <div class="col-12 col-sm-6 col-md-4">
          <article class="card h-100 shadow-sm">
            <img class="card-img-top" src="${foto}" alt="${nombre}"
                onerror="this.onerror=null;this.src='img/doctor-placeholder.png'">
            <div class="card-body">
              <h3 class="h6 card-title mb-1">${nombre}</h3>
              <p class="text-body-secondary mb-2">${especialidad}${matricula}</p>
              ${bio}
              ${etiquetasObras
          ? `<div class="d-flex flex-wrap gap-1">${etiquetasObras}</div>`
          : ''
        }
            </div>
            <div class="card-footer bg-white">
              <strong>$ ${honorarios}</strong>
            </div>
          </article>
        </div>`;
    })
    .join('');

  botonVerMas(medicos.length > LIMITE, expandido);
}

// ==================== Cargar especialidades en el select ====================
function cargarEspecialidades() {
  if (!filtroEspecialidad) return;
  filtroEspecialidad.innerHTML =
    '<option value="">Todas las especialidades</option>';
  ESPECIALIDADES_SEED.forEach(e => {
    const opcion = document.createElement('option');
    opcion.value = e;
    opcion.textContent = e;
    filtroEspecialidad.appendChild(opcion);
  });
}

// ==================== Inicialización ====================
document.addEventListener('DOMContentLoaded', () => {
  inicializar();
  cargarEspecialidades();
  expandido = false;
  actualizarListado();
  buscador?.addEventListener('input', () => {
    expandido = false;
    actualizarListado();
  });
  filtroEspecialidad?.addEventListener('change', () => {
    expandido = false;
    actualizarListado();
  });
});