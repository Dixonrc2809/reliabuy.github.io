
// ----------------------------------------------------------------
// Funcion para llamar al subtotal y mostrarlo
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Recuperar el subtotal desde localStorage
    const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;

    // Obtener el elemento donde mostrar el subtotal
    const subtotalElement = document.getElementById("subtotal");

    // Verificar que el elemento existe antes de actualizarlo
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
    }

    // Si tienes un campo de total, también puedes calcularlo (incluyendo el envío)
    const envio = 6000; // Suponiendo que el costo de envío es 6000
    const total = subtotal + envio;

    // Mostrar el total también
    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.textContent = total.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' });
    }
});


// ----------------------------------------------------------------
// Funcion para simularpago y enviar datos a la factura
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    // Agregar evento al botón "Realizar pedido"
    const btnRealizarPedido = document.querySelector('button.btn.btn-primary');
    
    btnRealizarPedido.addEventListener('click', function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto (enviar formulario)

        // Simulación de validación del pago
        const tncCheckbox = document.getElementById('tnc'); // Términos y condiciones
        const subscribeCheckbox = document.getElementById('subscribe'); // Recibir correos
        const totalPrice = document.getElementById('total').textContent; // Precio total
        const subtotal = document.getElementById('subtotal').textContent; // Subtotal
        
        const nombreCompleto = document.getElementById('nombreCompleto').value;
        const correoElectronico = document.getElementById('correoElectronico').value;
        const provincia = document.getElementById('provincia').value;
        const canton = document.getElementById('canton').value;

        
        // Obtener productos del carrito desde localStorage
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        if (tncCheckbox.checked) {
            // Simula que el pago fue procesado exitosamente
            Swal.fire({
                title: '¡Gracias por tu compra!',
                text: `Tu pago de ${totalPrice} ha sido procesado exitosamente.`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Guardar los datos de la compra en el almacenamiento local
                localStorage.setItem('factura', JSON.stringify({
                    nombre: nombreCompleto,
                    correo: correoElectronico,
                    provincia: provincia,
                    canton: canton,
                    subtotal: subtotal,
                    envio: '₡6000.00',
                    total: totalPrice,
                    productos: carrito  // Agregar los productos comprados
                }));                
                
                // Redirigir a la página de la factura
                window.location.href = 'factura.html'; // Página de factura
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Debes aceptar los términos y condiciones para continuar.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
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
        
        // Mostrar la información de la factura
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
                ${factura.productos.length > 0 ? factura.productos.map(producto => `    
                    <li>${producto.nombre} - ${producto.precio} x ${producto.cantidad}</li>
                `).join('') : '<li>No se encontraron productos.</li>'}
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