
// ----------------------------------------------------------------
// Funcion para llamar al subtotal y mostrarlo
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Recuperar el subtotal desde localStorage
    let subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;

    // Elementos del DOM
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const envioSelect = document.getElementById("envio");
    const envioElement = document.querySelector(".envio-monto"); // Agrega una clase para identificar el elemento del envío

    // Mostrar el subtotal inicial
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
    }

    // Función para actualizar el total
    function actualizarTotal() {
        const envio = parseFloat(envioSelect.value) || 0;
        const total = subtotal + envio;

        // Actualizar el envío en el DOM
        if (envioElement) {
            envioElement.textContent = envio.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
        }

        // Actualizar el total en el DOM
        if (totalElement) {
            totalElement.textContent = total.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
        }
    }

    // Actualizar total al cambiar la opción de envío
    envioSelect.addEventListener("change", actualizarTotal);

    // Llama a la función inicialmente para establecer el total
    actualizarTotal();
});



// ----------------------------------------------------------------
// Funcion para simularpago y enviar datos a la factura
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const btnRealizarPedido = document.querySelector('button.btn.btn-primary');

    btnRealizarPedido.addEventListener('click', function (event) {
        event.preventDefault();

        // Recuperar valores del formulario
        const tncCheckbox = document.getElementById('tnc');
        const nombreCompleto = document.getElementById('nombreCompleto').value;
        const correoElectronico = document.getElementById('correoElectronico').value;
        const provincia = document.getElementById('provincia').value;
        const canton = document.getElementById('canton').value;
        const envioValue = parseFloat(document.getElementById("envio").value) || 0;
        const totalPrice = document.getElementById('total').textContent;
        const subtotal = document.getElementById('subtotal').textContent;
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        // Verificación de los términos y condiciones
        if (!tncCheckbox.checked) {
            Swal.fire({
                title: 'Error',
                text: 'Debes aceptar los términos y condiciones para continuar.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return; // Si no acepta los términos, no se procesa el pago
        }

        // Validación de campos vacíos
        if (nombreCompleto === '' || correoElectronico === '' || provincia === '' || canton === '') {
            Swal.fire({
                title: 'Campos requeridos',
                text: 'Todos los campos son obligatorios',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Validación para la longitud mínima de nombre y correo
        if (nombreCompleto.length < 3) {
            Swal.fire({
                title: 'Nombre inválido',
                text: 'El nombre debe tener al menos 3 caracteres',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (correoElectronico.length < 5) {
            Swal.fire({
                title: 'Correo inválido',
                text: 'El correo debe tener al menos 5 caracteres',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Validación del correo electrónico (expresión regular)
        var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(correoElectronico)) {
            Swal.fire({
                title: 'Correo inválido',
                text: 'Por favor ingresa un correo electrónico válido',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Crear el token de Stripe
        stripe.createToken(card).then(function(result) {
            if (result.error) {
                // Si hay un error en la tarjeta (número incorrecto, tarjeta incompleta, etc.)
                Swal.fire({
                    title: 'Error en el pago',
                    text: result.error.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                // Si el token es válido, proceder con el pago
                Swal.fire({
                    title: '¡Gracias por tu compra!',
                    text: `Tu pago de ${totalPrice} ha sido procesado exitosamente.`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Guardar los detalles de la factura en localStorage
                    localStorage.setItem('factura', JSON.stringify({
                        nombre: nombreCompleto,
                        correo: correoElectronico,
                        provincia: provincia,
                        canton: canton,
                        subtotal: subtotal,
                        envio: envioValue.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' }),
                        total: totalPrice,
                        productos: carrito
                    }));
                    // Redirigir a la página de factura
                    window.location.href = 'factura.html';
                });
            }
        });
    });
});



// ----------------------------------------------------------------
// Funcion para mostrar los datos en la factura
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const factura = JSON.parse(localStorage.getItem('factura'));
    const provincia = JSON.parse(localStorage.getItem('provincia'));
    const canton = JSON.parse(localStorage.getItem('canton'));
    if (factura) {
        const invoiceDetails = document.getElementById('invoiceDetails');
        invoiceDetails.innerHTML = `
            <h4>Detalles de la compra</h4>
            <p><strong>Nombre:</strong> ${factura.nombre}</p>
            <p><strong>Correo Electrónico:</strong> ${factura.correo}</p>
            <p><strong>Provincia:</strong> ${provincia.nombre}</p>
            <p><strong>Cantón:</strong> ${canton.nombre}</p>
            <p><strong>Subtotal:</strong> ${factura.subtotal}</p>
            <p><strong>Envío:</strong> ${factura.envio}</p>
            <p><strong>Total:</strong> ${factura.total}</p>
            <hr>
            <h5>Productos comprados:</h5>
            <ul>
                ${factura.productos.map(producto => `
                    <li>${producto.nombre} - ${producto.precio} x ${producto.cantidad}</li>
                `).join('')}
            </ul>
        `;
    } else {
        document.getElementById('invoiceDetails').innerHTML = '<p>No se encontraron detalles de la factura.</p>';
    }
});



// ----------------------------------------------------------------
// Limpiar el carrito cuando el usuario haga clic en "Volver al inicio"
// ----------------------------------------------------------------
document.getElementById('volverInicio').addEventListener('click', function() {
    // Eliminar los productos del carrito en localStorage
    localStorage.removeItem('carrito');
});