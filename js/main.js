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



