# Krido – Haushalts-Finanzmanagement

Krido ist eine kollaborative PWA zur gemeinsamen Haushaltsverwaltung. Mehrere Nutzer teilen sich ein „Home" über einen PIN-Code und verwalten gemeinsam Konten, Budgets und wiederkehrende Ausgaben.

## Tech-Stack

| Schicht | Technologie | Version |
|---|---|---|
| Framework | Angular | ~21 |
| Datenbank | Firebase Realtime Database | 12 |
| Styles | Bootstrap (Dark-Theme) | 5.3 |
| UI-Komponenten | ng-bootstrap | 20 |
| Icons | Bootstrap Icons | 1.10 |
| Reaktiv | RxJS | 7.8 |
| PWA | Angular Service Worker | ~21 |
| i18n | Angular Localize | ~21 |

---

## Features

### Dashboard (`/home`)
- Übersicht aller Budgets des aktuellen Monats (mit Fortschrittsbalken)
- Allzeit-Budgets (ohne Zeitbezug)
- Buchungsliste des aktuellen Monats
- Detailansicht einzelner Budgets per Modal (zugehörige Buchungen, Restbetrag)

### Konten (`/accounts`)
- Verwaltung von Girokonten und Kreditkarten
- Kontostand manuell setzen (mit Zeitstempel)
- Eigentümer pro Konto festlegen

### Budgets (`/budgets`)
- **Monatliche Budgets**: Werden jeden Monat neu aus Zyklen erzeugt
- **Allzeit-Budgets**: Dauerhaft ohne Monatsbezug
- **Zyklen**: Vorlagen für monatliche Budgets; optionaler Übertrag des Restbetrags in den Folge­monat (`isTransfer`)
- Archiv: vergangene Monatsbudgets einsehbar

### Buchungen / History (`/history`)
- Volltext-Suche in allen Buchungen
- Filter nach Konto und Monatsbereich
- Tabellarische Transaktionshistorie

### Regelmäßige Buchungen (`/regularly`)
- Wiederkehrende Einnahmen und Ausgaben (monatlich, quartalsweise, jährlich)
- Werden beim Monats­wechsel automatisch als Buchungen angelegt

### Kreditkarten-Abrechnung (`/invoice`)
- Konfiguration: Kreditkarte + Quellkonten
- Automatische Erstellung von Abrechnungsbuchungen zum `creditDay` der Karte

### Einstellungen (`/settings`)
- Home-Verwaltung (Name, PIN)
- Benutzereinstellungen (Anzeigename, Standard-Konto)

---

## Automatischer Monatswechsel (PredictService)

Beim App-Start vergleicht der `PredictService` `home.actualMonthString` mit dem aktuellen Monat. Liegt eine Differenz vor:

1. Alte Monatsbudgets werden **archiviert**
2. Aus Zyklen werden neue Monatsbudgets erstellt (mit optionalem Übertrag)
3. Regelmäßige Buchungen werden für den neuen Monat angelegt
4. Kreditkarten-Abrechnungen werden generiert
5. `actualMonthString` wird aktualisiert

---

## Datenmodell (Firebase)

```
/homes/{homeId}/
  ├── name, searchName, pin, actualMonthString
  ├── accounts/{id}       → Konto (Giro/Kreditkarte)
  ├── budgets/
  │   ├── general/{id}    → Allzeit-Budget
  │   ├── month/{id}      → Monatsbudget (validityPeriod = YYYYMM)
  │   └── cycle/{id}      → Zyklus-Vorlage
  ├── entries/{id}        → Buchung
  ├── regular/{id}        → Wiederkehrende Buchung
  └── invoice/settings    → Kreditkarten-Abrechnung­skonfiguration

/users/{uid}/
  ├── email, displayName
  ├── home                → searchName des Homes
  └── mainAccount         → Standard-Konto
```

---

## Authentifizierung & Mehrbenutzer

- Firebase Authentication (E-Mail/Passwort)
- Alle Routen durch `AuthGuard` geschützt
- Neues Home erstellen oder bestehendem via PIN beitreten
- Mehrere Nutzer teilen dasselbe Home und sehen dieselben Daten

---

## Lokalisierung

- Primärsprache: **Deutsch**
- Englische Übersetzungen: `src/assets/locale/messages.en.xlf`
- Build mit `--localize` erzeugt separate Bundles pro Sprache

---

## Entwicklung & Build

```bash
# Entwicklungsserver (HTTPS)
npm run start
# oder
ng serve --ssl

# Produktions-Build (mit Lokalisierung)
npm run build:production
# Ausgabe: dist/krido/browser/{de|en}/
```

### Deployment

Firebase Hosting – konfiguriert in `firebase.json`. Der Produktions-Build wird über `dist/krido/browser/de` ausgeliefert. Alle Routen werden auf `index.html` umgeleitet (SPA).

---

## PWA

Die App ist als Progressive Web App konfiguriert:
- Installierbar auf Mobilgeräten und Desktop
- App-Shell (HTML, CSS, JS) wird beim Install gecacht
- Assets (Bilder, Fonts) werden lazy gecacht
- Service Worker wird nur im Produktions-Build registriert

