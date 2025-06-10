// src/routes/index.js
const { Router } = require('express');
const { db } = require('../firebase.js');
const { Timestamp } = require('firebase-admin/firestore');

const router = Router();

// ===================================
// RUTAS PARA LA GESTIÓN DE PRODUCTOS
// ===================================

// Ruta para mostrar todos los productos en la página principal de administración
router.get('/', async (req, res) => {
    try {
        const querySnapshots = await db.collection('Producto').get();
        const Producto = querySnapshots.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.render('index', { Producto });
    } catch (error) {
        console.error('Error fetching products for index page:', error);
        res.status(500).send('Error fetching products');
    }
});

// Ruta para crear un nuevo producto
router.post('/new-product', async (req, res) => {
    try {
        // Se desestructuran los nuevos campos del cuerpo de la petición
        const { nombre, precio, stock, tipoDeProducto, fechaDeVencimiento, codigoDeBarras, marcaLaboratorio } = req.body;

        // Validación básica de los campos de entrada
        if (!nombre || !precio || stock === undefined || stock < 0 || !tipoDeProducto || !fechaDeVencimiento || !codigoDeBarras || !marcaLaboratorio) {
            return res.status(400).send('Faltan campos obligatorios o son inválidos.');
        }

        await db.collection('Producto').add({
            nombre: String(nombre),
            precio: parseFloat(precio),
            stock: parseInt(stock, 10),
            tipoDeProducto: String(tipoDeProducto), // Nuevos campos
            fechaDeVencimiento: String(fechaDeVencimiento), // Guardamos como string (formato YYYY-MM-DD)
            codigoDeBarras: String(codigoDeBarras),
            marcaLaboratorio: String(marcaLaboratorio)
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
});

// Ruta para obtener un producto específico para su edición
router.get('/edit-product/:id', async (req, res) => {
    try {
        const doc = await db.collection('Producto').doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).send('Product not found');
        }

        const producto = { id: doc.id, ...doc.data() };

        const querySnapshots = await db.collection('Producto').get();
        const Producto = querySnapshots.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render('index', { Producto, producto });
    } catch (error) {
        console.error('Error fetching product for edit:', error);
        res.status(500).send('Error fetching product');
    }
});

// Ruta para eliminar un producto
router.get('/delete-product/:id', async (req, res) => {
    try {
        await db.collection('Producto').doc(req.params.id).delete();
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
});

// Ruta para actualizar un producto existente
router.post('/update-product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Se desestructuran los nuevos campos del cuerpo de la petición
        const { nombre, precio, stock, tipoDeProducto, fechaDeVencimiento, codigoDeBarras, marcaLaboratorio } = req.body;

        // Validación de los campos de entrada
        if (!nombre || !precio || stock === undefined || stock < 0 || !tipoDeProducto || !fechaDeVencimiento || !codigoDeBarras || !marcaLaboratorio) {
            return res.status(400).send('Faltan campos obligatorios o son inválidos.');
        }

        const productRef = db.collection('Producto').doc(id);
        const doc = await productRef.get();

        if (!doc.exists) {
            return res.status(404).send('Producto no encontrado para actualizar.');
        }

        await productRef.update({
            nombre: String(nombre),
            precio: parseFloat(precio),
            stock: parseInt(stock, 10),
            tipoDeProducto: String(tipoDeProducto), // Nuevos campos
            fechaDeVencimiento: String(fechaDeVencimiento),
            codigoDeBarras: String(codigoDeBarras),
            marcaLaboratorio: String(marcaLaboratorio)
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
});

// ===================================
// RUTAS PARA LA GESTIÓN DE VENTAS
// ===================================

// Ruta para mostrar la página de realizar una nueva venta
router.get('/ventas', async (req, res) => {
    try {
        res.render('ventas');
    } catch (error) {
        console.error('Error rendering sales page:', error);
        res.status(500).send('Error loading sales page');
    }
});

// API para obtener todos los productos (utilizado por la página de ventas para poblar el carrito)
router.get('/api/productos', async (req, res) => {
    try {
        const querySnapshots = await db.collection('Producto').get();
        const productos = querySnapshots.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error fetching products for API:', error);
        res.status(500).json({ message: 'Error al obtener los productos.', error: error.message });
    }
});

// Ruta para procesar una nueva venta (deducir stock y registrar la venta)
router.post('/new-sale', async (req, res) => {
    console.log('Backend /new-sale: Recibida petición para procesar venta.');
    try {
        const { items } = req.body;
        console.log('Backend /new-sale: Items recibidos (raw):', req.body);
        console.log('Backend /new-sale: Items recibidos (parsed):', JSON.stringify(items, null, 2));

        if (!items || !Array.isArray(items) || items.length === 0) {
            console.warn('Backend /new-sale: Solicitud de venta inválida o vacía (no items en array).');
            return res.status(400).json({ message: 'Se requiere un array de productos (items) para procesar la venta.' });
        }

        const batch = db.batch();
        let totalVenta = 0;
        const productosVendidos = [];

        console.log('Backend /new-sale: Iniciando verificación y preparación de stock para cada item.');
        for (const item of items) {
            if (!item.productId || !item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                console.warn('Backend /new-sale: Datos de item inválidos (productId, quantity):', item);
                return res.status(400).json({ message: `Datos inválidos para el producto: ${JSON.stringify(item)}. Se requiere productId y una cantidad positiva.` });
            }

            const productRef = db.collection('Producto').doc(item.productId);
            let productDoc;
            try {
                productDoc = await productRef.get();
            } catch (firestoreError) {
                console.error(`Backend /new-sale: Error al obtener el documento del producto ${item.productId}:`, firestoreError);
                return res.status(500).json({ message: `Error interno al buscar el producto ${item.productId}.` });
            }

            if (!productDoc.exists) {
                console.warn('Backend /new-sale: Producto NO encontrado con ID:', item.productId);
                return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado.` });
            }

            const productData = productDoc.data();
            const currentStock = productData.stock || 0;
            console.log(`Backend /new-sale: Producto '${productData.nombre}' (ID: ${item.productId}), Stock actual: ${currentStock}, Solicitado: ${item.quantity}`);

            if (currentStock < item.quantity) {
                console.warn(`Backend /new-sale: Stock insuficiente para producto '${productData.nombre}'.`);
                return res.status(400).json({ message: `Stock insuficiente para el producto '${productData.nombre}'. Disponible: ${currentStock}, Solicitado: ${item.quantity}` });
            }

            batch.update(productRef, { stock: currentStock - item.quantity });
            console.log(`Backend /new-sale: Batch: Se añadió actualización de stock para ${productData.nombre}. Nuevo stock esperado: ${currentStock - item.quantity}`);

            totalVenta += (productData.precio || 0) * item.quantity;

            // Almacenar también los nuevos campos del producto en el registro de la venta
            productosVendidos.push({
                productId: item.productId,
                nombre: productData.nombre,
                precioUnitario: productData.precio || 0,
                cantidad: item.quantity,
                subtotal: (productData.precio || 0) * item.quantity,
                tipoDeProducto: productData.tipoDeProducto || 'N/A', // Captura el nuevo campo
                fechaDeVencimiento: productData.fechaDeVencimiento || 'N/A', // Captura el nuevo campo
                codigoDeBarras: productData.codigoDeBarras || 'N/A', // Captura el nuevo campo
                marcaLaboratorio: productData.marcaLaboratorio || 'N/A' // Captura el nuevo campo
            });
        }

        console.log('Backend /new-sale: Todos los items verificados. Total de venta calculada:', totalVenta);
        console.log('Backend /new-sale: Detalles de productos a registrar en Venta:', productosVendidos);

        const ventaRef = db.collection('Ventas').doc();
        const ventaData = {
            fecha: new Date(),
            productos: productosVendidos,
            total: totalVenta,
        };
        batch.set(ventaRef, ventaData);
        console.log('Backend /new-sale: Documento de venta preparado en batch para ID:', ventaRef.id);

        console.log('Backend /new-sale: Intentando ejecutar batch.commit() para guardar todas las operaciones en Firestore...');
        await batch.commit();
        console.log('Backend /new-sale: ¡Batch.commit() exitoso! Venta guardada con ID:', ventaRef.id);

        res.status(200).json({
            message: 'Venta procesada exitosamente',
            ventaId: ventaRef.id,
            total: totalVenta,
            productos: productosVendidos
        });

    } catch (error) {
        console.error('Backend /new-sale: !!! ERROR CATASTRÓFICO (NO MANEJADO) al procesar la venta:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar la venta.', error: error.message, details: error.message });
    }
});

// ===================================
// RUTAS PARA EL HISTORIAL DE VENTAS
// ===================================

// Ruta para mostrar la página del historial de ventas
router.get('/historial-ventas', async (req, res) => {
    try {
        res.render('historial-ventas');
    } catch (error) {
        console.error('Error rendering sales history page:', error);
        res.status(500).send('Error loading sales history page');
    }
});

// API para obtener TODAS las ventas (sin filtrar por fecha)
router.get('/api/ventas', async (req, res) => {
    console.log('Backend /api/ventas: Recibida petición para obtener ventas (historial completo).');
    try {
        let salesQuery = db.collection('Ventas').orderBy('fecha', 'desc');

        const querySnapshots = await salesQuery.get();
        const ventas = querySnapshots.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                fecha: data.fecha ? data.fecha.toDate().toLocaleString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'Fecha no disponible'
            };
        });
        console.log(`Backend /api/ventas: Se encontraron ${ventas.length} ventas y se enviaron al frontend.`);
        res.status(200).json(ventas);
    } catch (error) {
        console.error('Backend /api/ventas: Error al obtener las ventas del historial:', error);
        res.status(500).json({ message: 'Error al obtener el historial de ventas.', error: error.message });
    }
});

module.exports = router;
