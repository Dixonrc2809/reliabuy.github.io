// Función de validación para el formulario
function validarFormulario(event) {
    // Prevenir el envío del formulario si hay errores
    event.preventDefault();

    var nombre = document.getElementById('firstName').value;
    var correo = document.getElementById('email').value;
    var apellido = document.getElementById('lastName').value;
    var telefono = document.getElementById('phone').value;
    var mensaje = document.getElementById('message').value;
    var genero = document.getElementById('gender').value;
    var fechaNacimiento = document.getElementById('birthDate').value;
    
    // Validación para campos vacíos
    if (nombre === '' || correo === '' || apellido === '' || telefono === '' || mensaje === '' || genero === '' || fechaNacimiento === '') {
        alert('Todos los campos son obligatorios');
        return false;
    }

    // Validación para la longitud mínima de nombre y correo
    if (nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        return false;
    }

    if (correo.length < 5) {
        alert('El correo debe tener al menos 5 caracteres');
        return false;
    }

    // Validación de correo electrónico (simple)
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(correo)) {
        alert('Por favor ingresa un correo electrónico válido');
        return false;
    }

    // Validación para que la fecha no sea hoy o futura
    var fechaHoy = new Date();
    var fechaSeleccionada = new Date(fechaNacimiento);
    if (fechaSeleccionada > fechaHoy) {
        alert('La fecha de nacimiento no puede ser hoy ni en el futuro');
        return false;
    }

    // Validación para que el número de teléfono sea numérico y tenga al menos 8 dígitos
    var telefonoRegex = /^[0-9]{8,}$/; // Asegura que el teléfono sea numérico y tenga al menos 8 caracteres
    if (!telefonoRegex.test(telefono)) {
        alert('El número de teléfono debe ser numérico y tener al menos 8 dígitos');
        return false;
    }

    // Si todo está bien, simular el envío del formulario
    alert('Formulario enviado correctamente');
    
    // Limpiar el formulario y recargar la página
    document.getElementById('contactForm').reset();
    location.reload(); // Recarga la página
}

// Vincular la función de validación al formulario
document.getElementById('contactForm').addEventListener('submit', validarFormulario);



