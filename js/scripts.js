// Productos de ejemplo
/*const products = [
    { id: 1, name: "Camisa Blanca", price: 25.00 },
    { id: 2, name: "Camisa Negra", price: 30.00 },
    { id: 3, name: "Camisa Azul", price: 20.00 }
];*/
let products = [];
// Carrito de compras almacenado en localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cardName = ""; // Variable para almacenar el nombre de la tarjeta
let customerName = ""; // Variable para almacenar el nombre del cliente
let indicador =0;
// Función para cargar los productos desde un archivo JSON
/*async function loadProducts() {
    try {
        const response = await fetch('products.json'); // Ruta al archivo JSON
        if (!response.ok) {
            Swal.fire('Error','No se pudo cargar el archivo JSON'+response.status);
        }
        products = await response.json(); // Asignar datos JSON a la variable products
        displayProducts(); // Llamar a la función que muestra los productos
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}*/
// Función para cargar productos desde JSON
function loadProducts() {
    //fetch('products.json') // Asegúrate de la ruta correcta al archivo JSON
    fetch('http://localhost:3000/api/products') 
        .then(response => {
            if (!response.ok) {
                Swal.fire('Error','No se pudo cargar el archivo JSON'+response.status);
            }
            
            return response.json();
        })
        .then(data => {
            products=data;
            
            displayProducts(data); // Pasamos los productos cargados a la función de visualización
        })
        .catch(error => {
            Swal.fire('Error','Hubo un problema con la carga de productos:'+error);
        });
}

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIndicator();
}
// Función para mostrar el indicador del carrito
function updateCartIndicator() {
    if (cart.length > 0) {
        $("#cart-indicator").show();
    } else {
        $("#cart-indicator").hide();
    }
}

// Función para mostrar los productos en la tienda
/*function displayProducts() {
    const content = $("#content");
    content.empty();
    content.append('<h1 class="text-center">Productos</h1><div class="row" id="products"></div>');

    const productContainer = $("#products");
    products.forEach(product => {
        productContainer.append(`
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Precio: $${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Agregar al Carrito</button>
                    </div>
                </div>
                <br/>
            </div>
            
        `);
    });
}*/

// Función para mostrar los productos en la tienda
function displayProducts(products) {
    const content = document.getElementById('content');
    content.innerHTML = '<h1 class="text-center">Productos</h1><div class="row" id="products"></div>';
    const productContainer = document.getElementById('products');

    products.forEach(product => {
        indicador = product.id;
        const productCard = `
            <div class="col-md-4">
                <div class="cardProducto">
                    <div class="cardProducto-body">
                        <h5 class="cardProducto-title">${product.name}</h5>
                        <p class="cardProducto-text">Precio: $${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Agregar al Carrito</button>
                        <button class="btn btn-info" onclick="showProductDetails(${product.id})">Detalles</button>
                    </div>
                </div>
            </div>
        `;
        productContainer.insertAdjacentHTML('beforeend', productCard);
    });
}

// Función para mostrar el modal con los detalles del producto
function showProductDetails(productId) {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const modalBody = document.getElementById('modalBody');
                modalBody.innerHTML = `
                    <h5>${product.name}</h5>
                    <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
                    <p><strong>Descripción:</strong> ${product.description || 'No disponible'}</p>
                    <p><strong>Categoría:</strong> ${product.category || 'General'}</p>
                `;

                // Mostrar el modal
                const productModal = new bootstrap.Modal(document.getElementById('productModal'));
                productModal.show();
            }
        })
        .catch(error => console.error('Error al cargar detalles del producto:', error));
}

// Inicializar la carga de productos
document.addEventListener('DOMContentLoaded', loadProducts);

// Función para agregar productos al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    console.log(product);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    Swal.fire('Producto agregado', `${product.name} ha sido agregado al carrito`, 'success');
}

// Función para mostrar el carrito de compras
function displayCart() {
    const content = $("#content");
    content.empty();

    if (cart.length === 0) {
        content.append('<h1 class="text-center">Carrito de Compras vacío</h1>');
        return;
    }

    content.append('<h1 class="text-center">Carrito de Compras</h1>');

        // Agregar campo para el nombre del cliente
        content.append(`
            <div class="form-group">
                <label for="customer-name">Nombre del Cliente:</label>
                <input type="text" id="customer-name" class="form-control" placeholder="Ingresa tu nombre" oninput="customerName = this.value">
            </div>
        `);

    const cartTable = `
        <div class="table-responsive">
            <table class="table table-bordered" id="cart-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <h4>Total: $<span id="total-price">0.00</span></h4>
        <button class="btn btn-success" onclick="generatePDF()">Imprimir Factura</button>
        <button class="btn btn-success" onclick="simulatePayment()">Pagar</button>
    `;

    content.append(cartTable);

    const cartTableBody = $("#cart-table tbody");
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        cartTableBody.append(`
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" min="1" class="form-control" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Eliminar</button>
                </td>
            </tr>
        `);
    });

    $("#total-price").text(total.toFixed(2));
}

// Función para actualizar la cantidad de productos
function updateQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = parseInt(quantity);
        saveCart();
        displayCart();
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
    Swal.fire('Producto eliminado', 'El producto ha sido eliminado del carrito', 'info');
}

// Función para generar un PDF del contenido del carrito
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Generar la fecha y hora actual en el formato especificado
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Asegurar que el mes tenga dos dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Asegurar que el día tenga dos dígitos
    const hours = String(now.getHours()).padStart(2, '0'); // Asegurar que la hora tenga dos dígitos
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Asegurar que los minutos tengan dos dígitos
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Asegurar que los segundos tengan dos dígitos
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Asegurar que los milisegundos tengan tres dígitos

    const invoiceNumber = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 255); // Color azul
    doc.setFont("helvetica", "bold"); // Establecer fuente en negrita
    doc.text("Factura de Compra", 105, 20, null, null, 'center'); // Centrado horizontalmente
    doc.setTextColor(0, 0, 0); // Color negro
    doc.setFont("helvetica", "normal"); // Establecer fuente normal
    doc.setFontSize(12);

    // Agregar el número de factura
    doc.text(`Factura Número: ${invoiceNumber}`, 105, 30, null, null, 'center'); // Centrado horizontalmente
// Verificar el nombre del cliente y asignar "Contado" si está vacío
    const customerNameDisplay = customerName.trim() === "" ? "Contado" : customerName;

    doc.text(`Nombre del Cliente: ${customerNameDisplay}`, 14, 40); // Posición vertical después del número de factura

    let y = 45; // posición vertical inicial
    let total = 0;

    // Definir el ancho de la tabla y la altura de las filas
    const tableWidth = 180;
    const rowHeight = 10;

    // Cabecera de la tabla
    doc.setFillColor(0, 123, 255); // Color azul
    doc.rect(14, y, tableWidth, rowHeight, 'F'); // Fondo de la cabecera
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.text("Producto", 15, y + 7);
    doc.text("Precio", 80, y + 7);
    doc.text("Cantidad", 120, y + 7);
    doc.text("Subtotal", 150, y + 7);
    doc.setTextColor(0, 0, 0); // Restablecer el color del texto a negro
    y += rowHeight;

    // Detalles de los productos
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        doc.rect(14, y, tableWidth, rowHeight); // Bordes de la fila
        doc.text(item.name, 15, y + 7);
        doc.text(`$${item.price.toFixed(2)}`, 80, y + 7);
        doc.text(item.quantity.toString(), 120, y + 7);
        doc.text(`$${subtotal.toFixed(2)}`, 150, y + 7);
        y += rowHeight; // Incremento para la siguiente línea
        total += subtotal;
    });

    // Total
    doc.setFillColor(211, 211, 211); // Color gris
    doc.rect(14, y, tableWidth, rowHeight, 'F'); // Fondo del total
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text("Total:", 15, y + 7);
    doc.text(`$${total.toFixed(2)}`, 150, y + 7);
    
    // Agregar número de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i); // Establecer la página actual
        doc.text(`Página ${i} de ${pageCount}`, 190, 285, null, null, 'right'); // Añadir número de página
    }


    doc.save('factura_compra.pdf');
}

// Función para simular el pago
function simulatePayment() {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // Convertir a formato de fecha

    Swal.fire({
        title: 'Pagar',
        html: `
            <input id="card-number" type="text" class="swal2-input" placeholder="Número de tarjeta" maxlength="16" oninput="this.value=this.value.replace(/[^0-9]/g,'')">
            <input id="expiry-date" type="date" class="swal2-input" placeholder="Fecha de Vencimiento" min="${todayString}">
            <input id="card-name" type="text" class="swal2-input" placeholder="Nombre en la tarjeta">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cardName = document.getElementById('card-name').value;

            const selectedDate = new Date(expiryDate);
            const cardNumberLength = cardNumber.length;

            if (!cardNumber || !expiryDate || !cardName) {
                Swal.showValidationMessage('Por favor completa todos los campos');
                return false;
            }

            if (cardNumberLength < 13 || cardNumberLength > 16) {
                Swal.showValidationMessage('El número de tarjeta debe tener entre 13 y 16 dígitos');
                return false;
            }

            if (selectedDate < today) {
                Swal.showValidationMessage('La fecha de vencimiento no puede ser anterior al día actual');
                return false;
            }

            return { cardNumber, expiryDate, cardName };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Simular el pago
            Swal.fire('¡Pago realizado!', 'Gracias por tu compra', 'success');
            cart = [];
            saveCart();
            displayProducts(products);
        }
    });
}

// Función para mostrar los productos en forma de tabla editable
function displayProductTable() {
    const content = document.getElementById('content');
    content.innerHTML = '<h1 class="text-center">Productos</h1><div class="table-responsive"><table class="table table-bordered" id="product-table"><thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr></thead><tbody></tbody></table></div>';
    const productTableBody = document.querySelector('#product-table tbody');
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><input type="text" class="form-control" value="${product.name}" data-id="${product.id}" /></td>
            <td><input type="number" class="form-control" value="${product.price.toFixed(2)}" data-id="${product.id}" /></td>
            <td>
                <button class="btn btn-danger" onclick="removeProduct(${product.id})">Eliminar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
    
    // Agregar opción para añadir un nuevo producto
    const newProductRow = document.createElement('tr');
    newProductRow.innerHTML = `
        <td>Nueva</td>
        <td><input type="text" class="form-control" placeholder="Nombre del producto" id="new-product-name" /></td>
        <td><input type="number" class="form-control" placeholder="Precio" id="new-product-price" /></td>
        <td>
            <button class="btn btn-primary" onclick="addProduct()">Agregar</button>
        </td>
    `;
    productTableBody.appendChild(newProductRow);
}

// Función para agregar un nuevo producto
function addProduct() {
    const name = document.getElementById('new-product-name').value;
    const price = parseFloat(document.getElementById('new-product-price').value);
    const description=document.getElementById('new-product-name').value;
    const category='Camisas';
    loadProducts();
    if (name && !isNaN(price)) {
        const newProduct = {
            id:parseInt(indicador) + 1,
            name: name,
            price: price,
            description: description,
            category:category
        };

        // Enviar el nuevo producto al backend
        fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => {
            if (!response.ok) {
                Swal.fire('Error', 'Error al agregar el producto');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); // Mensaje de éxito
            loadProducts(); // Recargar productos para mostrar el nuevo
            document.getElementById('new-product-name').value = '';
            document.getElementById('new-product-price').value = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        Swal.fire('Error', 'Por favor completa todos los campos correctamente.', 'error');
    }
}

// Función para guardar los cambios de un producto
function saveProduct(productId) {
    const row = document.querySelector(`input[data-id="${productId}"]`);
    const name = row.parentElement.querySelector('input[type="text"]').value;
    const price = parseFloat(row.parentElement.querySelector('input[type="number"]').value); // Asegúrate de seleccionar correctamente el input de precio

    if (name && !isNaN(price)) {
        // Envía la solicitud PUT al servidor para guardar los cambios
        fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price }) // Envía el nombre y el precio en el cuerpo de la solicitud
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar el producto en el servidor.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); // Mostrar mensaje de éxito
            // Actualizar la lista de productos localmente
            const product = products.find(p => p.id === productId);
            product.name = name;
            product.price = price;
            Swal.fire('Producto guardado', `${product.name} ha sido actualizado.`, 'success');
        })
        .catch(error => {
            console.error('Error al guardar el producto:', error);
            Swal.fire('Error', 'No se pudo guardar el producto.', 'error');
        });
    } else {
        Swal.fire('Error', 'Por favor completa todos los campos correctamente.', 'error');
    }
}


// Función para eliminar un producto
function removeProduct(productId) {
    // Enviar la solicitud al servidor para eliminar el producto del archivo JSON
    fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            Swal.fire('Error', 'Error al eliminar el producto en el servidor.', 'error');
            return; // Detener la ejecución si hay un error
        }
        return response.json();
    })
    .then(data => {
        // console.log(data.message); // Mostrar mensaje de éxito
        // Ahora actualiza localmente la lista de productos
        products = products.filter(p => p.id !== productId);
        console.table(products);
        displayProductTable(); // Volver a mostrar la tabla
        Swal.fire('Producto eliminado', 'El producto ha sido eliminado.', 'info');
    })
    .catch(error => {
        console.error('Error al eliminar el producto:', error);
    });
}



// Función para guardar los productos en el archivo JSON
function saveProductsToFile() {
    fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(products)
    })
    .then(response => {
        if (!response.ok) {
            Swal.fire('Producto eliminado', 'Error al guardar los productos', 'info');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message); // Mostrar mensaje de éxito
    })
    .catch(error => {
        console.error('Error al guardar los productos:', error);
    });
}



// Eventos de carga inicial
$(document).ready(() => {
    loadProducts(); // Cargar productos desde JSON

    //displayProducts();

    $("#view-cart").on("click", function() {
        displayCart();
    });

    $("#view-products").on("click", function() {
        displayProductTable(); // Mostrar la tabla de productos al hacer clic
    });

    updateCartIndicator();
});
