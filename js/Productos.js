// ----------------------------------------------------------------
// Acordion del filtrado de Productos
// ----------------------------------------------------------------
var acc = document.getElementsByClassName("accordion");

// Recorre todos los botones y agrega un evento de clic
for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        // Alterna la clase "active" para resaltar el botón
        this.classList.toggle("active");
        
        // Obtén el panel siguiente al botón clicado
        var panel = this.nextElementSibling;
        
        // Si el panel está visible, ocultarlo. Si está oculto, mostrarlo.
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

// ----------------------------------------------------------------
// Funcionaldiad de Categorias del Filtrado en Productos.html
// ----------------------------------------------------------------
const checkboxes = document.querySelectorAll('.filter-category-checkbox, .filter-brand-checkbox, .filter-wifi-checkbox');
    
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterProducts);
});

function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('.filter-category-checkbox:checked')).map(checkbox => checkbox.value);
    const selectedBrands = Array.from(document.querySelectorAll('.filter-brand-checkbox:checked')).map(checkbox => checkbox.value);
    
    const products = document.querySelectorAll('.p-box');
    
    products.forEach(product => {
        const productCategories = product.getAttribute('data-category').split(', ');
        const productBrand = product.getAttribute('data-brand');

        const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(category => productCategories.includes(category));
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(productBrand);

        if (categoryMatch && brandMatch) {
            product.style.order = 1;  // Mover los productos que coinciden al principio
            product.style.visibility = 'visible';
            product.style.opacity = 1;
        } else {
            product.style.order = 2;  // Mover los productos que no coinciden al final
            product.style.visibility = 'hidden';
            product.style.opacity = 0;
        }
    });
}


// ----------------------------------------------------------------
// Funcionalidad de filtro por precios y cantidad de productos
// tambien funcionaldiad del boton para ver mas prodcutos
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById("sort-select");
    const viewSelect = document.getElementById("view-select");
    const productContainer = document.getElementById("product-container");
    const loadMoreButton = document.getElementById("load-more");

    let currentDisplayCount = 9; // Número inicial de productos a mostrar (9 productos)

    // Función para cargar productos desde el archivo JSON
    const loadProducts = () => {
        fetch('productos.json')
            .then(response => response.json())
            .then(products => {
                // Mostrar productos iniciales al cargar la página
                displayProducts(products);

                // Filtros
                sortSelect.addEventListener("change", () => {
                    const sortBy = sortSelect.value;
                    let sortedProducts = [...products];
                    if (sortBy === "high-to-low") {
                        sortedProducts.sort((a, b) => b.precio - a.precio);
                    } else if (sortBy === "low-to-high") {
                        sortedProducts.sort((a, b) => a.precio - b.precio);
                    }
                    displayProducts(sortedProducts);
                });

                viewSelect.addEventListener("change", () => {
                    const viewCount = parseInt(viewSelect.value, 10);
                    currentDisplayCount = viewCount; // Actualizamos el número de productos a mostrar según la selección
                    displayProducts(products);
                });

                // Cargar más productos al presionar el botón
                loadMoreButton.addEventListener("click", () => {
                    currentDisplayCount += 10; // Mostrar 10 productos más
                    displayProducts(products);
                });
            })
            .catch(error => {
                console.error("Error al cargar los productos:", error);
            });
    };

    // Función para mostrar productos en el contenedor
    const displayProducts = (products) => {
        productContainer.innerHTML = ""; // Limpiar productos actuales
        const displayedProducts = products.slice(0, currentDisplayCount); // Seleccionar productos a mostrar según la cantidad

        displayedProducts.forEach(product => {
            const productBox = document.createElement("div");
            productBox.classList.add("p-box");
            productBox.setAttribute("data-category", product.categoria);
            productBox.setAttribute("data-brand", product.marca);
            productBox.innerHTML = `
                <a href="detalleProducto.html?id=${product.id}" class="product-link">
                    <img src="${product.imagen}" alt="${product.nombre}" />
                    <p>${product.nombre}</p>
                    <a class="price" href="#">₡${product.precio}</a>
                </a>
                <a class="buy-btn" href="#">Añadir al Carrito</a>
            `;
            productContainer.appendChild(productBox);
        });
    };

    // Cargar productos al iniciar
    loadProducts();
});




// ----------------------------------------------------------------
// Funcionalidad de Categorias que estan en el Index.html
// ----------------------------------------------------------------
    // Obtener los parámetros de la URL (categoría y marca seleccionada)
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaSeleccionada = urlParams.get('categoria');
    const marcaSeleccionada = urlParams.get('marca');

    // Filtrar los productos según la categoría y la marca seleccionada
    const productos = document.querySelectorAll('.p-box');
    productos.forEach(producto => {
        const categoriaProducto = producto.getAttribute('data-category');
        const marcaProducto = producto.getAttribute('data-brand');

        const categoryMatch = categoriaSeleccionada ? categoriaProducto === categoriaSeleccionada : true;
        const brandMatch = marcaSeleccionada ? marcaProducto === marcaSeleccionada : true;

        if (categoryMatch && brandMatch) {
            // Mover los productos que coinciden al principio
            producto.style.order = 1;
            producto.style.visibility = 'visible';
            producto.style.opacity = 1;
        } else {
            // Mover los productos que no coinciden al final
            producto.style.order = 2;
            producto.style.visibility = 'hidden';
            producto.style.opacity = 0;
        }
    });



// ----------------------------------------------------------------
// Funcionaldiad para icono de compartir
// ----------------------------------------------------------------
const productUrl = window.location.href; // Obtiene la URL actual de la página del producto

document.getElementById('shareIcon').addEventListener('click', function() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: productUrl
        }).then(() => {
            console.log('Producto compartido con éxito!');
        }).catch((error) => {
            console.error('Error al compartir', error);
        });
    } else {
        alert('El compartir no es compatible en este navegador.');
    }
});