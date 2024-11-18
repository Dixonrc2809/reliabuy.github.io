// ----------------------------------------------------------------
// Esta es la funcion para mostar los prodcutos en el 
// la seccion de Populares y qu cambien aleatoriamenete
// ----------------------------------------------------------------        
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

                // Agregar los elementos al contenedor del producto
                productText.appendChild(productName);
                productText.appendChild(productPrice);
                productText.appendChild(addCartButton);
                productBox.appendChild(productText);

                // Añadir el producto al contenedor principal
                contenedorProductos.appendChild(productBox);
            });
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
        });
    });