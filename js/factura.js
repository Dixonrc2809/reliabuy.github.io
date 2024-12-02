document.getElementById('generatePDF').addEventListener('click', function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const factura = JSON.parse(localStorage.getItem('factura'));
    const provincia = JSON.parse(localStorage.getItem('provincia'));
    const canton = JSON.parse(localStorage.getItem('canton'));

    if (factura && provincia && canton) {
        let yPosition = 20;

        // Logo de la empresa
        const logo = new Image();
        logo.src = './imagenes/logoNav.png'; // Ruta del logo
        logo.onload = function () {
            doc.addImage(logo, 'PNG', 20, yPosition, 40, 20);  // Insertar logo en la factura
            yPosition += 25;

            // Título de la factura
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text('Factura de Compra - Reliabuy', 20, yPosition);
            yPosition += 10;

            // Línea de separación
            doc.setLineWidth(0.5);
            doc.line(10, yPosition, 200, yPosition);  // Línea horizontal
            yPosition += 10;

            // Información del cliente
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

            // Detalles de la compra
            doc.setFont("helvetica", "bold");
            doc.text('Detalles de la Compra:', 20, yPosition);
            yPosition += 8;
            doc.setFont("helvetica", "normal");
            doc.text(`Subtotal: ${factura.subtotal.toLocaleString()}`, 20, yPosition); 
            yPosition += 8;
            doc.text(`Envío: ${factura.envio.toLocaleString()}`, 20, yPosition); 
            yPosition += 8;
            doc.text(`Total: ${factura.total.toLocaleString()}`, 20, yPosition); 
            yPosition += 12;

            // Productos comprados
            doc.setFont("helvetica", "bold");
            doc.text('Productos comprados:', 20, yPosition);
            yPosition += 8;
            doc.setFont("helvetica", "normal");
            factura.productos.forEach(producto => {
                doc.text(`${producto.nombre} - ${producto.precio.toLocaleString()} x ${producto.cantidad}`, 20, yPosition); // Añadir símbolo de colones
                yPosition += 8;
            });

            // Línea de separación
            doc.setLineWidth(0.5);
            doc.line(10, yPosition, 200, yPosition);  // Línea horizontal
            yPosition += 10;

            // Información de la empresa
            doc.setFont("helvetica", "italic");
            doc.text('Reliabuy - www.reliabuy.com', 20, yPosition);

            // Guardar el PDF
            doc.save('factura_reliabuy.pdf');
        };
    } else {
        alert('No se encontraron detalles de la factura.');
    }
});