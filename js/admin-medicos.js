
// ==================== IMPORTS Y CONFIGURACIÓN ====================

import { restringir } from "./herramientas.js";
restringir();

import { ESPECIALIDADES_SEED, OBRAS_SOCIALES_SEED } from "./seed.js";


// ==================== FUNCIONES AUXILIARES DE STORAGE ====================

function leerDesdeStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch {
        return [];
    }
}

function guardarEnStorage(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos || []));
}


// ==================== INICIALIZACIÓN DE DATOS ====================

let medicos = leerDesdeStorage("medicos");

function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("Error al leer la imagen");
        reader.readAsDataURL(file);
    });
}

// ==================== FUNCIONES CRUD ====================

async function guardarMedico() {
    const id = medicoIdInput.value;
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const matricula = matriculaInput.value.trim();
    const especialidad = especialidadInput.value.trim();
    const obraSocial = Array.from(document.querySelectorAll("#obraSocialContainer .badge.bg-success")).map(badge => badge.dataset.obraSocial);
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


    const medicoData = {
        apellidoNombre: `${nombre} ${apellido}`,
        matricula,
        especialidad,
        email: "",
        telefono: "",
        honorarios: valorConsulta,
        obrasSociales: obraSocial,
        bio: descripcion
    };

    if (fotoMedicoInput.files && fotoMedicoInput.files[0]) {
        try {
            medicoData.foto = await convertirImagenABase64(fotoMedicoInput.files[0]);
        } catch (error) {
            alert("Error al procesar la imagen");
            return;
        }
    }

    if (id) {
        editarMedicoExistente(parseInt(id), medicoData);
    } else {
        agregarMedico(medicoData);
    }
}

function agregarMedico(medicoData) {

    const idsExistentes = medicos.map(m => m.id).filter(n => typeof n === "number" && !isNaN(n));

    const nuevoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;
    medicoData.id = nuevoId;

    if (!medicoData.foto) {
        medicoData.foto = 'img/doctor-placeholder.jpg';
    }

    medicos.push(medicoData);
    guardarEnStorage("medicos", medicos);
    cargarMedicos();
    limpiarFormulario();
    alert("Médico agregado con éxito");
}


function editarMedicoExistente(id, medicoData) {
    const medicoIndex = medicos.findIndex(med => med.id == id);

    if (medicoIndex === -1) return;

    if (!medicoData.foto) {
        medicoData.foto = medicos[medicoIndex].foto || 'img/doctor-placeholder.jpg';
    }

    medicos[medicoIndex] = { ...medicos[medicoIndex], ...medicoData };

    guardarEnStorage("medicos", medicos);
    cargarMedicos();
    limpiarFormulario();
    alert("Médico modificado con éxito");
}


function eliminarMedico(id) {
    const medico = medicos.find((m) => m.id === id);
    if (!medico) return;

    if (confirm(`¿Eliminar al Dr./Dra. ${medico.apellidoNombre}?`)) {
        medicos = medicos.filter((m) => m.id !== id);
        guardarEnStorage("medicos", medicos);         
        cargarMedicos();
        alert("Médico eliminado");
    }
}

function editarMedico(id) {
    const medico = medicos.find((m) => m.id === id);
    if (!medico) return;

    const partes = medico.apellidoNombre.split(" ");
    apellidoInput.value = partes.pop();
    nombreInput.value = partes.join(" ");
    matriculaInput.value = medico.matricula;
    especialidadInput.value = medico.especialidad;

document.querySelectorAll("#obraSocialContainer .badge").forEach(badge => {
    const nombreOS = badge.dataset.obraSocial;
    
    if (medico.obrasSociales?.includes(nombreOS)) {
        badge.classList.remove("bg-secondary");
        badge.classList.add("bg-success");
    } 

    else {
        badge.classList.remove("bg-success");
        badge.classList.add("bg-secondary");
    }
});

    valorConsultaInput.value = medico.honorarios;
    descripcionInput.value = medico.bio;
    medicoIdInput.value = medico.id;

    tituloFormulario.textContent = "Editar Médico";
    btnGuardarMedico.textContent = "Actualizar Médico";
    btnCancelarEdicion.style.display = "inline-block";

    window.scrollTo({ top: 0, behavior: "smooth" });

}

function limpiarFormulario() {
    formMedico.reset();
    medicoIdInput.value = "";
    fotoMedicoInput.value = "";
    tituloFormulario.textContent = "Agregar Nuevo Médico";
    btnGuardarMedico.textContent = "Guardar Médico";
    btnCancelarEdicion.style.display = "none";

    document.querySelectorAll("#obraSocialContainer .badge").forEach(badge => {
        badge.classList.remove("bg-success");
        badge.classList.add("bg-secondary");
    });
}

function cargarMedicos() {
    const tbody = document.querySelector("#tablaMedicos tbody");

    tbody.innerHTML = medicos.length > 0 ? medicos.map((m) => `
    <tr>
        <td><img src="${m.foto}" alt="${m.apellidoNombre}" class="rounded" style="width:50px;height:50px;object-fit:cover;"></td>
        <td>${m.id}</td>
        <td>${m.apellidoNombre}</td>
        <td>${m.matricula}</td>
        <td>${m.especialidad}</td>
        <td>${m.obrasSociales?.join(", ") || "N/A"}</td>
        <td>$${m.honorarios.toLocaleString("es-AR")}</td>
        <td class="text-end">
            <button class="btn btn-warning btn-sm me-1" onclick="editarMedico(${m.id})" title="Editar"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-danger btn-sm me-1" onclick="eliminarMedico(${m.id})" title="Eliminar"><i class="bi bi-trash"></i></button>
        </td>
    </tr>`
            )
            .join("")
        : `<tr><td colspan="8" class="text-center">No hay médicos registrados.</td></tr>`;
}

// ==================== VARIABLES GLOBALES ====================

let formMedico, medicoIdInput, matriculaInput, nombreInput, apellidoInput;
let especialidadInput, obraSocialInput, valorConsultaInput, descripcionInput;
let btnGuardarMedico, btnCancelarEdicion, tituloFormulario;
let fotoMedicoInput;

// ==================== DATOS DE ESPECIALIDADES ====================

const especialidadesDelStorage = leerDesdeStorage("especialidades");

const especialidadesDisponibles = especialidadesDelStorage.length > 0 ? especialidadesDelStorage : ESPECIALIDADES_SEED

// ==================== DATOS DE OBRAS SOCIALES ====================

const obrasSocialesDelStorage = leerDesdeStorage("obrasSociales");

const obrasSocialesDisponibles = obrasSocialesDelStorage.length > 0
    ? obrasSocialesDelStorage
    : OBRAS_SOCIALES_SEED;

// ==================== INICIALIZACIÓN DEL DOM ====================

document.addEventListener("DOMContentLoaded", () => {
    formMedico = document.getElementById("formMedico");
    medicoIdInput = document.getElementById("medicoId");
    matriculaInput = document.getElementById("matricula");
    fotoMedicoInput = document.getElementById("fotoMedico");
    nombreInput = document.getElementById("nombre");
    apellidoInput = document.getElementById("apellido");
    especialidadInput = document.getElementById("especialidad");
    obraSocialInput = document.getElementById("obraSocial");
    valorConsultaInput = document.getElementById("valorConsulta");
    descripcionInput = document.getElementById("descripcion");
    btnGuardarMedico = document.getElementById("btnGuardarMedico");
    btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
    tituloFormulario = document.getElementById("tituloFormulario");


    especialidadesDisponibles.forEach(esp => {
        const option = document.createElement("option");
        option.value = esp.nombre;
        option.textContent = esp.nombre;
        especialidadInput.appendChild(option);
    })


    const obraSocialContainer = document.getElementById("obraSocialContainer");

    obrasSocialesDisponibles.forEach(os => {

    const badge = document.createElement("span");
    
    badge.classList.add("badge", "bg-secondary", "cursor-pointer", "user-select-none");
    
    badge.textContent = os.nombre;

    badge.dataset.obraSocial = os.nombre;
    
    badge.style.cursor = "pointer";
    badge.style.transition = "all 0.3s ease";
    badge.style.fontSize = "1rem";
    badge.style.fontWeight = "500";

    badge.addEventListener("click", () => {

        badge.style.transform = "scale(0.95)";
    setTimeout(() => {
        badge.style.transform = "scale(1)";
    }, 100);

        if (badge.classList.contains("bg-success")) {
            badge.classList.remove("bg-success");
            badge.classList.add("bg-secondary");
        } 
        
        else {
            badge.classList.remove("bg-secondary");
            badge.classList.add("bg-success");
        }
    });
    
    obraSocialContainer.appendChild(badge);
});


    formMedico.addEventListener("submit", (e) => {
        e.preventDefault();
        guardarMedico();
    });

    btnCancelarEdicion.addEventListener("click", limpiarFormulario);

    cargarMedicos();
});

// ==================== FUNCIONES GLOBALES PARA BOTONES ====================

window.eliminarMedico = eliminarMedico;
window.editarMedico = editarMedico;
