
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
            "Pizza Margarita", 
            "Hamburguesa Clásica", 
            "Sushi Roll", 
            "Pasta Alfredo", 
            "Ensalada César", 
            "Taco Mexicano"
        ],
        datasets: [{
            label: "Cantidad Vendida",
            data: [15, 14, 13, 12, 11, 10],
            backgroundColor: [
                "#001F4D", // Azul marino oscuro
                "#003080", // Azul intermedio oscuro
                "#0040B3", // Azul intermedio
                "#007BFF", // Azul brillante
                "#3385CC", // Azul claro oscuro
                "#66A3FF"  // Azul suave ajustado
            ]
        }]
    };
    
    // Opciones del gráfico con formato de porcentaje en los tooltips
    const opcionesProductosVendidos = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        const valor = tooltipItem.raw;
                        return `${valor}%`; // Mostrar como porcentaje
                    }
                }
            }
        }
    };
    
    
    
    
    new Chart(document.getElementById('productosVendidosData'), {
      type: 'bar',
      data: productosVendidosData,
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      callback: function(value) {
                          return value + '%'; // Agrega el signo de porcentaje en el eje Y
                      }
                  }
              }
          },
          plugins: {
              tooltip: {
                  callbacks: {
                      label: function(tooltipItem) {
                          const valor = tooltipItem.raw;
                          return `Cantidad Vendida: ${valor}%`; // Formato del tooltip con %
                      }
                  }
              },
              legend: {
                  display: false // Oculta la leyenda
              }
          }
      }
  });      
});
