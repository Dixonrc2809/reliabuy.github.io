// Datos de productos con ventas (puedes actualizar estos datos con información real de tu base de datos o API)
const productos = [
    { nombre: "Auriculares Westmire A56", ventas: 120 },
    { nombre: "Audifonos Sony WH-CH510", ventas: 80 },
    { nombre: "Bose QuietComfort 45", ventas: 150 },
    { nombre: "JBL Tune 750BTNC", ventas: 100 },
    { nombre: "Airpods Max", ventas: 60 },
    { nombre: "Teclado Mecánico Xpert-k9", ventas: 90 },
    { nombre: "Mouse Gamer Logitech G502", ventas: 110 }
];

  // Ordenamos los productos por ventas de mayor a menor
const productosOrdenados = productos.sort((a, b) => b.ventas - a.ventas);

  // Seleccionamos los primeros 5 productos más vendidos (puedes cambiar este número)
const productosMasVendidos = productosOrdenados.slice(0, 5);

  // Extraemos los datos necesarios para el gráfico
const labels = productosMasVendidos.map(producto => producto.nombre);
const data = productosMasVendidos.map(producto => producto.ventas);

  // Crear el gráfico donut
const ctx = document.getElementById('myDonutChart').getContext('2d');
new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels, // Nombres de los productos más vendidos
    datasets: [{
        label: 'Ventas de productos',
        data: data, // Datos de ventas de los productos más vendidos
        backgroundColor: ['#FF5733', '#FF8D1A', '#FFBB33', '#FFDA33', '#33A0FF'], // Colores del gráfico
        borderWidth: 1
    }]
    },
    options: {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        tooltip: {
        callbacks: {
            label: function(tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw + ' ventas';
        }
        }
        }
    }
    }
});
