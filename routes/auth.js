const express = require('express');
const bcryptjs = require('bcryptjs');
const db = require('../config/database');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email und Passwort erforderlich' });
    }

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    res.json({ 
      success: true, 
      message: 'Erfolgreich angemeldet',
      user: req.session.user 
    });
  } catch (error) {
    console.error('Login Fehler:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, confirmPassword, name } = req.body;

    if (!email || !password || !confirmPassword || !name) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwörter stimmen nicht überein' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein' });
    }

    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email-Adresse wird bereits verwendet' });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    const result = await db.run(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, 'customer']
    );

    req.session.user = {
      id: result.id,
      email: email,
      name: name,
      role: 'customer'
    };

    res.json({ 
      success: true, 
      message: 'Account erfolgreich erstellt',
      user: req.session.user
    });
  } catch (error) {
    console.error('Register Fehler:', error);
    res.status(500).json({ error: 'Server-Fehler' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout fehlgeschlagen' });
    }
    res.json({ success: true, message: 'Erfolgreich abgemeldet' });
  });
});

// Benutzer-Status
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Nicht angemeldet' });
  }
  res.json({ user: req.session.user });
});

module.exports = router;
