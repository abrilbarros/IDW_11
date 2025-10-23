import { MEDICOS_SEED } from "./data-medicos.js";

const usuario = JSON.parse(sessionStorage.getItem("usuarioLogueado"));

//Solo si el usuario es Administrador ingresa
if (!usuario || usuario.tipoUsuario !== "Administrador") {
  window.location.href = "index.html"
};

const STORAGE_KEY = "medicos";

// Inicializa LocalStorage si está vacío
(function inicializarLocalStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        console.log("Inicializando LocalStorage con datos de ejemplo...");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MEDICOS_SEED));
    }
})();

// ==================== PERSISTENCIA ====================

function obtenerMedicos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function guardarMedicosEnStorage(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// ==================== CRUD ====================

function guardarMedico() {
    const id = medicoIdInput.value;
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const matricula = matriculaInput.value.trim();
    const especialidad = especialidadInput.value.trim();
    const obraSocial = obraSocialInput.value;
    const valorConsulta = parseInt(valorConsultaInput.value, 10);
    const descripcion = descripcionInput.value.trim();

    if (!matricula || !nombre || !apellido || !especialidad) {
        alert("Por favor, completá todos los campos obligatorios.");
        return;
    }


if (isNaN(valorConsulta) || valorConsulta <= 0) {
    alert("El valor de los honorarios debe ser un número entero mayor que 0");
    return;
}

    let medicos = obtenerMedicos();

    const medicoData = {
        apellidoNombre: `${nombre} ${apellido}`,
        matricula,
        especialidad,
        email: "",
        telefono: "",
        honorarios: valorConsulta,
        obrasSociales: obraSocial.split(',').map(os => os.trim()),
        bio: descripcion
    };

    if (id) {
        // Editar médico existente
        const medicoIndex = medicos.findIndex(med => med.id == id);
        if (medicoIndex !== -1) {
            medicoData.foto = medicos[medicoIndex].foto || 'img/doctor-placeholder.jpg';
            medicos[medicoIndex] = { ...medicos[medicoIndex], ...medicoData };
            alert("Médico modificado con éxito");
        }
    } else {
        // Agregar nuevo médico
        // Filtrar IDs válidos para evitar NaN
        const idsExistentes = medicos
            .map(m => m.id)
            .filter(n => typeof n === "number" && !isNaN(n));

        const nuevoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;
        medicoData.id = nuevoId;
        medicoData.foto = 'img/doctor-placeholder.jpg';
        medicos.push(medicoData);
        alert("Médico agregado con éxito");
    }

    guardarMedicosEnStorage(medicos);
    cargarMedicos();
    limpiarFormulario();
}

function eliminarMedico(id) {
    const medicos = obtenerMedicos();
    const medico = medicos.find((m) => m.id === id);
    if (!medico) return;

    if (confirm(`¿Eliminar al Dr./Dra. ${medico.apellidoNombre}?`)) {
        const actualizados = medicos.filter((m) => m.id !== id);
        guardarMedicosEnStorage(actualizados);
        cargarMedicos();
        alert("Médico eliminado.");
    }
}

function editarMedico(id) {
    const medico = obtenerMedicos().find((m) => m.id === id);
    if (!medico) return;

    const partes = medico.apellidoNombre.split(" ");
    apellidoInput.value = partes.pop();
    nombreInput.value = partes.join(" ");
    matriculaInput.value = medico.matricula;
    especialidadInput.value = medico.especialidad;
    obraSocialInput.value = medico.obrasSociales?.join(", ") || "";
    valorConsultaInput.value = medico.honorarios;
    descripcionInput.value = medico.bio;
    medicoIdInput.value = medico.id;

    tituloFormulario.textContent = "Editar Médico";
    btnGuardarMedico.textContent = "Actualizar Médico";
    btnCancelarEdicion.style.display = "inline-block";
}

function limpiarFormulario() {
    formMedico.reset();
    medicoIdInput.value = "";
    tituloFormulario.textContent = "Agregar Nuevo Médico";
    btnGuardarMedico.textContent = "Guardar Médico";
    btnCancelarEdicion.style.display = "none";
}

function cargarMedicos() {
    const tbody = document.getElementById("tablaMedicos");
    const medicos = obtenerMedicos();

    tbody.innerHTML = medicos.length
        ? medicos
            .map(
                (m) => `
      <tr>
        <td><img src="${m.foto}" alt="${m.apellidoNombre}" class="rounded" style="width:50px;height:50px;object-fit:cover;"></td>
        <td>${m.id}</td>
        <td>${m.apellidoNombre}</td>
        <td>${m.matricula}</td>
        <td>${m.especialidad}</td>
        <td>${m.obrasSociales?.join(", ") || "N/A"}</td>
        <td>$${m.honorarios.toLocaleString("es-AR")}</td>
        <td class="text-end">
          <button class="btn btn-warning btn-sm me-1" onclick="editarMedico(${m.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${m.id})"><i class="bi bi-trash"></i></button>
        </td>
      </tr>`
            )
            .join("")
        : `<tr><td colspan="8" class="text-center">No hay médicos registrados.</td></tr>`;
}

// ==================== INICIALIZACIÓN ====================

let formMedico, medicoIdInput, matriculaInput, nombreInput, apellidoInput;
let especialidadInput, obraSocialInput, valorConsultaInput, descripcionInput;
let btnGuardarMedico, btnCancelarEdicion, tituloFormulario;

document.addEventListener("DOMContentLoaded", () => {
    formMedico = document.getElementById("formMedico");
    medicoIdInput = document.getElementById("medicoId");
    matriculaInput = document.getElementById("matricula");
    nombreInput = document.getElementById("nombre");
    apellidoInput = document.getElementById("apellido");
    especialidadInput = document.getElementById("especialidad");
    obraSocialInput = document.getElementById("obraSocial");
    valorConsultaInput = document.getElementById("valorConsulta");
    descripcionInput = document.getElementById("descripcion");
    btnGuardarMedico = document.getElementById("btnGuardarMedico");
    btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
    tituloFormulario = document.getElementById("tituloFormulario");

    formMedico.addEventListener("submit", (e) => {
        e.preventDefault();
        guardarMedico();
    });

    btnCancelarEdicion.addEventListener("click", limpiarFormulario);

    cargarMedicos();
});

window.eliminarMedico = eliminarMedico;
window.editarMedico = editarMedico;
