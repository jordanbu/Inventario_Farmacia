// backend/routes.js
const { Router } = require('express');
const { db } = require('./firebase.js');
const { Timestamp } = require('firebase-admin/firestore');

const router = Router();

// ===================================
// RUTAS PARA LA GESTIÓN DE PRODUCTOS
// ===================================

// API para obtener todos los productos
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

// API para obtener un producto específico
router.get('/api/productos/:id', async (req, res) => {
    try {
        const doc = await db.collection('Producto').doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const producto = { id: doc.id, ...doc.data() };
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// API para crear un nuevo producto
router.post('/api/productos', async (req, res) => {
    try {
        const { nombre, precio, stock, tipoDeProducto, fechaDeVencimiento, codigoDeBarras, marcaLaboratorio } = req.body;

        // Validación básica de los campos de entrada
        if (!nombre || !precio || stock === undefined || stock < 0 || !tipoDeProducto || !fechaDeVencimiento || !codigoDeBarras || !marcaLaboratorio) {
            return res.status(400).json({ message: 'Faltan campos obligatorios o son inválidos.' });
        }

        const docRef = await db.collection('Producto').add({
            nombre: String(nombre),
            precio: parseFloat(precio),
            stock: parseInt(stock, 10),
            tipoDeProducto: String(tipoDeProducto),
            fechaDeVencimiento: String(fechaDeVencimiento),
            codigoDeBarras: String(codigoDeBarras),
            marcaLaboratorio: String(marcaLaboratorio)
        });

        res.status(201).json({ message: 'Producto creado exitosamente', id: docRef.id });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// API para actualizar un producto existente
router.put('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock, tipoDeProducto, fechaDeVencimiento, codigoDeBarras, marcaLaboratorio } = req.body;

        // Validación de los campos de entrada
        if (!nombre || !precio || stock === undefined || stock < 0 || !tipoDeProducto || !fechaDeVencimiento || !codigoDeBarras || !marcaLaboratorio) {
            return res.status(400).json({ message: 'Faltan campos obligatorios o son inválidos.' });
        }

        const productRef = db.collection('Producto').doc(id);
        const doc = await productRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Producto no encontrado para actualizar.' });
        }

        await productRef.update({
            nombre: String(nombre),
            precio: parseFloat(precio),
            stock: parseInt(stock, 10),
            tipoDeProducto: String(tipoDeProducto),
            fechaDeVencimiento: String(fechaDeVencimiento),
            codigoDeBarras: String(codigoDeBarras),
            marcaLaboratorio: String(marcaLaboratorio)
        });

        res.status(200).json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// API para eliminar un producto
router.delete('/api/productos/:id', async (req, res) => {
    try {
        await db.collection('Producto').doc(req.params.id).delete();
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// ===================================
// RUTAS PARA LA GESTIÓN DE VENTAS
// ===================================

// API para procesar una nueva venta (deducir stock y registrar la venta)
router.post('/api/ventas', async (req, res) => {
    console.log('Backend /api/ventas: Recibida petición para procesar venta.');
    try {
        const { items } = req.body;
        console.log('Backend /api/ventas: Items recibidos (raw):', req.body);
        console.log('Backend /api/ventas: Items recibidos (parsed):', JSON.stringify(items, null, 2));

        if (!items || !Array.isArray(items) || items.length === 0) {
            console.warn('Backend /api/ventas: Solicitud de venta inválida o vacía (no items en array).');
            return res.status(400).json({ message: 'Se requiere un array de productos (items) para procesar la venta.' });
        }

        const batch = db.batch();
        let totalVenta = 0;
        const productosVendidos = [];

        console.log('Backend /api/ventas: Iniciando verificación y preparación de stock para cada item.');
        for (const item of items) {
            if (!item.productId || !item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                console.warn('Backend /api/ventas: Datos de item inválidos (productId, quantity):', item);
                return res.status(400).json({ message: `Datos inválidos para el producto: ${JSON.stringify(item)}. Se requiere productId y una cantidad positiva.` });
            }

            const productRef = db.collection('Producto').doc(item.productId);
            let productDoc;
            try {
                productDoc = await productRef.get();
            } catch (firestoreError) {
                console.error(`Backend /api/ventas: Error al obtener el documento del producto ${item.productId}:`, firestoreError);
                return res.status(500).json({ message: `Error interno al buscar el producto ${item.productId}.` });
            }

            if (!productDoc.exists) {
                console.warn('Backend /api/ventas: Producto NO encontrado con ID:', item.productId);
                return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado.` });
            }

            const productData = productDoc.data();
            const currentStock = productData.stock || 0;
            console.log(`Backend /api/ventas: Producto '${productData.nombre}' (ID: ${item.productId}), Stock actual: ${currentStock}, Solicitado: ${item.quantity}`);

            if (currentStock < item.quantity) {
                console.warn(`Backend /api/ventas: Stock insuficiente para producto '${productData.nombre}'.`);
                return res.status(400).json({ message: `Stock insuficiente para el producto '${productData.nombre}'. Disponible: ${currentStock}, Solicitado: ${item.quantity}` });
            }

            batch.update(productRef, { stock: currentStock - item.quantity });
            console.log(`Backend /api/ventas: Batch: Se añadió actualización de stock para ${productData.nombre}. Nuevo stock esperado: ${currentStock - item.quantity}`);

            totalVenta += (productData.precio || 0) * item.quantity;

            productosVendidos.push({
                productId: item.productId,
                nombre: productData.nombre,
                precioUnitario: productData.precio || 0,
                cantidad: item.quantity,
                subtotal: (productData.precio || 0) * item.quantity,
                tipoDeProducto: productData.tipoDeProducto || 'N/A',
                fechaDeVencimiento: productData.fechaDeVencimiento || 'N/A',
                codigoDeBarras: productData.codigoDeBarras || 'N/A',
                marcaLaboratorio: productData.marcaLaboratorio || 'N/A'
            });
        }

        console.log('Backend /api/ventas: Todos los items verificados. Total de venta calculada:', totalVenta);
        console.log('Backend /api/ventas: Detalles de productos a registrar en Venta:', productosVendidos);

        const ventaRef = db.collection('Ventas').doc();
        const ventaData = {
            fecha: new Date(),
            productos: productosVendidos,
            total: totalVenta,
        };
        batch.set(ventaRef, ventaData);
        console.log('Backend /api/ventas: Documento de venta preparado en batch para ID:', ventaRef.id);

        console.log('Backend /api/ventas: Intentando ejecutar batch.commit() para guardar todas las operaciones en Firestore...');
        await batch.commit();
        console.log('Backend /api/ventas: ¡Batch.commit() exitoso! Venta guardada con ID:', ventaRef.id);

        res.status(200).json({
            message: 'Venta procesada exitosamente',
            ventaId: ventaRef.id,
            total: totalVenta,
            productos: productosVendidos
        });

    } catch (error) {
        console.error('Backend /api/ventas: !!! ERROR CATASTRÓFICO (NO MANEJADO) al procesar la venta:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar la venta.', error: error.message, details: error.message });
    }
});

// API para obtener TODAS las ventas (historial completo)
router.get('/api/ventas', async (req, res) => {
    console.log('Backend /api/ventas GET: Recibida petición para obtener ventas (historial completo).');
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
        console.log(`Backend /api/ventas GET: Se encontraron ${ventas.length} ventas y se enviaron al frontend.`);
        res.status(200).json(ventas);
    } catch (error) {
        console.error('Backend /api/ventas GET: Error al obtener las ventas del historial:', error);
        res.status(500).json({ message: 'Error al obtener el historial de ventas.', error: error.message });
    }
});

module.exports = router;
