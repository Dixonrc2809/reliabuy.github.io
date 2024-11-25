// ----------------------------------------------------------------
// Esta es la funcion para obtener el ID del producto que seleccione
// y enviarlo al detalleProducto, con los detalles del json
// ----------------------------------------------------------------
fetch('productos.json')
    .then(response => response.json())
    .then(productos => {
        const productId = getURLParameter('id');  // Obtener el id del producto desde la URL
        const producto = productos.find(p => p.id === parseInt(productId)); // Buscar el producto por ID

        if (producto) {
            // Asignar los datos al HTML
            document.getElementById("productTitle").textContent = producto.nombre;
            document.getElementById("productPrice").textContent = producto.precio;
            document.getElementById("productImage").src = producto.imagen;
            document.getElementById("productImageThumb").src = producto.imagen;  // Miniatura
            document.getElementById("productCode").textContent = producto.id;

            // Asignar la calificación y las estrellas
            document.getElementById("productRating").textContent = producto.calificacion;
            document.getElementById("productStars").innerHTML = generarEstrellas(producto.calificacion);

            // Mostrar los detalles del producto
            const productDetailsList = document.getElementById("productDetailsList");
            if (Array.isArray(producto.detalles)) {
                productDetailsList.innerHTML = producto.detalles.map(detail => `<li>${detail}</li>`).join('');
            } else {
                productDetailsList.innerHTML = producto.detalles;
            }

            // Cargar las características en el modal
            const productFeaturesList = document.getElementById("productFeaturesList");
            if (producto.caracteristicas) {
                productFeaturesList.innerHTML = Object.entries(producto.caracteristicas)
                    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
                    .join('');
            }

            // Acción del botón "Añadir al carrito"
            document.querySelector(".buy--btn").addEventListener("click", function() {
                // Obtener carrito desde localStorage
                let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

                // Verificar si el producto ya está en el carrito
                const productoExistente = carrito.find(item => item.id === producto.id);
                if (productoExistente) {
                    // Mostrar alerta si el producto ya está en el carrito
                    Swal.fire({
                        icon: 'info',
                        title: 'Este producto ya está en tu carrito.',
                        showConfirmButton: true,
                    });
                } else {
                    // Crear una copia del producto y agregarle la cantidad 1
                    const productoConCantidad = { ...producto, cantidad: 1 };

                    // Agregar el producto al carrito
                    carrito.push(productoConCantidad);

                    // Guardar carrito en localStorage
                    localStorage.setItem("carrito", JSON.stringify(carrito));

                    // Mostrar notificación de éxito usando SweetAlert2
                    Swal.fire({
                        icon: 'success',
                        title: '¡Producto añadido al carrito!',
                        text: `${producto.nombre} se ha añadido correctamente a tu carrito.`,
                        showConfirmButton: true,
                    });

                    // Actualizar el carrito y el subtotal
                    actualizarCarrito();
                    calcularSubtotal();
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Producto no encontrado.',
                text: 'No se pudo cargar el producto.',
                showConfirmButton: true,
            });
        }
    })
    .catch(error => {
        console.error("Error al cargar los productos:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar el producto.',
            text: 'Hubo un problema al intentar cargar los detalles del producto.',
            showConfirmButton: true,
        });
    });

// Función para obtener el parámetro de la URL
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}