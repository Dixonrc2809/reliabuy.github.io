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
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById("sort-select");
    const viewSelect = document.getElementById("view-select");
    const productContainer = document.getElementById("product-container");

    // Función para ordenar productos por precio
    function sortProducts(order) {
        let products = Array.from(productContainer.querySelectorAll(".p-box"));
        products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector(".price").textContent.replace(/[^0-9.-]+/g, ""));
            const priceB = parseFloat(b.querySelector(".price").textContent.replace(/[^0-9.-]+/g, ""));
            return order === "low-to-high" ? priceA - priceB : priceB - priceA;
        });

        // Limpiar el contenedor y añadir los productos en el nuevo orden
        productContainer.innerHTML = "";
        products.forEach((product) => productContainer.appendChild(product));
    }

    // Función para mostrar un número específico de productos
    function showProducts(limit) {
        const allProducts = Array.from(productContainer.querySelectorAll(".p-box"));
        allProducts.forEach((product, index) => {
            product.style.display = index < limit ? "block" : "none";
        });
    }

    // Evento para ordenar los productos cuando cambia la selección
    sortSelect.addEventListener("change", (e) => {
        sortProducts(e.target.value);
    });

    // Evento para mostrar la cantidad seleccionada de productos
    viewSelect.addEventListener("change", (e) => {
        showProducts(parseInt(e.target.value, 10));
    });

    // Inicializar la visualización predeterminada de productos
    showProducts(parseInt(viewSelect.value, 10));
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