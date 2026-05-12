const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Öffentliche Produktliste
router.get('/', async (req, res) => {
  try {
    const { model, category, name } = req.query;
    let sql = 'SELECT * FROM products';
    const filters = [];
    const params = [];

    if (model) {
      filters.push('category = ?');
      params.push(model);
    }

    if (category) {
      filters.push('category = ?');
      params.push(category);
    }

    if (name) {
      filters.push('name LIKE ?');
      params.push(`%${name}%`);
    }

    if (filters.length > 0) {
      sql += ' WHERE ' + filters.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    const products = await db.all(sql, params);
    res.json(products);
  } catch (error) {
    console.error('Fehler beim Abrufen öffentlicher Produkte:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Produktdetails nach ID
router.get('/:id', async (req, res) => {
  try {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ error: 'Produkt nicht gefunden' });
    }
    res.json(product);
  } catch (error) {
    console.error('Fehler beim Abrufen des Produkts:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

module.exports = router;
