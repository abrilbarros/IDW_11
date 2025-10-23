const btnInicio = document.getElementById("btnInicio");
const btnCerrar = document.getElementById("btnCierre");
const btnInicioMob = document.getElementById("btnInicioMob")
const btnCerrarMob = document.getElementById("btnCierreMob")

// Verifica si hay usuario logueado
const usuario = JSON.parse(sessionStorage.getItem("usuarioLogueado"));

if (usuario) {
  // Oculta "Iniciar sesión" y muestra "Cerrar sesión" si esta logueado
  btnInicio.classList.add("d-none");
  btnCerrar.classList.remove("d-none");
  btnInicioMob.classList.add("d-none");
  btnCerrarMob.classList.remove("d-none");
}
else {
  // Si no hay usuario logueado, mostrar "Iniciar sesión"
  btnInicio.classList.remove("d-none");
  btnCerrar.classList.add("d-none");
  btnInicioMob.classList.remove("d-none");
  btnCerrarMob.classList.add("d-none");
}

function cerrarSesion() {
  sessionStorage.removeItem("usuarioLogueado");
  window.location.href = "index.html";
}

btnCerrar.addEventListener("click", cerrarSesion);
btnCerrarMob.addEventListener("click", cerrarSesion);

//Solo muestra la pagina "Administrador" en navbar si esta logueado un administrador
const btnAdmin = document.getElementById("adminMed")
const btnAdminMob = document.getElementById("adminMedMob")

if (usuario && usuario.tipoUsuario === "Administrador") {
  btnAdmin.classList.remove("d-none")
  btnAdminMob.classList.remove("d-none")
}