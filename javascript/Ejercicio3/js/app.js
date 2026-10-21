const contenedor = document.getElementById("productos");

const buscador = document.getElementById("buscador");

const btnBuscar = document.getElementById("btnBuscar");

const btnMostrarTodos =
    document.getElementById("btnMostrarTodos");

const feedback =
    document.getElementById("feedback");

const formularioModificar =
    document.getElementById("formularioModificar");

const nombreModificar =
    document.getElementById("nombreModificar");

const precioModificar =
    document.getElementById("precioModificar");

const btnGuardar =
    document.getElementById("btnGuardar");

const btnCancelar =
    document.getElementById("btnCancelar");


// Array donde guardaremos los productos
let productos = [];


// Producto que actualmente estamos modificando
let productoSeleccionado = null;



// ==========================================
// CARGAR PRODUCTOS DESDE PHP
// ==========================================

fetch("api/productos.php")

    .then(function(respuesta) {

        return respuesta.json();

    })

    .then(function(datos) {

        productos = datos;

        mostrarProductos(productos);

    });



// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos(lista) {

    contenedor.innerHTML = "";


    if (lista.length === 0) {

        contenedor.innerHTML =
            "<p>No se encontraron productos.</p>";

        return;
    }


    lista.forEach(function(producto) {

        contenedor.innerHTML += `

            <article class="producto">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    Precio: $${producto.precio}
                </p>

                <button
                    onclick="abrirModificar(${producto.id})"
                >
                    Modificar
                </button>

            </article>

        `;

    });

}



// ==========================================
// BUSCAR
// ==========================================

btnBuscar.addEventListener("click", function() {

    const texto =
        buscador.value.toLowerCase();


    const resultados =
        productos.filter(function(producto) {

            return producto.nombre
                .toLowerCase()
                .includes(texto);

        });


    mostrarProductos(resultados);

});



// ==========================================
// MOSTRAR TODOS
// ==========================================

btnMostrarTodos.addEventListener(
    "click",
    function() {

        buscador.value = "";

        mostrarProductos(productos);

        mostrarFeedback(
            "Mostrando todos los productos."
        );

    }
);



// ==========================================
// ABRIR FORMULARIO DE MODIFICACIÓN
// ==========================================

function abrirModificar(id) {

    productoSeleccionado =
        productos.find(function(producto) {

            return producto.id === id;

        });


    if (productoSeleccionado === undefined) {

        mostrarFeedback(
            "No se encontró el producto."
        );

        return;
    }


    nombreModificar.value =
        productoSeleccionado.nombre;

    precioModificar.value =
        productoSeleccionado.precio;


    formularioModificar.classList.remove("oculto");


    mostrarFeedback(
        "Modificando: " +
        productoSeleccionado.nombre
    );

}



// ==========================================
// GUARDAR CAMBIOS
// ==========================================

btnGuardar.addEventListener(
    "click",
    function() {

        if (productoSeleccionado === null) {

            mostrarFeedback(
                "No hay ningún producto seleccionado."
            );

            return;
        }


        const nuevoNombre =
            nombreModificar.value.trim();

        const nuevoPrecio =
            Number(precioModificar.value);


        if (
            nuevoNombre === "" ||
            nuevoPrecio <= 0
        ) {

            mostrarFeedback(
                "Complete correctamente los datos."
            );

            return;
        }


        productoSeleccionado.nombre =
            nuevoNombre;

        productoSeleccionado.precio =
            nuevoPrecio;


        formularioModificar.classList.add(
            "oculto"
        );


        mostrarProductos(productos);


        mostrarFeedback(
            "✓ Producto modificado correctamente."
        );


        productoSeleccionado = null;

    }
);



// ==========================================
// CANCELAR MODIFICACIÓN
// ==========================================

btnCancelar.addEventListener(
    "click",
    function() {

        formularioModificar.classList.add(
            "oculto"
        );

        productoSeleccionado = null;

        mostrarFeedback(
            "Modificación cancelada."
        );

    }
);



// ==========================================
// MOSTRAR FEEDBACK
// ==========================================

function mostrarFeedback(mensaje) {

    feedback.textContent = mensaje;

}

