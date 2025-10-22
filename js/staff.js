import { MEDICOS_SEED, ESPECIALIDADES_SEED } from './data-medicos.js';

const STORAGE_KEY = 'medicos';
const MAX_VISIBLE = 3;
let expanded = false; // estado "ver más / ver menos"

// ---------- Storage helpers (compat array / {data}) ----------
function readAll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.data)) return parsed.data;
    return [];
  } catch { return []; }
}
function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); // array plano
}
function ensureSeed() {
  if (!readAll().length) writeAll(MEDICOS_SEED);
}

// ---------- UI refs ----------
const grid = document.getElementById('staffGrid');
const inputQ = document.getElementById('q');
const selectEsp = document.getElementById('filtroEspecialidad');

// ---------- Render ----------
function getFiltered() {
  const q = (inputQ?.value || '').trim().toLowerCase();
  const esp = selectEsp?.value || '';

  return readAll().filter(m => {
    const matchQ = !q ||
      (m.apellidoNombre || '').toLowerCase().includes(q) ||
      (m.especialidad || '').toLowerCase().includes(q);
    const matchEsp = !esp || m.especialidad === esp;
    return matchQ && matchEsp;
  });
}

function render() {
  if (!grid) return;

  const medicos = getFiltered();

  if (!medicos.length) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center mb-0">
          No encontramos profesionales con esos criterios.
        </div>
      </div>`;
    setVerMasVisibility(false, false);
    return;
  }

  const listToShow = expanded ? medicos : medicos.slice(0, MAX_VISIBLE);

  grid.innerHTML = listToShow.map(m => {
    const foto = m.foto || 'img/doctor-placeholder.png';
    const nombre = m.apellidoNombre || 'Profesional';
    const especialidad = m.especialidad || '';
    const matricula = m.matricula || '';
    const bio = m.bio || '';
    const honorarios = Number(m.honorarios || 0).toLocaleString('es-AR');
    const badges = (m.obrasSociales || [])
      .map(o => `<span class="badge bg-light text-dark border">${o}</span>`)
      .join(' ');

    return `
        <div class="col-12 col-sm-6 col-md-4">
          <article class="card h-100 shadow-sm">
            <img class="card-img-top"
                src="${foto}"
                alt="${nombre}"
                onerror="this.onerror=null; this.src='img/doctor-placeholder.png';">
            <div class="card-body">
              <h3 class="h6 card-title mb-1">${nombre}</h3>
              <p class="text-body-secondary mb-2">${especialidad}${matricula ? ' · ' + matricula : ''}</p>
              ${bio ? `<p class="card-text small mb-3">${bio}</p>` : ''}
              ${badges ? `<div class="d-flex flex-wrap gap-1">${badges}</div>` : ''}
            </div>
            <div class="card-footer bg-white">
              <strong>$ ${honorarios}</strong>
            </div>
          </article>
        </div>
      `;
  }).join('');

  // Mostrar/ocultar y actualizar el botón
  setVerMasVisibility(medicos.length > MAX_VISIBLE, expanded);
}

// ---------- Botón "Ver más / Ver menos" ----------
function ensureVerMasElements() {
  let wrap = document.getElementById('staffVerMasWrap');
  if (!wrap) {
    grid.insertAdjacentHTML('afterend', `
      <div id="staffVerMasWrap" class="d-grid justify-content-center mt-3"></div>
    `);
    wrap = document.getElementById('staffVerMasWrap');
  }

  let btn = document.getElementById('btnVerMas');
  if (!btn) {
    wrap.innerHTML = `
      <button id="btnVerMas"
              class="btn btn-outline-primary border-2 rounded-pill fw-semibold px-4">
        Ver más
      </button>
    `;
    btn = document.getElementById('btnVerMas');

    btn.addEventListener('click', () => {
      expanded = !expanded;     // toggle
      render();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  return { wrap, btn: document.getElementById('btnVerMas') };
}

function setVerMasVisibility(show, isExpanded) {
  const { wrap, btn } = ensureVerMasElements();
  wrap.style.display = show ? '' : 'none';
  if (!show) return;

  // Texto según estado
  btn.textContent = isExpanded ? 'Ver menos' : 'Ver más';
}

// ---------- Filtros ----------
function poblarEspecialidades() {
  if (!selectEsp) return;
  selectEsp.innerHTML = '<option value="">Todas las especialidades</option>';
  ESPECIALIDADES_SEED.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e;
    opt.textContent = e;
    selectEsp.appendChild(opt);
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  ensureSeed();
  poblarEspecialidades();
  expanded = false;
  render();

  inputQ?.addEventListener('input', () => { expanded = false; render(); });
  selectEsp?.addEventListener('change', () => { expanded = false; render(); });
});