// Confirmación para acciones destructivas, como borrar una planilla.
document.querySelectorAll("button[data-confirm]").forEach((boton) => {
  boton.addEventListener("click", (evento) => {
    if (!window.confirm(boton.dataset.confirm)) {
      evento.preventDefault();
      evento.stopPropagation();
    }
  });
});

document.querySelectorAll("form[data-confirm]").forEach((formulario) => {
  formulario.addEventListener("submit", (evento) => {
    if (!window.confirm(formulario.dataset.confirm)) {
      evento.preventDefault();
    }
  });
});

// Señalar visualmente las filas que tienen cambios sin guardar.
document.querySelectorAll(".grade-input").forEach((campo) => {
  campo.addEventListener("input", () => {
    campo.closest("tr")?.classList.add("has-changes");
  });
});

// Enviar las notas como JSON a la API sin recargar la página.
document.querySelectorAll('form[data-api-form="notas"]').forEach((formulario) => {
  formulario.addEventListener("submit", async (evento) => {
    const boton = evento.submitter;

    // Solo interceptamos el botón Guardar. Borrar sigue usando su formulario PHP.
    if (!boton || boton.value !== "actualizar") {
      return;
    }

    evento.preventDefault();

    if (!formulario.reportValidity()) {
      return;
    }

    const feedback = document.getElementById("api-feedback");
    const fila = document.querySelector(
      `[data-materia-row="${formulario.elements.materia_id.value}"]`
    );
    const datos = Object.fromEntries(new FormData(formulario).entries());
    datos.accion = "actualizar";

    boton.disabled = true;
    boton.textContent = "Guardando…";
    if (feedback) {
      feedback.textContent = "Enviando notas al servidor…";
      feedback.classList.remove("notice-error");
      feedback.style.display = "block";
    }

    try {
      const respuesta = await fetch("api/guardar_matriz.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok || !resultado.ok) {
        throw new Error(resultado.mensaje || "No se pudieron guardar las notas.");
      }

      if (fila) {
        fila.classList.remove("has-changes");
        const celdaPromedio = fila.querySelector(".nota-regular");
        if (celdaPromedio) {
          celdaPromedio.textContent = resultado.nota_regular ?? "-";
        }
      }

      if (feedback) {
        feedback.textContent = "✓ " + resultado.mensaje;
        feedback.classList.remove("notice-error");
        feedback.style.display = "block";
      }
    } catch (error) {
      if (feedback) {
        feedback.textContent = "Error: " + error.message;
        feedback.classList.add("notice-error");
        feedback.style.display = "block";
      }
    } finally {
      boton.disabled = false;
      boton.textContent = "Guardar";
    }
  });
});
