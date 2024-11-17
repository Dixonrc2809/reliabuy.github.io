
// ----------------------------------------------------------------
// Esta es la funcion para obtener el ID del prodcuto que seleccione
// y enviarlo al detalleProducto, con los detalles
// ----------------------------------------------------------------
        function getURLParameter(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        // Obtener el id del producto desde la URL
        const productId = getURLParameter('id');

        // Aquí debes obtener los datos del producto desde un archivo JSON o una base de datos
        fetch('productos.json')  // Suponiendo que productos.json está en el mismo directorio
            .then(response => response.json())
            .then(productos => {
                const producto = productos.find(p => p.id === parseInt(productId));  // Buscar el producto por ID
                if (producto) {
                    // Asignar los datos al HTML
                    document.getElementById("productTitle").innerText = producto.nombre;
                    document.getElementById("productPrice").innerText = producto.precio;
                    document.getElementById("productImage").src = producto.imagen;
                    document.getElementById("productImageThumb").src = producto.imagen;  // Miniatura
                    document.getElementById("productCode").innerText = producto.id;

                    // Mostrar los detalles del producto como HTML
                    const productDetailsList = document.getElementById("productDetailsList");
                    productDetailsList.innerHTML = producto.detalles;  // Insertar directamente el HTML

                } else {
                    // Si no se encuentra el producto
                    alert("Producto no encontrado");
                }
            })
            .catch(error => {
                console.error("Error al cargar los productos:", error);
            });    