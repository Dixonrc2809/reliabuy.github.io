document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();  // Llamamos a la función para cargar el carrito cuando se cargue la página
});

// ----------------------------------------------------------------
// Función para actualizar el carrito en la página
// ----------------------------------------------------------------
function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedorCarrito = document.getElementById("carrito-contenido");
    const carritoVacio = document.getElementById("carrito-vacio");
    const subtotalElement = document.getElementById("subtotal");
    const btnFinalizarCompra = document.getElementById("btn-finalizar-compra");

    // Limpiar el contenido del carrito antes de agregar los nuevos productos
    contenedorCarrito.innerHTML = '';

    // Si el carrito está vacío
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
        carritoVacio.style.display = "block";
        subtotalElement.textContent = '₡0.00';  // Establecer subtotal a 0 cuando el carrito está vacío
        
        // Desactivar el botón de finalizar compra
        btnFinalizarCompra.setAttribute('tabindex', '-1');
        btnFinalizarCompra.setAttribute('aria-disabled', 'true');
        btnFinalizarCompra.style.pointerEvents = 'none';  // Desactivar clic
        btnFinalizarCompra.disabled = true;  // Deshabilitar el botón completamente

        // Asegurarnos de que el evento de clic no se dispare
        btnFinalizarCompra.removeEventListener('click', finalizarCompra); // Si el botón tenía un listener, lo eliminamos
    } else {
        carritoVacio.style.display = "none";
        // Mostrar productos del carrito
        carrito.forEach((producto, index) => {
            const itemCarrito = document.createElement("div");
            itemCarrito.classList.add("carrito-item");
            itemCarrito.innerHTML = `
                <div class="row">
                    <div class="col-3">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid" />
                    </div>
                    <div class="col-6">
                        <p>${producto.nombre}</p>
                        <p>₡${producto.precio}</p>
                    </div>
                    <div class="col-3 d-flex align-items-center justify-content-between">
                        <select class="form-control" onchange="actualizarCantidad(${index}, this.value)">
                            <option value="1" ${producto.cantidad === 1 ? 'selected' : ''}>1</option>
                            <option value="2" ${producto.cantidad === 2 ? 'selected' : ''}>2</option>
                            <option value="3" ${producto.cantidad === 3 ? 'selected' : ''}>3</option>
                            <option value="4" ${producto.cantidad === 4 ? 'selected' : ''}>4</option>
                            <option value="5" ${producto.cantidad === 5 ? 'selected' : ''}>5</option>
                            <option value="6" ${producto.cantidad === 6 ? 'selected' : ''}>6</option>
                        </select>
                        <button class="btn btn-danger" onclick="eliminarProducto(${index})">Eliminar</button>
                    </div>
                </div>
            `;
            contenedorCarrito.appendChild(itemCarrito);
        });

        // Calcular el subtotal
        calcularSubtotal();

        // Habilitar el botón de finalizar compra si hay productos en el carrito
        btnFinalizarCompra.removeAttribute('tabindex');
        btnFinalizarCompra.removeAttribute('aria-disabled');
        btnFinalizarCompra.style.pointerEvents = 'auto';  // Habilitar clic
        btnFinalizarCompra.disabled = false;  // Activar el botón

        // Agregar el evento de clic solo si hay productos
        btnFinalizarCompra.addEventListener('click', finalizarCompra);
    }

    console.log("Carrito desde localStorage:", carrito);
}

// ----------------------------------------------------------------
// Función para agregar un producto al carrito
// ----------------------------------------------------------------
function agregarProductoAlCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        // Si el producto ya existe, aumentar la cantidad
        productoExistente.cantidad++;
    } else {
        // Si no existe, agregarlo con cantidad 1
        producto.cantidad = 1;
        carrito.push(producto);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar la vista del carrito y el subtotal sin recargar la página
    actualizarCarrito();
}

// ----------------------------------------------------------------
// Función para actualizar la cantidad del producto en el carrito
// ----------------------------------------------------------------
function actualizarCantidad(index, cantidad) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito[index].cantidad = parseInt(cantidad);  // Actualizar la cantidad como un número entero
    localStorage.setItem('carrito', JSON.stringify(carrito));
    calcularSubtotal();  // Volver a calcular el subtotal sin recargar la página
}

// ----------------------------------------------------------------
// Función para calcular el subtotal
// ----------------------------------------------------------------
function calcularSubtotal() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let subtotal = 0;

    carrito.forEach(producto => {
        // Asegurarse de que el precio esté en formato numérico
        const precio = parseFloat(producto.precio.replace(/,/g, '')); // Remover comas
        const cantidad = parseInt(producto.cantidad); // Convertir cantidad a número

        // Verificar que los valores sean números válidos
        if (!isNaN(precio) && !isNaN(cantidad)) {
            subtotal += precio * cantidad;
        } else {
            console.error('Precio o cantidad no es un número', producto);
        }
    });

    // Asegurarse de que el subtotal sea un número válido
    if (isNaN(subtotal)) {
        subtotal = 0;
    }

    // Guardar el subtotal en localStorage para usarlo en otras páginas
    localStorage.setItem('subtotal', subtotal);

    // Formatear el subtotal con separadores de miles y 2 decimales
    const subtotalFormateado = subtotal.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });

    // Actualizar el subtotal en el HTML
    const subtotalElement = document.getElementById("subtotal");
    if (subtotalElement) {
        subtotalElement.textContent = subtotalFormateado;
    }
}

// ----------------------------------------------------------------
// Función para eliminar un producto del carrito con SweetAlert
// ----------------------------------------------------------------
function eliminarProducto(index) {
    // Mostrar la confirmación con SweetAlert
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Este producto será eliminado del carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true // Coloca el botón de cancelar a la derecha
    }).then((result) => {
        if (result.isConfirmed) {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            carrito.splice(index, 1);  // Eliminar el producto de la lista
            localStorage.setItem('carrito', JSON.stringify(carrito));

            // Actualizar la vista del carrito y el subtotal sin recargar la página
            actualizarCarrito();  // Esta función se encargará de recalcular el subtotal y actualizar la vista
        }
    });
}


