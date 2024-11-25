document.addEventListener("DOMContentLoaded", () => {
    fetch('productos.json')  // Cargar el archivo JSON con los productos
        .then(response => response.json())
        .then(productos => {
            // Función para obtener un número aleatorio entre min y max
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            // Crear un array con 5 productos aleatorios
            const productosAleatorios = [];
            while (productosAleatorios.length < 5) {
                const randomIndex = getRandomInt(0, productos.length - 1);
                const producto = productos[randomIndex];

                // Evitar productos duplicados
                if (!productosAleatorios.includes(producto)) {
                    productosAleatorios.push(producto);
                }
            }

            const contenedorProductos = document.getElementById("cambiar-orden-productos");

            // Recorrer los productos aleatorios y crear el HTML
            productosAleatorios.forEach(producto => {
                const productBox = document.createElement("div");
                productBox.classList.add("product-box");

                // Crear enlace para cada producto, apuntando a detalleProducto.html con el ID del producto
                const productLink = document.createElement("a");
                productLink.href = `detalleProducto.html?id=${producto.id}`;  // ID del producto en la URL
                productLink.classList.add("product-img");

                const productImg = document.createElement("img");
                productImg.alt = producto.nombre;
                productImg.src = producto.imagen;  // Imagen del producto

                productLink.appendChild(productImg);
                productBox.appendChild(productLink);

                // Crear la parte de la descripción y el precio
                const productText = document.createElement("div");
                productText.classList.add("product-text");

                const productName = document.createElement("a");
                productName.href = `detalleProducto.html?id=${producto.id}`;  // ID del producto en la URL
                productName.classList.add("product-box-p-name");
                productName.innerText = producto.nombre;  // Nombre del producto

                const productPrice = document.createElement("span");
                productPrice.classList.add("p-box-price");
                productPrice.innerText = `₡${producto.precio}`;  // Precio del producto

                const addCartButton = document.createElement("button");
                addCartButton.classList.add("add-cart-btn");
                addCartButton.innerText = "Añadir al carrito";

                // Función para añadir al carrito
                addCartButton.addEventListener("click", () => {
                    // Obtener carrito del localStorage, si no existe, crear uno
                    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

                    // Verificar si el producto ya existe en el carrito
                    const existingProduct = carrito.find(item => item.id === producto.id);

                    if (existingProduct) {
                        // Si el producto ya está en el carrito, incrementar la cantidad
                        existingProduct.cantidad += 1;
                    } else {
                        // Si el producto no está, agregarlo al carrito con cantidad 1
                        producto.cantidad = 1;
                        carrito.push(producto);
                    }

                    // Guardar el carrito en localStorage
                    localStorage.setItem('carrito', JSON.stringify(carrito));

                    // Mostrar una alerta usando SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto añadido al carrito',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // Actualizar el icono del carrito y el subtotal
                    actualizarIndicadorCarrito();
                    actualizarSubtotal();
                });

                // Agregar los elementos al contenedor del producto
                productText.appendChild(productName);
                productText.appendChild(productPrice);
                productText.appendChild(addCartButton);
                productBox.appendChild(productText);

                // Añadir el producto al contenedor principal
                contenedorProductos.appendChild(productBox);
            });

            // Función para actualizar el contador de productos en el carrito
            function actualizarIndicadorCarrito() {
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                const cartIndicator = document.getElementById("cart-indicator");
                if (carrito.length > 0) {
                    cartIndicator.style.display = 'inline';
                    cartIndicator.textContent = carrito.length;
                } else {
                    cartIndicator.style.display = 'none';
                }
            }

            // Función para actualizar el subtotal del carrito
            function actualizarSubtotal() {
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                let subtotal = 0;

                // Calcular el subtotal
                carrito.forEach(producto => {
                    subtotal += producto.precio * producto.cantidad;
                });

                // Mostrar el subtotal
                const subtotalElement = document.getElementById("subtotal");
                if (subtotalElement) {
                    subtotalElement.innerText = `Subtotal: ₡${subtotal}`;
                }
            }

            // Función para eliminar un producto del carrito
            function eliminarDelCarrito(idProducto) {
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                carrito = carrito.filter(producto => producto.id !== idProducto);
                localStorage.setItem('carrito', JSON.stringify(carrito));

                // Actualizar el carrito y subtotal
                actualizarIndicadorCarrito();
                actualizarSubtotal();
            }

            // Función para incrementar la cantidad de un producto en el carrito
            function incrementarCantidad(idProducto) {
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                const producto = carrito.find(p => p.id === idProducto);
                if (producto) {
                    producto.cantidad += 1;
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                }

                // Actualizar el carrito y subtotal
                actualizarIndicadorCarrito();
                actualizarSubtotal();
            }

            // Función para decrementar la cantidad de un producto en el carrito
            function decrementarCantidad(idProducto) {
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                const producto = carrito.find(p => p.id === idProducto);
                if (producto && producto.cantidad > 1) {
                    producto.cantidad -= 1;
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                }

                // Actualizar el carrito y subtotal
                actualizarIndicadorCarrito();
                actualizarSubtotal();
            }

            // Actualizar el carrito y el subtotal al cargar la página
            actualizarIndicadorCarrito();
            actualizarSubtotal();
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
        });
});
