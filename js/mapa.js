// Ubicación de la empresa (puedes cambiarla por las coordenadas reales)
var empresaLat = 10.015273983936638;
var empresaLon = -84.21411330856354;

// Inicializar el mapa y el servicio de direcciones
var map;
var directionsService;
var directionsRenderer;

function initMap() {
    // Inicializar el mapa centrado en la ubicación de la empresa
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: empresaLat, lng: empresaLon },
        zoom: 15
    });

    // Crear un marcador en la ubicación de la empresa
    var marker = new google.maps.Marker({
        position: { lat: empresaLat, lng: empresaLon },
        map: map,
        title: "Ubicación de la Empresa"
    });

    // Inicializar el servicio de direcciones
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Agregar un botón para obtener direcciones
    var directionsButton = document.createElement('button');
    directionsButton.textContent = 'Cómo llegar';
    directionsButton.classList.add('directions-btn');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(directionsButton);

    // Evento del botón para obtener direcciones
    directionsButton.addEventListener('click', function() {
        // Mostrar mensaje de carga
        document.getElementById('directions-panel').innerHTML = 'Cargando direcciones...';

        // Obtener la ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var userLat = position.coords.latitude;
                var userLon = position.coords.longitude;

                var userLocation = new google.maps.LatLng(userLat, userLon);
                var destination = new google.maps.LatLng(empresaLat, empresaLon);

                // Solicitar las direcciones
                var request = {
                    origin: userLocation,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                };

                // Mostrar las direcciones en el mapa
                directionsService.route(request, function(result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(result);
                        document.getElementById('directions-panel').innerHTML = 'Direcciones mostradas en el mapa. <a href="https://www.google.com/maps/dir/?api=1&origin=' + userLat + ',' + userLon + '&destination=' + empresaLat + ',' + empresaLon + '" target="_blank">Abrir en Google Maps</a>';
                    } else {
                        document.getElementById('directions-panel').innerHTML = 'No se pudieron obtener direcciones: ' + status;
                    }
                });
            }, function() {
                document.getElementById('directions-panel').innerHTML = 'No se pudo obtener la ubicación del usuario.';
            });
        } else {
            document.getElementById('directions-panel').innerHTML = 'La geolocalización no es compatible con este navegador.';
        }
    });
}
