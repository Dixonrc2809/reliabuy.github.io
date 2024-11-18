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
// Funcion para ver el prodcuto del carrusel
// ----------------------------------------------------------------
document.querySelectorAll('.btn-outline-secondary').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id'); // Obtener el ID del producto
        viewDetails(productId); // Redirigir a la página de detalles
    });
});

function viewDetails(productId) {
    window.location.href = `detalleProducto.html?id=${productId}`;
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



