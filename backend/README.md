# Petitions-Backend — geschützt (Google Apps Script)

Warum: Ein anonymes, öffentliches Unterschreiben ohne exponierten Schreib­schlüssel geht nur mit einem **Server**, der die Daten annimmt und selbst schreibt. Dieses Apps-Script ist genau das: der Server hält den **einzigen** Schreibzugriff auf ein Google Sheet. Der Browser kann nur **Daten posten** — nichts löschen, nichts überschreiben, keine fremden Daten lesen. Damit ist **kein Wipe/Vandalismus** des Bestands möglich (schlimmstenfalls Spam-Anhängen, im Sheet moderierbar). Zusätzlich: Honeypot + Lock (Flut-Schutz), plus clientseitiges Rate-Limit.

## Deploy (ca. 2 Minuten, einmalig)
1. **Google Sheet anlegen:** [sheets.new](https://sheets.new) (mit heinrich.nax@gmail.com).
2. **Erweiterungen → Apps Script** öffnen.
3. Den gesamten Inhalt von **`Code.gs`** einfügen (vorhandenen Code ersetzen), **speichern** (💾).
4. **Bereitstellen → Neue Bereitstellung** → Zahnrad → Typ **Web-App**.
   - *Beschreibung:* schwimmen-am-main
   - *Ausführen als:* **Ich**
   - *Zugriff:* **Jeder** (auch anonym)
   - **Bereitstellen** → Zugriff genehmigen → die **Web-App-URL** (endet auf `/exec`) kopieren.
5. In **`index.html`** die Zeile `appsUrl:""` auf die kopierte URL setzen, z. B.
   `appsUrl:"https://script.google.com/macros/s/AKfy.../exec",`
   dann committen & pushen. Status auf der Seite wechselt auf **„● geschützt · geteilt · live".**

## Sicherheitsmodell
- **Kein Schreib-Secret im Client.** Der Client ruft nur die `/exec`-URL auf; was passiert, entscheidet der Server.
- **Append-only.** Der Server hängt nur Zeilen an — kein Endpoint zum Löschen/Überschreiben.
- **Honeypot** (`hp`-Feld) verwirft Bots; **Lock** verhindert Flut; **Rate-Limit** im Client (1 / 45 s).
- **Moderation:** unerwünschte Zeilen einfach im Sheet löschen.

## Fallback ohne Backend
Solange `appsUrl` leer ist, nutzt die Seite `kvdb.io` (geteilt, aber offen) und – falls nicht erreichbar – `localStorage` (nur lokal). Der Status zeigt den Modus an.
