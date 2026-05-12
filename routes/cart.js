const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Middleware: Authentifizierung
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentifizierung erforderlich' });
  }
  next();
};

// Warenkorb abrufen
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const items = await db.all(`
      SELECT ci.id, ci.quantity, p.* 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [req.session.user.id]);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Produkt in Warenkorb hinzufügen
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Produkt-ID und Menge erforderlich' });
    }

    const existing = await db.get(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.session.user.id, productId]
    );

    if (existing) {
      await db.run(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing.id]
      );
    } else {
      await db.run(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.session.user.id, productId, quantity]
      );
    }

    res.json({ success: true, message: 'Zu Warenkorb hinzugefügt' });
  } catch (error) {
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Warenkorb-Element entfernen
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    await db.run('DELETE FROM cart_items WHERE id = ? AND user_id = ?', 
      [req.params.id, req.session.user.id]);
    res.json({ success: true, message: 'Aus Warenkorb entfernt' });
  } catch (error) {
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Bestellung erstellen
router.post('/checkout', isAuthenticated, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const cartItems = await db.all(`
      SELECT ci.*, p.price 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [req.session.user.id]);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Warenkorb ist leer' });
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Bestellung erstellen
    const orderResult = await db.run(
      `INSERT INTO orders (user_id, total_price, shipping_address, payment_method, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.session.user.id, totalPrice, shippingAddress, paymentMethod, 'pending']
    );

    // Bestellpositionen hinzufügen
    for (const item of cartItems) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderResult.id, item.product_id, item.quantity, item.price]
      );
    }

    // Warenkorb leeren
    await db.run('DELETE FROM cart_items WHERE user_id = ?', [req.session.user.id]);

    res.json({ 
      success: true, 
      message: 'Bestellung erfolgreich erstellt',
      orderId: orderResult.id,
      total: totalPrice
    });
  } catch (error) {
    console.error('Checkout Fehler:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

module.exports = router;
