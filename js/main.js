// ----------------------------------------------------------------
// Detectar clics fuera del menú de hamburguesa en dispositivos móviles
// ----------------------------------------------------------------
document.addEventListener("click", function(event) {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    // Verificar si el clic es fuera del navbar y si el menú está abierto
    if (navbarCollapse.classList.contains("show") && !navbarToggler.contains(event.target) && !navbarCollapse.contains(event.target)) {
        navbarToggler.click(); // Simula el clic para cerrar el menú
    }
});

// ----------------------------------------------------------------
// Función para actualizar el texto y los botones en el carrusel
// ----------------------------------------------------------------
const carouselItems = document.querySelectorAll('.carousel-item');
const titleElement = document.getElementById('hero-title');
const buttonElement1 = document.querySelector('#hero-buttons .btn.btn-primary');
const buttonElement2 = document.querySelector('#hero-buttons .btn.btn-outline-secondary');

const updateContent = (index) => {
    const item = carouselItems[index];
    titleElement.innerText = item.getAttribute('data-title');
    buttonElement1.innerText = item.getAttribute('data-button1');
    buttonElement2.innerText = item.getAttribute('data-button2');

    // Extraer los datos del producto y asignarlos al onclick de buttonElement2
    const productInfo = item.getAttribute('data-product-info');
    buttonElement2.setAttribute('onclick', `openProductPage${productInfo}`);
};

// Evento para actualizar el contenido al cambiar de diapositiva
document.getElementById('carouselExampleIndicators').addEventListener('slide.bs.carousel', (event) => {
    const nextIndex = event.to; // índice de la siguiente diapositiva
    updateContent(nextIndex);
});

// Inicializa el contenido en la primera diapositiva
updateContent(0);


// ----------------------------------------------------------------
// boton de busqueda en el NAV
// ----------------------------------------------------------------
function toggleSearch() {
    const searchForm = document.getElementById("searchForm");
    searchForm.classList.toggle("d-none");
}

// ----------------------------------------------------------------
// Funcionalidad para buscar Productos por nombre
// ----------------------------------------------------------------
let productos = [];

// Cargar el archivo JSON cuando se cargue la página
window.addEventListener('DOMContentLoaded', () => {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});

// Función para buscar productos en tiempo real
function searchProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const searchResults = document.getElementById("searchResults");

    // Filtra los productos que coincidan con el texto de búsqueda
    const resultadosFiltrados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(searchInput)
    );

    // Limpia los resultados previos
    searchResults.innerHTML = "";

    if (searchInput && resultadosFiltrados.length > 0) {
        // Muestra los productos que coinciden
        resultadosFiltrados.forEach(producto => {
            const resultadoItem = document.createElement("div");
            resultadoItem.classList.add("resultado-item");

            // Agrega la imagen, nombre y precio del producto
            resultadoItem.innerHTML = `
                <img src="./imagenes/${producto.imagen}" alt="${producto.nombre}" class="resultado-imagen">
                <div class="resultado-detalles">
                    <strong>${producto.nombre}</strong><br>
                    $${producto.precio}
                </div>
            `;

            // Maneja el clic en el resultado
            resultadoItem.onclick = () => {
                window.location.href = `productos.html?nombre=${encodeURIComponent(producto.nombre)}`;
            };
            
            searchResults.appendChild(resultadoItem);
        });
        searchResults.style.display = "block"; // Muestra el contenedor de resultados
    } else {
        searchResults.style.display = "none"; // Oculta el contenedor si no hay resultados
    }
}



// ----------------------------------------------------------------
// Que aparezca el boton de subir al hacer scroll
// ----------------------------------------------------------------
const btnFlotante = document.querySelector('.btn-flotante');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) { // Cambia 100 a la cantidad de píxeles que desees
        btnFlotante.classList.remove('hidden');
    } else {
        btnFlotante.classList.add('hidden');
    }
});



// ----------------------------------------------------------------
// Modal para los productos
// ----------------------------------------------------------------
function showModal() {
    const productImageSrc = document.getElementById("productImage").src; // Obtiene la fuente de la imagen del producto
    document.getElementById("modalImage").src = productImageSrc; // Asigna la fuente de la imagen al modal
    const modal = new bootstrap.Modal(document.getElementById('imageModal')); // Inicializa el modal de Bootstrap
    modal.show(); // Muestra el modal
}



