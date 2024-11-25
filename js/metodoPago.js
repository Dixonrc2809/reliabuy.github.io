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