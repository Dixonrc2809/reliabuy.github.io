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
// Funcionaldiad de Categorias del Filtrado
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
// Funcionn para que al cargar la pagina, los Productos Populares se cambien de orden
// ----------------------------------------------------------------
window.onload = function() {
    let container = document.getElementById('cambiar-orden-productos');
    let products = Array.from(container.getElementsByClassName('product-box'));
    
    // Aleatoriza los productos
    products.sort(() => Math.random() - 0.5);
    
    // Vuelve a añadir los productos al contenedor en el nuevo orden
    products.forEach(product => container.appendChild(product));
};


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