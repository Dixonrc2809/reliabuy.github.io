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

// Función para ocultar los resultados si se hace clic fuera
document.addEventListener('click', function(event) {
    const searchResults = document.getElementById("searchResults");
    const searchButton = document.getElementById("searchButton");
    const searchForm = document.getElementById("searchForm");

    // Verificar si el clic fue fuera del campo de búsqueda y los resultados
    if (!searchResults.contains(event.target) && !searchButton.contains(event.target) && !searchForm.contains(event.target)) {
        searchResults.style.display = "none"; // Ocultar resultados
    }
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
            <img src="${producto.imagen}" alt="${producto.nombre}" class="resultado-imagen">
            <div class="resultado-detalles">
                <strong>${producto.nombre}</strong><br>
                ₡${producto.precio}
            </div>
            `;

            // Maneja el clic en el resultado
            resultadoItem.onclick = () => {
                // Redirige a la página de detalles con el ID del producto
                window.location.href = `detalleProducto.html?id=${producto.id}`;
            };
            
            searchResults.appendChild(resultadoItem);
        });
        searchResults.style.display = "block"; // Muestra el contenedor de resultados
    } else {
        searchResults.style.display = "none"; // Oculta el contenedor si no hay resultados
    }
}