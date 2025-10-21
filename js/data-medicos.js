// data-medicos.js
export const ESPECIALIDADES_SEED = [
    "Clínica Médica",
    "Pediatría",
    "Cirugía General",
    "Dermatología",
    "Traumatología",
    "Ginecología y Obstetricia",
    "Neurología",
];

export const OBRAS_SOCIALES_SEED = [
    "OSDE",
    "Swiss Medical",
    "Galeno",
    "Medifé",
    "OMINT",
    "PAMI",
];

export const MEDICOS_SEED = [
    {
        id: 1,
        apellidoNombre: "Dra. Valentina Ríos Fernández",
        matricula: "MN-21543",
        especialidad: "Clínica Médica",
        email: "valentina.rios@vita.com",
        telefono: "+54 11 5252-1101",
        honorarios: 28000,
        obrasSociales: ["OSDE", "PAMI", "Medifé"],
        bio: "Clínica médica con enfoque en prevención y control de enfermedades crónicas. Atención integral del adulto.",
        foto: "img/valentinariosfernandez.png"
    },
    {
        id: 2,
        apellidoNombre: "Dr. Mateo López Fernández",
        matricula: "MP-90432",
        especialidad: "Pediatría",
        email: "mateo.lopez@vita.com",
        telefono: "+54 11 5252-1102",
        honorarios: 30000,
        obrasSociales: ["Swiss Medical", "OSDE", "Galeno"],
        bio: "Pediatra con foco en control del niño sano, vacunación y seguimiento del desarrollo.",
        foto: "img/mateolopezfernandez.png"
    },
    {
        id: 3,
        apellidoNombre: "Dra. Camila Duarte Herrera",
        matricula: "MN-34781",
        especialidad: "Cirugía General",
        email: "camila.duarte@vita.com",
        telefono: "+54 11 5252-1103",
        honorarios: 38000,
        obrasSociales: ["OMINT", "OSDE", "Swiss Medical"],
        bio: "Cirugía general y laparoscópica. Manejo pre y postoperatorio orientado a la recuperación rápida.",
        foto: "img/camiladuarteherrera.png"
    },
    {
        id: 4,
        apellidoNombre: "Dra. María José Barrera",
        matricula: "MP-77210",
        especialidad: "Pediatría",
        email: "mariajose.barrera@vita.com",
        telefono: "+54 11 5252-1104",
        honorarios: 29500,
        obrasSociales: ["PAMI", "Medifé", "Galeno"],
        bio: "Pediatría ambulatoria. Alimentación saludable, crecimiento y educación para la salud en la familia.",
        foto: "img/mariajosebarrera.png"
    },
];
