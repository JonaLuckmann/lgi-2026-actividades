const tabla = document.getElementById("tablaEstudiantes");
const buscador = document.getElementById("buscador");
const formulario = document.getElementById("formularioEstudiante");
const mensaje = document.getElementById("mensaje");
const modalEdicion = document.getElementById("modalEdicion");
const formularioEdicion = document.getElementById("formularioEdicion");
const mensajeEdicion = document.getElementById("mensajeEdicion");
let solicitudListado = 0;
let estudianteEditando = null;
let temporizadorBusqueda;
let estudiantesPorId = new Map();

function crearFila(estudiante) {
  const promedio =
    estudiante.notas.reduce(function (suma, nota) {
      return suma + Number(nota);
    }, 0) / estudiante.notas.length;
  const fila = document.createElement("tr");
  const nombre = document.createElement("td");
  const promedioCelda = document.createElement("td");
  const estado = document.createElement("td");
  const acciones = document.createElement("td");
  const botonEditar = document.createElement("button");
  const botonEliminar = document.createElement("button");

  fila.dataset.id = estudiante.id;
  nombre.textContent = estudiante.nombre;
  promedioCelda.textContent = promedio.toFixed(2);
  estado.textContent = promedio >= 6 ? "Aprobado" : "Desaprobado";
  botonEditar.type = "button";
  botonEditar.dataset.accion = "editar";
  botonEditar.textContent = "Editar";
  botonEliminar.type = "button";
  botonEliminar.dataset.accion = "eliminar";
  botonEliminar.className = "boton-secundario";
  botonEliminar.textContent = "Eliminar";
  acciones.className = "acciones-fila";
  acciones.append(botonEditar, botonEliminar);
  fila.append(nombre, promedioCelda, estado, acciones);
  return fila;
}

function mostrarEstadoVacio() {
  const fila = document.createElement("tr");
  const celda = document.createElement("td");
  celda.colSpan = 4;
  celda.textContent = "No se encontraron estudiantes.";
  fila.append(celda);
  tabla.replaceChildren(fila);
}

function mostrarEstudiantes(estudiantes) {
  estudiantesPorId = new Map(
    estudiantes.map(function (estudiante) {
      return [String(estudiante.id), estudiante];
    }),
  );
  tabla.replaceChildren();
  estudiantes.forEach(function (estudiante) {
    tabla.append(crearFila(estudiante));
  });

  if (estudiantes.length === 0) {
    mostrarEstadoVacio();
  }
}

function coincideBusqueda(estudiante) {
  return estudiante.nombre
    .toLocaleLowerCase()
    .includes(buscador.value.trim().toLocaleLowerCase());
}

function leerFormulario(formularioActual) {
  return {
    nombre: formularioActual.elements.nombre.value.trim(),
    notas: Array.from(
      formularioActual.querySelectorAll('[name="notas[]"]'),
      function (input) {
        return Number(input.value);
      },
    ),
  };
}

async function leerRespuesta(respuesta) {
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "La operación no se pudo completar.");
  }
  return datos;
}

async function cargarEstudiantes(termino = "") {
  const solicitudActual = ++solicitudListado;
  mensaje.textContent = "Cargando estudiantes...";

  try {
    const respuesta = await fetch(
      "api/estudiantes.php?q=" + encodeURIComponent(termino),
    );
    const estudiantes = await leerRespuesta(respuesta);
    if (solicitudActual === solicitudListado) {
      mostrarEstudiantes(estudiantes);
      mensaje.textContent = "";
    }
  } catch (error) {
    if (solicitudActual === solicitudListado) {
      mensaje.textContent = error.message;
    }
  }
}

buscador.addEventListener("input", function () {
  clearTimeout(temporizadorBusqueda);
  temporizadorBusqueda = setTimeout(function () {
    cargarEstudiantes(buscador.value.trim());
  }, 250);
});

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  mensaje.textContent = "Guardando estudiante...";

  try {
    const respuesta = await fetch("api/estudiantes.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leerFormulario(formulario)),
    });
    const estudiante = await leerRespuesta(respuesta);

    formulario.reset();
    estudiantesPorId.set(String(estudiante.id), estudiante);
    if (coincideBusqueda(estudiante)) {
      const vacio = tabla.querySelector("td[colspan]");
      if (vacio) {
        tabla.replaceChildren();
      }
      tabla.append(crearFila(estudiante));
    }
    mensaje.textContent = "Estudiante agregado correctamente.";
  } catch (error) {
    mensaje.textContent = error.message;
  }
});

tabla.addEventListener("click", async function (evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) {
    return;
  }

  const fila = boton.closest("tr");
  const id = fila.dataset.id;

  if (boton.dataset.accion === "editar") {
    try {
      estudianteEditando = estudiantesPorId.get(id);
      if (!estudianteEditando) {
        throw new Error("No se encontró el estudiante.");
      }

      formularioEdicion.elements.nombre.value = estudianteEditando.nombre;
      formularioEdicion
        .querySelectorAll('[name="notas[]"]')
        .forEach(function (input, indice) {
          input.value = estudianteEditando.notas[indice];
        });
      mensajeEdicion.textContent = "";
      modalEdicion.showModal();
    } catch (error) {
      mensaje.textContent = error.message;
    }
    return;
  }

  boton.disabled = true;
  mensaje.textContent = "Eliminando estudiante...";
  try {
    const respuesta = await fetch(
      "api/estudiantes.php?id=" + encodeURIComponent(id),
      {
        method: "DELETE",
      },
    );
    await leerRespuesta(respuesta);
    fila.remove();
    estudiantesPorId.delete(id);
    if (!tabla.querySelector("tr[data-id]")) {
      mostrarEstadoVacio();
    }
    mensaje.textContent = "Estudiante eliminado correctamente.";
  } catch (error) {
    boton.disabled = false;
    mensaje.textContent = error.message;
  }
});

formularioEdicion.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  mensajeEdicion.textContent = "Guardando cambios...";

  try {
    const respuesta = await fetch(
      "api/estudiantes.php?id=" + encodeURIComponent(estudianteEditando.id),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leerFormulario(formularioEdicion)),
      },
    );
    const estudianteActualizado = await leerRespuesta(respuesta);
    estudiantesPorId.set(
      String(estudianteActualizado.id),
      estudianteActualizado,
    );
    const fila = tabla.querySelector(
      'tr[data-id="' + estudianteActualizado.id + '"]',
    );

    if (fila) {
      if (coincideBusqueda(estudianteActualizado)) {
        fila.replaceWith(crearFila(estudianteActualizado));
      } else {
        fila.remove();
        if (!tabla.querySelector("tr[data-id]")) {
          mostrarEstadoVacio();
        }
      }
    }

    modalEdicion.close();
    mensaje.textContent = "Estudiante actualizado correctamente.";
  } catch (error) {
    mensajeEdicion.textContent = error.message;
  }
});

document
  .getElementById("cancelarEdicion")
  .addEventListener("click", function () {
    modalEdicion.close();
  });

cargarEstudiantes();
