# RequitDesign - Login & Admin System

Ein vollständiges Authentifizierungs- und Admin-Verwaltungssystem für deine E-Commerce-Website.

## Features

✅ **Benutzerauuthentifikation**
- Registrierung neuer Benutzer
- Login-System mit Session-Management
- Passwort-Hashing mit bcryptjs

✅ **Admin-Dashboard**
- Produkte verwalten (hinzufügen, bearbeiten, löschen)
- Produkte als "ausverkauft" markieren
- Bestellverlauf anschauen
- Bestellungsstatus aktualisieren
- Benutzer-Verwaltung
- Umsatz & Statistiken

✅ **Datenbank**
- SQLite für Benutzer, Produkte, Bestellungen
- Automatische Initialisierung mit Demo-Daten
- Admin-Account vorinstalliert

## Installation

```bash
# In das Projektverzeichnis gehen
cd /workspaces/requitdesign_test

# Dependencies installieren
npm install
```

## Starten des Servers

```bash
npm start
```

Server läuft dann unter: **http://localhost:3000**

## Login-Daten

**Admin-Account:**
- Email: `admin@requitdesign.de`
- Passwort: `Admin123!`

## Neue Benutzer

Benutzer können sich unter `/register.html` selbst registrieren.

## Dateistruktur

```
/workspaces/requitdesign_test/
├── server.js              # Haupt-Express Server
├── package.json           # Abhängigkeiten
├── .env                   # Umgebungsvariablen
├── .gitignore            # Git-Ignorieren
│
├── config/
│   └── database.js       # SQLite Konfiguration & Initialisierung
│
├── routes/
│   ├── auth.js           # Login/Register Routes
│   ├── admin.js          # Admin-API Routes
│   └── cart.js           # Warenkorb/Checkout Routes
│
├── public/
│   ├── index.html        # Startseite (mit Login-Link)
│   ├── products.html     # Produktseite
│   ├── login.html        # Login-Formular
│   ├── register.html     # Registrierungs-Formular
│   └── admin.html        # Admin-Dashboard
│
└── data/
    └── requitdesign.db   # SQLite Datenbankdatei (wird erstellt)
```

## API Endpoints

### Authentifizierung (`/api/auth/`)
- `POST /login` - Benutzer anmelden
- `POST /register` - Neuen Account erstellen
- `POST /logout` - Abmelden
- `GET /me` - Aktuelle Benutzerinformationen

### Admin (`/api/admin/`)
- `GET /stats` - Statistiken (Benutzer, Bestellungen, Umsatz)
- `GET /products` - Alle Produkte
- `POST /products` - Neues Produkt
- `PUT /products/:id` - Produkt bearbeiten
- `DELETE /products/:id` - Produkt löschen
- `GET /orders` - Alle Bestellungen
- `PUT /orders/:id/status` - Bestellungsstatus ändern
- `GET /users` - Alle Benutzer

### Warenkorb (`/api/cart/`)
- `GET /` - Warenkorb abrufen
- `POST /add` - Produkt hinzufügen
- `DELETE /:id` - Produkt entfernen
- `POST /checkout` - Bestellung erstellen

## Navigation zur Admin-Seite

1. Gehe zu http://localhost:3000/login.html
2. Melde dich mit `admin@requitdesign.de` / `Admin123!` an
3. Du wirst automatisch zum Admin-Dashboard weitergeleitet
4. Oder gehe direkt zu http://localhost:3000/admin.html

## Seiten für Benutzer

- `/` - Startseite
- `/products` - Produktübersicht
- `/login.html` - Login
- `/register.html` - Registrierung
- `/cart` - Warenkorb

## Datenbank-Schema

### Users
- id, email (unique), password (gehashed), name, role ('admin'/'customer'), created_at

### Products
- id, name, description, price, stock, sold_out, category, created_at

### Orders
- id, user_id, total_price, status, shipping_address, payment_method, created_at

### Order Items
- id, order_id, product_id, quantity, price

### Cart Items
- id, user_id, product_id, quantity

## Sicherheit in Produktion

Vor dem Live-Gang solltest du ändern:
- `.env` SESSION_SECRET (sichere Token)
- Datenbank zu PostgreSQL/MySQL
- HTTPS aktivieren
- Email-Verifikation hinzufügen
- Passwort-Reset implementieren

## Troubleshooting

**Port 3000 bereits in Benutzung?**
```bash
# Anderen Port verwenden
PORT=8000 npm start
```

**Datenbank-Probleme?**
```bash
# Datenbankdatei löschen und neu erstellen
rm data/requitdesign.db
npm start
```

## Support

Bei Fragen schau dir die Dateiprotokollierung in der Konsole an!
