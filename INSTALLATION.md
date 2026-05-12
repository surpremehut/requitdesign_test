# 🚀 Installation & Startup Guide

## Schritt 1: Terminal öffnen
Öffne ein neues Terminal in VS Code (View → Terminal oder Ctrl+`)

## Schritt 2: In das Projektverzeichnis wechseln
```bash
cd /workspaces/requitdesign_test
```

## Schritt 3: Dependencies installieren
```bash
npm install
```

Dies installiert:
- express (Web-Framework)
- sqlite3 (Datenbank)
- bcryptjs (Passwort-Verschlüsselung)
- express-session (Session-Management)
- body-parser (Request-Parsing)
- dotenv (Umgebungsvariablen)

## Schritt 4: Server starten
```bash
npm start
```

Du solltest sehen:
```
Server läuft auf http://localhost:3000
Mit SQLite verbunden
Mit SQLite verbunden
Mit SQLite verbunden
Mit SQLite verbunden
Mit SQLite verbunden
Mit SQLite verbunden
Admin-Account erstellt: admin@requitdesign.de / Admin123!
Demo-Produkte erstellt
```

## 🎯 Admin-Dashboard öffnen

1. Öffne in deinem Browser: **http://localhost:3000/login.html**
2. Login mit:
   - Email: `admin@requitdesign.de`
   - Passwort: `Admin123!`
3. Nach dem Login wirst du automatisch zum Admin-Dashboard weitergeleitet

Alternative: **http://localhost:3000/admin.html** (direkt, wenn bereits angemeldet)

## 📍 Wichtige URLs

| Seite | URL |
|-------|-----|
| Startseite | http://localhost:3000/ |
| Produkte | http://localhost:3000/products |
| Login | http://localhost:3000/login.html |
| Registrierung | http://localhost:3000/register.html |
| Admin-Dashboard | http://localhost:3000/admin.html |

## ⚙️ Was das System kann

### Admin-Funktionen:
✅ Dashboard mit Statistiken (Benutzer, Bestellungen, Umsatz)
✅ Produkte hinzufügen, bearbeiten, löschen
✅ Produkte als "ausverkauft" markieren
✅ Alle Bestellungen anschauen
✅ Bestellungsstatus ändern (pending → processing → shipped → completed)
✅ Alle registrierten Benutzer sehen

### Benutzer-Funktionen:
✅ Neuen Account registrieren
✅ Login/Logout
✅ Produkte ansehen
✅ In Warenkorb legen
✅ Bestellung aufgeben

## 🛑 Server stoppen

Im Terminal: `Ctrl + C`

## 🔄 Neuer Start nach Stop

```bash
npm start
```

## ❌ Probleme?

**Port 3000 ist bereits besetzt?**
```bash
PORT=8000 npm start
```

**Datenbank zurücksetzen?**
```bash
rm data/requitdesign.db
npm start
```

**Dependencies-Probleme?**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📝 Nächste Schritte (Optional)

1. Die Startseite (`index.html`) kann einen "Login" Button in der Navigation bekommen
2. Die Produktseite kann echte Daten aus der Datenbank laden
3. Payment-Integration hinzufügen
4. Email-Notifications implementieren
5. Password-Reset implementieren

---

**Der Server läuft dann im Hintergrund und du kannst die Website über den Browser testen!**
