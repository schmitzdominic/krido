# Krido – Haushalts-Finanzmanagement-App

## Kontext
- Angular 20, Firebase Realtime Database (AngularFire 20), Bootstrap 5.3 (Dark-Theme), ng-bootstrap 19, RxJS 7.8, SCSS, PWA
- UI-Sprache: Deutsch (i18n mit `messages.en.xlf` für Englisch)
- Mehrere User teilen ein „Home" via PIN-Code

## Konventionen
- Services: `providedIn: 'root'`, DI via `inject()`
- Subscriptions: `takeUntilDestroyed()` (bevorzugt) oder `destroy$` + `takeUntil()`
- Kein NgRx – State über Services + Observables + localStorage (User)
- `searchName`: Lowercase, ohne Leerzeichen – für Suche/Filter
- `monthString`: Format `YYYYMM` (z.B. `"202501"`)
- Feature-Module pro Seite unter `pages/`, gemeinsame Komponenten unter `components/`

## Firebase-Struktur
```
/homes/{homeId}/accounts|budgets/(general|month|cycle)|entries|regular|invoice/settings|actualMonthString
/users/{uid}/email|displayName|home|mainAccount
```

## Kritische Logik
- **PredictService**: Läuft beim App-Start. Vergleicht `actualMonthString` mit aktuellem Monat. Bei Differenz: archiviert alte Budgets, erzeugt neue Monatsbudgets (mit optionalem Transfer bei `cycle.isTransfer`), generiert Einträge für wiederkehrende Transaktionen und Kreditkarten-Abrechnungen.
- **Kontosaldo**: `Account.updatedDate` MUSS beim Anlegen initialisiert werden, sonst wird `calculateRest()` in `InfoListEntryComponent` übersprungen.
- **DbService**: Generischer CRUD-Wrapper. Home-ID wird aus localStorage gelesen und gecacht.

## Build & Deploy

### Dev
```bash
npm run start
```

### Production Build
```bash
npx ng build --configuration=production --localize --progress
```
> Hinweis: `npm run build:production` funktioniert nicht (veraltete Flags). Immer `npx ng build ...` verwenden.

### Deploy (Firebase Hosting)
```bash
/home/dominics/.npm-global/bin/firebase deploy --only hosting
```
> `firebase` ist nicht im PATH. Firebase CLI liegt unter `/home/dominics/.npm-global/bin/firebase`.
> Projekt-ID: `krido-2d5f7` – Hosting URL: https://krido-2d5f7.web.app
