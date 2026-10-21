const formulario = document.getElementById("formularioAlumno");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const alumno = {
        nombre: document.getElementById("nombre").value,
        edad: document.getElementById("edad").value,
        carrera: document.getElementById("carrera").value
    };

    fetch("api/procesar.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(alumno)
    })
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {

        resultado.innerHTML = `
            <h2>${datos.mensaje}</h2>
            <p>Nombre: ${datos.alumno.nombre}</p>
            <p>Edad: ${datos.alumno.edad}</p>
            <p>Carrera: ${datos.alumno.carrera}</p>
        `;
    });
});

