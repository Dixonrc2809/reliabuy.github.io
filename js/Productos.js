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
        productContainer.appendChild(productBox);
    });
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
// Funcionaldiad para icono de compartir
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

// Mostrar el cuadro de zoom solo en la sección .photo-main
photoMain.addEventListener('mousemove', (e) => {
    const rect = photoMain.getBoundingClientRect();
    const x = e.clientX - rect.left; // Posición del mouse dentro de .photo-main
    const y = e.clientY - rect.top;

    // Mostrar el cuadro de zoom
    zoomBox.style.display = 'block';

    // Posicionar el cuadro de zoom relativo al mouse
    const boxSize = 200; // Tamaño del cuadro de zoom
    const zoomOffsetX = boxSize / 2;
    const zoomOffsetY = boxSize / 2;
    zoomBox.style.left = `${x - zoomOffsetX}px`;
    zoomBox.style.top = `${y - zoomOffsetY}px`;

    // Configurar la imagen dentro del cuadro de zoom
    zoomBox.innerHTML = `<img src="${mainImage.src}" alt="Zoom">`;
    const zoomImg = zoomBox.querySelector('img');

    // Establecer el nivel de zoom y la imagen estática como fondo del cuadro
    const zoomFactor = 2; // Nivel de zoom
    zoomImg.style.width = `${mainImage.offsetWidth * zoomFactor}px`;
    zoomImg.style.height = `${mainImage.offsetHeight * zoomFactor}px`;

    // Calcular la posición del cursor dentro de la imagen estática
    const zoomX = (x / mainImage.offsetWidth) * (zoomImg.offsetWidth - boxSize);
    const zoomY = (y / mainImage.offsetHeight) * (zoomImg.offsetHeight - boxSize);

    // Ajustar la imagen de zoom según la posición del cursor, moviendo la imagen
    zoomImg.style.transform = `translate(-${zoomX}px, -${zoomY}px)`;
});

// Ocultar el cuadro de zoom al salir de la sección .photo-main
photoMain.addEventListener('mouseleave', () => {
    zoomBox.style.display = 'none';
});

// Asegurar que el cuadro de zoom no aparezca al pasar por otras áreas
document.querySelector('.photo-album').addEventListener('mousemove', () => {
    zoomBox.style.display = 'none';
});





// ----------------------------------------------------------------
// Funcionaldiad apra calificacion de productos
// ----------------------------------------------------------------
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Función para generar las estrellas dinámicamente
function generarEstrellas(calificacion) {
    const estrellasCompletas = Math.floor(calificacion);
    const tieneMediaEstrella = calificacion % 1 >= 0.5;
    const estrellas = '★'.repeat(estrellasCompletas) + (tieneMediaEstrella ? '★' : '☆') + '☆'.repeat(5 - estrellasCompletas - (tieneMediaEstrella ? 1 : 0));
    return estrellas;
}