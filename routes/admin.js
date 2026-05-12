const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Middleware: Admin-Check
const isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Nur Admin-Zugriff' });
  }
  next();
};

// Produkte abrufen
router.get('/products', isAdmin, async (req, res) => {
  try {
    const products = await db.all('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    console.error('Fehler beim Abrufen der Produkte:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Produkt hinzufügen
router.post('/products', isAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, category, color, sold_out } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name und Preis erforderlich' });
    }

    const result = await db.run(
      `INSERT INTO products (name, description, price, stock, category, color, sold_out) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description || '', price, stock || 0, category || '', color || '', sold_out ? 1 : 0]
    );

    res.json({ 
      success: true, 
      id: result.id,
      message: 'Produkt hinzugefügt'
    });
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Produkts:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Produkt bearbeiten
router.put('/products/:id', isAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, sold_out, category, color } = req.body;
    const productId = req.params.id;

    await db.run(
      `UPDATE products SET name = ?, description = ?, price = ?, stock = ?, sold_out = ?, category = ?, color = ? 
       WHERE id = ?`,
      [name, description, price, stock, sold_out ? 1 : 0, category, color || '', productId]
    );

    res.json({ success: true, message: 'Produkt aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Produkts:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Produkt löschen
router.delete('/products/:id', isAdmin, async (req, res) => {
  try {
    await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Produkt gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Produkts:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Bestellungen abrufen
router.get('/orders', isAdmin, async (req, res) => {
  try {
    const orders = await db.all(`
      SELECT o.*, u.email, u.name,
             GROUP_CONCAT(p.name || ' x' || oi.quantity) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellungen:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Bestellungsstatus aktualisieren
router.put('/orders/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Bestellungsstatus aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Bestellung:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Statistiken
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const stats = {
      totalUsers: await db.get('SELECT COUNT(*) as count FROM users'),
      totalOrders: await db.get('SELECT COUNT(*) as count FROM orders'),
      totalRevenue: await db.get('SELECT SUM(total_price) as total FROM orders'),
      productsCount: await db.get('SELECT COUNT(*) as count FROM products'),
      solvedOrders: await db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'")
    };
    res.json(stats);
  } catch (error) {
    console.error('Fehler bei Statistiken:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Benutzer abrufen
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await db.all('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

module.exports = router;
