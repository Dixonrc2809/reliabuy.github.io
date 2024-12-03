// Crear una instancia de Stripe
var stripe = Stripe('pk_test_51QOurnHI0eLYO7CQ1cjRcBGCryTBwKDyOleIWOX8nrJUizBQ6bpLTDxtPXz0z1iDGZtBmPSomUBqeDN0fU1L6Z4x00HfDjQRbZ'); // Reemplaza con tu clave pública de Stripe
var elements = stripe.elements();

// Crear el elemento de tarjeta
var card = elements.create('card');

// Montar el elemento de tarjeta en el DOM
card.mount('#card-element');

// Manejar los errores de la tarjeta
card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    var paymentButton = document.querySelector("button[type='submit']");
    

});

// Función para manejar el envío del formulario y procesar el pago
function procesarPago() {
    var nombreTarjeta = document.getElementById('nombreTarjeta').value;

    // Crear un token con Stripe
    stripe.createToken(card).then(function(result) {
        if (result.error) {
            // Informar al usuario si hay un error con la tarjeta
            document.getElementById('card-errors').textContent = result.error.message;
        }
    });
}

// Asignar la función de procesar pago al botón
document.getElementById('procesarPagoBtn').addEventListener('click', function(e) {
    e.preventDefault();
    procesarPago();
});