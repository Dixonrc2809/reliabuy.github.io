// Coordenadas de la empresa
const empresaLat = 10.015273983936638;
const empresaLon = -84.21411330856354;

// Inicializar el mapa
const map = L.map('map', {
    minZoom: 10,  // Nivel de zoom mínimo
    maxZoom: 18   // Nivel de zoom máximo
}).setView([empresaLat, empresaLon], 13); // Establecer la vista inicial del mapa

// Capa de mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Marcador en la ubicación de la empresa
const empresaMarker = L.marker([empresaLat, empresaLon]).addTo(map)
    .bindPopup('Ubicación de la Empresa')
    .openPopup();

// Variable para guardar el control de la ruta
let enrutamientoControl = null;

// Función para agregar el cálculo de rutas
function agregarEnrutamiento(origenLat, origenLon) {
    if (enrutamientoControl) {
        // Si ya existe una ruta, la eliminamos
        map.removeControl(enrutamientoControl);
    }

    enrutamientoControl = L.Routing.control({
        waypoints: [
            L.latLng(origenLat, origenLon), // Origen (coordenadas del usuario)
            L.latLng(empresaLat, empresaLon) // Destino (empresa)
        ],
        routeWhileDragging: true, // Permite modificar la ruta al arrastrarla
        createMarker: function() { return null; }, // Desactiva los marcadores intermedios
        language: 'es',  // Establecer el idioma de los pasos (español)
    }).addTo(map);
}

// Función para obtener la ubicación del usuario y mostrar la ruta
function obtenerUbicacionYMostrarRuta() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                // Llamamos a la función para agregar la ruta sin validar la proximidad
                agregarEnrutamiento(userLat, userLon);
            },
            error => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Por favor, habilita el acceso a la ubicación para poder obtener las direcciones.");
                } else {
                    alert("No se pudo obtener tu ubicación. Error: " + error.message);
                }
            },
            {
                enableHighAccuracy: true, // Solicitar alta precisión
                timeout: 10000,  // Tiempo máximo para obtener la ubicación (en milisegundos)
                maximumAge: 0,   // No usar una ubicación almacenada
            }
        );
    } else {
        alert('Tu navegador no soporta la geolocalización.');
    }
}

// Función para ocultar los pasos del enrutamiento
function ocultarRuta() {
    if (enrutamientoControl) {
        map.removeControl(enrutamientoControl);
        enrutamientoControl = null; // Eliminar el control de la ruta
    }
}

// Agregar un botón para ocultar la ruta solo después de que el usuario haga clic en el marcador de la empresa
const botonOcultarRuta = L.control({ position: 'topright' });
botonOcultarRuta.onAdd = function() {
    const div = L.DomUtil.create('div', 'leaflet-bar');
    div.style.display = 'none';  // Inicialmente el botón está oculto
    div.innerHTML = '<button>Ocultar Ruta</button>';
    div.style.backgroundColor = '#fff';
    div.style.border = '1px solid #ccc';
    div.style.padding = '5px';
    div.style.cursor = 'pointer';

    div.onclick = function() {
        ocultarRuta();
        div.style.display = 'none';  // Ocultar el botón después de hacer clic
    };

    return div;
};
botonOcultarRuta.addTo(map);

// Agregar evento de clic al marcador de la empresa
empresaMarker.on('click', function() {
    // Solo mostramos el botón de ocultar ruta cuando el usuario hace clic en el marcador
    botonOcultarRuta.getContainer().style.display = 'block';
    obtenerUbicacionYMostrarRuta();
});
