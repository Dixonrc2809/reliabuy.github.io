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
document.getElementById('searchButton').addEventListener('click', function() {
    const searchForm = document.getElementById('searchForm');
    searchForm.classList.toggle('d-none');
});



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
// Caracteristicas de los productos
// ----------------------------------------------------------------
function openProductPage(nombre, precio, imagen, codigo, descripcion) {
    sessionStorage.setItem("productTitle", nombre);
    sessionStorage.setItem("productPrice", precio);
    sessionStorage.setItem("productImage", imagen);
    sessionStorage.setItem("productCode", codigo);
    sessionStorage.setItem("productDescription", descripcion);

    window.location.href = "detalleProducto.html"; 
}

// ----------------------------------------------------------------
// Modal para los productos
// ----------------------------------------------------------------
function showModal() {
    const productImageSrc = document.getElementById("productImage").src; // Obtiene la fuente de la imagen del producto
    document.getElementById("modalImage").src = productImageSrc; // Asigna la fuente de la imagen al modal
    const modal = new bootstrap.Modal(document.getElementById('imageModal')); // Inicializa el modal de Bootstrap
    modal.show(); // Muestra el modal
}

// ----------------------------------------------------------------
// Acordion Productos
// ----------------------------------------------------------------
document.querySelectorAll('.accordion').forEach(button => {
    button.addEventListener('click', function() {
        // Alternar la clase 'active' en el botón
        this.classList.toggle('active');
        
        // Obtener el panel siguiente al botón
        const panel = this.nextElementSibling;
        
        // Si el panel está abierto, cerrarlo
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            // De lo contrario, abrirlo (con la altura dinámica)
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
});

