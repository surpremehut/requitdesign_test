const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcryptjs = require('bcryptjs');

const dbPath = path.join(__dirname, '../data/requitdesign.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Datenbankfehler:', err);
  else console.log('Mit SQLite verbunden');
});

const initialize = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Benutzer Tabelle
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT DEFAULT 'customer',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Produkte Tabelle
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          image TEXT,
          stock INTEGER DEFAULT 0,
          sold_out BOOLEAN DEFAULT 0,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Bestellungen Tabelle
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          total_price REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          shipping_address TEXT,
          payment_method TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Bestellelemente Tabelle
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL,
          FOREIGN KEY(order_id) REFERENCES orders(id),
          FOREIGN KEY(product_id) REFERENCES products(id)
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Warenkorb Tabelle
      db.run(`
        CREATE TABLE IF NOT EXISTS cart_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          FOREIGN KEY(user_id) REFERENCES users(id),
          FOREIGN KEY(product_id) REFERENCES products(id)
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Admin und Demo-Produkte einfügen
      db.all("SELECT * FROM users WHERE email = 'admin@requitdesign.de'", (err, rows) => {
        if (err) reject(err);
        
        if (!rows || rows.length === 0) {
          // Admin erstellen
          const hashedPassword = bcryptjs.hashSync('Admin123!', 10);
          db.run(
            `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
            ['admin@requitdesign.de', hashedPassword, 'Admin', 'admin'],
            (err) => {
              if (err) console.error('Admin-Fehler:', err);
              else console.log('Admin-Account erstellt: admin@requitdesign.de / Admin123!');
            }
          );
        }
      });

      // Demo-Produkte
      db.all("SELECT COUNT(*) as count FROM products", (err, rows) => {
        if (err) reject(err);
        
        if (rows && rows[0].count === 0) {
          const products = [
            {
              name: 'AirPods Pro Case - Classic Gold',
              description: 'Elegante Schutzhülle mit luxuriösem Goldfinish',
              price: 29.99,
              stock: 50,
              category: 'AirPods Pro'
            },
            {
              name: 'AirPods Gen 4 Case - Rose Pink',
              description: 'Stilvolle rosa Schutzhülle für AirPods Generation 4',
              price: 24.99,
              stock: 30,
              category: 'AirPods Gen 4'
            },
            {
              name: 'AirPods Pro Case - Midnight Black',
              description: 'Klassische schwarze Schutzhülle mit Premium-Material',
              price: 29.99,
              stock: 0,
              category: 'AirPods Pro',
              sold_out: 1
            }
          ];

          products.forEach(product => {
            db.run(
              `INSERT INTO products (name, description, price, stock, category, sold_out) 
               VALUES (?, ?, ?, ?, ?, ?)`,
              [product.name, product.description, product.price, product.stock, product.category, product.sold_out]
            );
          });
          console.log('Demo-Produkte erstellt');
        }
        resolve();
      });
    });
  });
};

module.exports = {
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  
  initialize
};
