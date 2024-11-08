const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

app.use(cors());
app.use(bodyParser.json());

// Leer productos desde el archivo JSON
app.get('/api/products', (req, res) => {
    fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo de productos:", err);
            return res.status(500).json({ error: 'Error al leer el archivo de productos' });
        }
        res.json(JSON.parse(data));
    });
});

// Contar el número de productos en el archivo JSON
app.get('/api/products/count', (req, res) => {
    fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de productos' });
        }

        // Parsear los datos JSON
        let products = [];
        if (data) {
            products = JSON.parse(data);
        }

        // Devolver la cantidad de productos
        res.json({ count: products.length });
    });
});

// Guardar productos en el archivo JSON
app.post('/api/products', (req, res) => {
    const newProduct = req.body; // Recibe el producto nuevo o modificado

    // Leer productos actuales
    fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo de productos:", err);
            return res.status(500).json({ error: 'Error al leer el archivo de productos' });
        }
        
        let products = [];
        // Si el archivo no está vacío, parsea el contenido JSON
        if (data) {
            products = JSON.parse(data);
        }

        // Agregar el nuevo producto a la lista
        products.push(newProduct);

        // Escribir el nuevo arreglo de productos en el archivo JSON
        fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error("Error al guardar el archivo de productos:", err);
                return res.status(500).json({ error: 'Error al guardar el archivo de productos' });
            }
            res.json({ message: 'Producto guardado correctamente' });
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const filePath = path.join(__dirname, 'products.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer el archivo.' });
        }

        let products = JSON.parse(data);
        products = products.filter(p => p.id !== productId);

        fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al escribir en el archivo.' });
            }

            res.json({ message: 'Producto eliminado correctamente' });
        });
    });
});

app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { name, price } = req.body; // Asegúrate de que el cliente envíe los datos en el cuerpo de la solicitud.

    const filePath = path.join(__dirname, 'products.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ message: 'Error al leer el archivo.' });
        }

        let products;
        try {
            products = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error al parsear JSON:', parseErr);
            return res.status(500).json({ message: 'Error al procesar los datos.' });
        }

        const product = products.find(p => p.id === productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualizar el producto
        product.name = name;
        product.price = price;

        // Guardar los cambios en el archivo
        fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                return res.status(500).json({ message: 'Error al escribir en el archivo.' });
            }

            res.json({ message: 'Producto actualizado correctamente' });
        });
    });
});

