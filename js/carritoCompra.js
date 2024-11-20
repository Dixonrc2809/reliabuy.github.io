document.addEventListener("DOMContentLoaded", () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedorCarrito = document.getElementById("carrito-contenido");
    const carritoVacio = document.getElementById("carrito-vacio");
    const subtotalElement = document.getElementById("subtotal");

    // Función para calcular el subtotal
    function calcularSubtotal() {
        let subtotal = 0;

        carrito.forEach(producto => {
            // Eliminar comas y convertir a número
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

        // Actualizar el subtotal en el HTML
        subtotalElement.textContent = `₡${subtotal.toFixed(2)}`;
    }

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
        carritoVacio.style.display = "block";
    } else {
        carritoVacio.style.display = "none";
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
                        <!-- Input de cantidad, inicializado en 1 -->
                        <input type="number" class="form-control" value="${producto.cantidad}" min="1" max="99" onchange="actualizarCantidad(${index}, this.value)" />
                        <!-- Botón de eliminar -->
                        <button class="btn btn-danger" onclick="eliminarProducto(${index})">Eliminar</button>
                    </div>
                </div>
            `;
            contenedorCarrito.appendChild(itemCarrito);
        });

        // Calcular el subtotal inicial
        calcularSubtotal();
    }

    console.log("Carrito desde localStorage:", carrito);
});

// Función para agregar un producto al carrito
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

    // Actualizar la vista y el subtotal
    location.reload(); // Recargar la página para actualizar el carrito
}

// Función para actualizar la cantidad del producto en el carrito
function actualizarCantidad(index, cantidad) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito[index].cantidad = parseInt(cantidad);  // Actualizar la cantidad como un número entero
    localStorage.setItem('carrito', JSON.stringify(carrito));
    calcularSubtotal();  // Volver a calcular el subtotal sin recargar la página
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);  // Eliminar el producto de la lista
    localStorage.setItem('carrito', JSON.stringify(carrito));
    location.reload();  // Recargar la página para actualizar el carrito
}
