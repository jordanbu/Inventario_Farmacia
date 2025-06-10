const { Router } = require('express');
const { db } = require('../firebase.js');

const router = Router();

// Mostrar todos los productos
router.get('/', async (req, res) => {
    try {
        const querySnapshots = await db.collection('Producto').get();
        const Producto = querySnapshots.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render('index', { Producto });
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

        res.redirect('/');
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

        const querySnapshots = await db.collection('Producto').get();
        const Producto = querySnapshots.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render('index', { Producto, producto });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Error fetching product');
    }
});

// Eliminar producto (usando GET)
router.get('/delete-product/:id', async (req, res) => {
    try {
        await db.collection('Producto').doc(req.params.id).delete();
        res.redirect('/');
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

        res.redirect('/');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
});

module.exports = router;
