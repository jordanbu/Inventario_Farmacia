// src/routes/index.js
const { Router } = require('express');
const { db } = require('../firebase.js'); // Importa la instancia de Firestore

const router = Router();

// Mostrar todos los productos
router.get('/', async (req, res) => {
    try {
        const querySnapshots = await db.collection('Producto').get();
        const Producto = querySnapshots.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render('index', { Producto }); // Renderiza la vista 'index.hbs'
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

// Crear nuevo producto
router.post('/new-product', async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;

        await db.collection('Producto').add({
            nombre,
            precio,
            stock
        });

        res.redirect('/'); // Redirecciona a la página principal después de crear
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
});

// Obtener producto para editar
router.get('/edit-product/:id', async (req, res) => {
    try {
        const doc = await db.collection('Producto').doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).send('Product not found');
        }

        const producto = { id: doc.id, ...doc.data() };

        // También obtén todos los productos para mostrar la lista junto al formulario de edición
        const querySnapshots = await db.collection('Producto').get();
        const Producto = querySnapshots.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render('index', { Producto, producto }); // Renderiza la vista 'index.hbs' con los datos para editar
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Error fetching product');
    }
});

// Eliminar producto (usando GET, aunque POST/DELETE sería más RESTful para eliminaciones)
router.get('/delete-product/:id', async (req, res) => {
    try {
        await db.collection('Producto').doc(req.params.id).delete();
        res.redirect('/'); // Redirecciona a la página principal después de eliminar
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product');
    }
});

// Actualizar producto
router.post('/update-product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock } = req.body;

        await db.collection('Producto').doc(id).update({
            nombre,
            precio,
            stock
        });

        res.redirect('/'); // Redirecciona a la página principal después de actualizar
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
});

module.exports = router;
