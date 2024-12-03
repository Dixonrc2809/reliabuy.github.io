document.getElementById('generatePDF').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const factura = JSON.parse(localStorage.getItem('factura'));
    const provincia = JSON.parse(localStorage.getItem('provincia'));
    const canton = JSON.parse(localStorage.getItem('canton'));

    if (factura && provincia && canton) {
        let yPosition = 15;

        // Generar un identificador único para la factura
        const uniqueID = `${Date.now()}`;

        // Logo de la empresa
        const logo = new Image();
        logo.src = './imagenes/logoNav.png'; // Ruta del logo
        logo.onload = function () {
            // Reducir la separación del título y el logo con la línea de separación
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text('Factura de Compra', 20, yPosition);

            // Insertar logo a la derecha del título
            doc.addImage(logo, 'PNG', 160, yPosition - 10, 40, 20);

            yPosition += 15; // Espacio para la línea de separación

            // Agregar el identificador único debajo del título
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`ID de Factura: ${uniqueID}`, 20, yPosition);
            yPosition += 8;

            // Línea de separación
            doc.setLineWidth(0.5);
            doc.line(10, yPosition, 200, yPosition);
            yPosition += 10;

            // Información del cliente
            doc.setFont("helvetica", "bold");
            doc.text('Detalles del Cliente:', 20, yPosition);
            yPosition += 8;
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Nombre: ${factura.nombre}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Correo Electrónico: ${factura.correo}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Provincia: ${provincia.nombre}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Cantón: ${canton.nombre}`, 20, yPosition);
            yPosition += 12;

            // Línea de separación
            doc.setLineWidth(0.5);
            doc.line(10, yPosition, 200, yPosition);
            yPosition += 10;

            // Productos comprados
            doc.setFont("helvetica", "bold");
            doc.text('Productos comprados:', 20, yPosition);
            yPosition += 8;
            doc.setFont("helvetica", "normal");
            factura.productos.forEach(producto => {
                // Eliminar el signo de exclamación y solo poner crc
                doc.text(
                    `${producto.nombre} - crc ${producto.precio} x ${producto.cantidad}`,
                    20,
                    yPosition
                );
                yPosition += 8;
            });

            // Línea de separación
            doc.setLineWidth(0.5);
            doc.line(10, yPosition, 200, yPosition);
            yPosition += 10;

            // Detalles de la compra
            doc.setFont("helvetica", "bold");
            doc.text('Detalles de la Compra:', 20, yPosition);
            yPosition += 8;
            doc.setFont("helvetica", "normal");
            doc.text(`Subtotal: crc ${factura.subtotal}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Envío: crc ${factura.envio}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Total: crc ${factura.total}`, 20, yPosition);
            yPosition += 12;

            // Línea de separación
            doc.setLineWidth(0.5);
            doc.line(10, yPosition, 200, yPosition);
            yPosition += 10;

            // Información de la empresa
            doc.setFont("helvetica", "italic");
            doc.text('Reliabuy', 20, yPosition);

            // Guardar el PDF
            doc.save('Factura_Reliabuy.pdf');
        };
    } else {
        alert('No se encontraron detalles de la factura.');
    }
});
