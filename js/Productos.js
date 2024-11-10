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
    const wifiOptions = Array.from(document.querySelectorAll('.filter-wifi-checkbox:checked')).map(checkbox => checkbox.value);
    
    const products = document.querySelectorAll('.p-box');
    
    products.forEach(product => {
        const productCategories = product.getAttribute('data-category').split(', ');
        const productBrand = product.getAttribute('data-brand');
        const wifi = product.getAttribute('data-wifi'); // Asegúrate de agregar este dato en los productos si es necesario

        const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(category => productCategories.includes(category));
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(productBrand);
        const wifiMatch = wifiOptions.length === 0 || wifiOptions.includes(wifi);

        if (categoryMatch && brandMatch && wifiMatch) {
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
