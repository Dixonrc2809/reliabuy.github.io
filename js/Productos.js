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
        panel.style.display = (panel.style.display === "block") ? "none" : "block";
    });
}

// ----------------------------------------------------------------
// Función de filtrado de productos
// ----------------------------------------------------------------
const checkboxes = document.querySelectorAll('.filter-category-checkbox, .filter-brand-checkbox, .filter-wifi-checkbox');
const sortSelect = document.getElementById("sort-select");
const viewSelect = document.getElementById("view-select");
const productContainer = document.getElementById("product-container");
const loadMoreButton = document.getElementById("load-more");

let currentDisplayCount = 9; // Número inicial de productos a mostrar (9 productos)
let allProducts = []; // Variable global para almacenar todos los productos

// Filtros independientes para categorías, marcas y orden de precios
function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.filter-category-checkbox:checked')).map(cb => cb.value);
    const selectedBrands = Array.from(document.querySelectorAll('.filter-brand-checkbox:checked')).map(cb => cb.value);
    const sortBy = sortSelect.value;

    // Filtrar los productos de acuerdo a categorías y marcas
    let filteredProducts = allProducts.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.categoria);
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.marca);
        return categoryMatch && brandMatch;
    });

    // Ordenar los productos filtrados por precio
    if (sortBy === "high-to-low") {
        filteredProducts.sort((a, b) => parseFloat(b.precio.replace(/[^0-9.-]+/g, "")) - parseFloat(a.precio.replace(/[^0-9.-]+/g, "")));
    } else if (sortBy === "low-to-high") {
        filteredProducts.sort((a, b) => parseFloat(a.precio.replace(/[^0-9.-]+/g, "")) - parseFloat(b.precio.replace(/[^0-9.-]+/g, "")));
    }

    displayProducts(filteredProducts);
}

// Función para mostrar productos en el contenedor
function displayProducts(products) {
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
        
        // Agregar evento para "Añadir al Carrito"
        const buyButton = productBox.querySelector('.buy-btn');
        buyButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir la acción por defecto del enlace

            // Obtener carrito del localStorage, si no existe, crear uno
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

            // Verificar si el producto ya existe en el carrito
            const existingProduct = carrito.find(item => item.id === product.id);

            if (existingProduct) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                existingProduct.cantidad += 1;
            } else {
                // Si el producto no está, agregarlo al carrito con cantidad 1
                product.cantidad = 1;
                carrito.push(product);
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

        productContainer.appendChild(productBox);
    });
}

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

// ----------------------------------------------------------------
// Cargar productos y agregar eventos de filtro
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    fetch('productos.json')
        .then(response => response.json())
        .then(products => {
            allProducts = products; // Almacenar todos los productos

            // Mostrar productos iniciales
            applyFilters();

            // Eventos de filtrado
            checkboxes.forEach(checkbox => checkbox.addEventListener('change', applyFilters));
            sortSelect.addEventListener("change", applyFilters);

            viewSelect.addEventListener("change", () => {
                currentDisplayCount = parseInt(viewSelect.value, 10); // Actualizar la cantidad de productos a mostrar
                applyFilters();
            });

            loadMoreButton.addEventListener("click", () => {
                currentDisplayCount += 10; // Incrementar la cantidad de productos a mostrar
                applyFilters();
            });
        })
        .catch(error => console.error("Error al cargar los productos:", error));
});

// ----------------------------------------------------------------
// Funcionalidad de Categorias que estan en el Index.html
// ----------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
const categoriaSeleccionada = urlParams.get('categoria');
const marcaSeleccionada = urlParams.get('marca');

function filterInitialProducts() {
    const selectedProducts = allProducts.filter(product => {
        const categoryMatch = categoriaSeleccionada ? product.categoria === categoriaSeleccionada : true;
        const brandMatch = marcaSeleccionada ? product.marca === marcaSeleccionada : true;
        return categoryMatch && brandMatch;
    });
    displayProducts(selectedProducts);
}

// ----------------------------------------------------------------
// Funcionalidad para icono de compartir
// ----------------------------------------------------------------
const productUrl = window.location.href;

document.getElementById('shareIcon').addEventListener('click', function() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: productUrl
        }).then(() => console.log('Producto compartido con éxito!'))
        .catch(error => console.error('Error al compartir', error));
    } else {
        alert('El compartir no es compatible en este navegador.');
    }
});

// ----------------------------------------------------------------
// Funcionalidad del zoom en productos
// ----------------------------------------------------------------
const photoMain = document.querySelector('.photo-main');
const mainImage = document.querySelector('#productImage');
const zoomBox = document.querySelector('.zoom-box');

photoMain.addEventListener('mousemove', (e) => {
    const rect = photoMain.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    zoomBox.style.display = 'block';
    const boxSize = 200;
    const zoomOffsetX = boxSize / 2;
    const zoomOffsetY = boxSize / 2;
    zoomBox.style.left = `${x - zoomOffsetX}px`;
    zoomBox.style.top = `${y - zoomOffsetY}px`;

    zoomBox.innerHTML = `<img src="${mainImage.src}" alt="Zoom">`;
    const zoomImg = zoomBox.querySelector('img');
    const zoomFactor = 2;
    zoomImg.style.width = `${mainImage.offsetWidth * zoomFactor}px`;
    zoomImg.style.height = `${mainImage.offsetHeight * zoomFactor}px`;

    const zoomX = (x / mainImage.offsetWidth) * (zoomImg.offsetWidth - boxSize);
    const zoomY = (y / mainImage.offsetHeight) * (zoomImg.offsetHeight - boxSize);

    zoomImg.style.transform = `translate(-${zoomX}px, -${zoomY}px)`;
});

photoMain.addEventListener('mouseleave', () => {
    zoomBox.style.display = 'none';
});

document.querySelector('.photo-album').addEventListener('mousemove', () => {
    zoomBox.style.display = 'none';
});

// ----------------------------------------------------------------
// Funcionalidad para calificación de productos
// ----------------------------------------------------------------
function generarEstrellas(calificacion) {
    const estrellasCompletas = Math.floor(calificacion);
    const tieneMediaEstrella = calificacion % 1 >= 0.5;
    const estrellas = '★'.repeat(estrellasCompletas) + (tieneMediaEstrella ? '★' : '☆') + '☆'.repeat(5 - estrellasCompletas - (tieneMediaEstrella ? 1 : 0));
    return estrellas;
}
