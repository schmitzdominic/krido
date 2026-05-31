---
description: Baut die Krido-App und deployed sie auf Firebase Hosting
---

Führe folgende Schritte in dieser Reihenfolge aus:

1. **Production Build** erstellen:
   ```bash
   cd /home/dominics/Repositories/krido && npx ng build --configuration=production --localize --progress
   ```
   Warte auf erfolgreiche Fertigstellung. Bei Fehlern abbrechen und melden.

2. **Firebase Hosting Deploy**:
   ```bash
   /home/dominics/.npm-global/bin/firebase deploy --only hosting
   ```

3. Bestätige das Ergebnis mit der Hosting-URL: https://krido-2d5f7.web.app
