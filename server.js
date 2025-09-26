// server.js
// Main backend file for the Mini Commerce Demo

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const products = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Keyboard', price: 75 },
    { id: 3, name: 'Mouse', price: 25 }
];
const orders = [];
let productIdCounter = products.length + 1;
let orderIdCounter = 1;


// --- Middleware ---

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// --- Middleware ---

const checkAdmin = (req, res, next) => {
    if (req.query.role === 'admin' || (req.body.role === 'admin')) {
        next();
    } else {
        res.status(403).send('Forbidden: Admins only');
    }
};


// --- Frontend Routes ---

app.get('/', (req, res) => {
    res.render('client', { products });
});

// Admin Page: Add products and view orders
app.get('/admin', checkAdmin, (req, res) => {
    res.render('admin', { orders });
});


// --- API Endpoints ---

// GET /products - Client views all available products
app.get('/products', (req, res) => {
    res.json(products);
});

// POST /products - Admin adds a new product
app.post('/products', (req, res, next) => {
    req.query.role = 'admin'; 
    next();
}, checkAdmin, (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).send('Product name and price are required.');
    }
    const newProduct = {
        id: productIdCounter++,
        name,
        price: parseFloat(price)
    };
    products.push(newProduct);
    console.log('New Product Added:', newProduct);
    res.redirect('/admin?role=admin');
});


// POST /orders - Client places an order
app.post('/orders', (req, res) => {
    const { productId, clientInfo } = req.body;
    if (!productId) {
        return res.status(400).send('Product ID is required.');
    }

    const product = products.find(p => p.id == productId);
    if (!product) {
        return res.status(404).send('Product not found.');
    }

    const newOrder = {
        orderId: orderIdCounter++,
        productId: parseInt(productId),
        productName: product.name,
        clientInfo: clientInfo || 'Client-' + Math.floor(Math.random() * 1000),
        orderDate: new Date().toISOString()
    };
    orders.push(newOrder);
    console.log('New Order Placed:', newOrder);
    res.send('<h1>Order placed successfully!</h1><a href="/">Back to products</a>');
});

app.get('/orders', checkAdmin, (req, res) => {
    res.json(orders);
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Access Client View: http://localhost:3000');
    console.log('Access Admin View: http://localhost:3000/admin?role=admin');
});
