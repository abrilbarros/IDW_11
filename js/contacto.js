const formContacto = document.getElementById('contactoForm');
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const inputAsunto = document.getElementById('asunto');
const inputMensaje = document.getElementById('mensaje')

function contacto(event){
    event.preventDefault();
    
    let nombre = inputNombre.value.trim();
    let correo = inputCorreo.value.trim();
    let asunto = inputAsunto.value.trim();
    let mensaje = inputMensaje.value.trim();

    if (!nombre || !correo || !asunto || !mensaje){
        alert ('Por Favor completá los campos vacios');
        return;
    }

    const nuevaConsulta = {
        nombre: nombre,
        correo: correo,
        asunto: asunto,
        mensaje: mensaje,
        fecha: new Date().toISOString()
    };

    try {
        const consultasGuardadas = localStorage.getItem('consultas');
        let consultas = consultasGuardadas ? JSON.parse(consultasGuardadas) : [];
        consultas.push(nuevaConsulta);
        localStorage.setItem('consultas', JSON.stringify(consultas));

        alert('Consulta enviada con exito');
        formContacto.reset();
    }
    catch (error) {
        console.error('Error al guardar en localStorage:', error);
        alert('Hubo un error al intentar enviar su consulta.');
    }
};

formContacto.addEventListener('submit', contacto);