
    $(document).ready(function() {
      // Cargar y mostrar productos desde el archivo JSON
      $.getJSON('productos.json', function(data) {
        const container = $('#productos-container');
        
        data.forEach(producto => {
          const card = `
            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombreproducto}">
                <div class="card-body">
                  <h5 class="card-title">${producto.nombreproducto}</h5>
                  <p class="card-text">${producto.descripcion.substring(0, 50)}...</p>
                  <p class="card-text"><strong>Precio:</strong> $${producto.precio}</p>
                  <button class="btn btn-primary btn-detalles" data-producto='${JSON.stringify(producto)}'>Ver Detalles</button>
                </div>
              </div>
            </div>`;
          
          container.append(card);
        });

        $('.btn-detalles').on('click', function() {
          const producto = JSON.parse($(this).attr('data-producto'));

          $('#modal-imagen').attr('src', producto.imagen);
          $('#modal-nombre').text(producto.nombreproducto);
          $('#modal-descripcion').text(producto.descripcion);
          $('#modal-precio').text(producto.precio);

          $('#productoModal').modal('show');
        });
      }).fail(function() {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar el archivo JSON de productos.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });

      

      const productosVendidosData = {
        labels: [
            "Monitor LG 32UN880-B 32” 4K",
            "Televisor Samsung Tizen™ Smart TV LED 65",
            "Batidora KitchenAid",
            "Audio-Technica AT2020",
            "OnePlus 10 Pro"
        ],
        datasets: [{
            data: [55, 27, 10, 5, 3],
            backgroundColor: ["#4CAF50", "#8BC34A", "#FFC107", "#F44336", "#2196F3"]
        }]
    };
    


      new Chart(document.getElementById('productosVendidosData'), {
        type: 'doughnut',
        data: productosVendidosData,
        options: {
          responsive: true,
          animation: {
            animateScale: true
          },
          cutout: "50%"
        }
      });
});
