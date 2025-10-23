import { usuarios } from "./data-login.js"

//funcion para inicializar el local storage si esta vacio
function inicializarLocalStorage() {
    if (!localStorage.getItem("usuarios")) {
        localStorage.setItem("usuarios", JSON.stringify(usuarios))
    }
}

//inicializa localStorage
inicializarLocalStorage();

//trae los usuarios guardados
const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios"));

//captura el formulario
const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit",function(event) {
    event.preventDefault();

    const tipo = document.getElementById("tipoUsuario").value;
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();

    const usuarioValido = usuariosGuardados.find(u =>
        u.tipoUsuario.toLowerCase() === tipo.toLowerCase() &&
        u.email === email &&
        u.password === pass
    );

    if (usuarioValido) {
        if (usuarioValido.tipoUsuario === "Administrador") {
            window.location.href = "admin-medicos.html"
        }
        else if (usuarioValido.tipoUsuario === "Cliente") {
            window.location.href = "contacto.html"
        }

        sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValido));
    }
    else {
        alert("Usuario o contraseña incorrectos");
    }
});